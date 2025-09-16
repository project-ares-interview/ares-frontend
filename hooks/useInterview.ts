import { useState, useRef, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { RealtimeFeedbackData } from '@/components/interview/RealtimeFeedbackPanel';
import { VoiceScores, VideoAnalysis } from '@/components/interview/AnalysisResultPanel';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


const WS_URL = process.env.EXPO_PUBLIC_WS_URL;

export const useInterview = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState('카메라 및 마이크 권한을 허용해주세요...');
  const [transcript, setTranscript] = useState('');
  const [realtimeFeedback, setRealtimeFeedback] = useState<RealtimeFeedbackData | null>(null);
  const [finalResults, setFinalResults] = useState<{ voice: VoiceScores | null; video: VideoAnalysis | null }>({ voice: null, video: null });

  const cameraRef = useRef<Camera>(null);
  const audioRecording = useRef<Audio.Recording | null>(null);
  const sockets = useRef<{
    results: WebSocket | null;
    audio: WebSocket | null;
    video: WebSocket | null;
  }>({ results: null, audio: null, video: null });

  const videoFrameSender = useRef<NodeJS.Timeout | null>(null);
  const fullTranscript = useRef('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const audioPerm = await Audio.requestPermissionsAsync();
      if (status === 'granted' && audioPerm.status === 'granted') {
        setHasPermission(true);
        setStatus('분석 시작 버튼을 누르면 음성 인식이 시작됩니다.');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      } else {
        setStatus('카메라/마이크 권한이 필요합니다.');
      }
    })();

    return () => {
      closeWebSockets();
      stopSendingVideoFrames();
      stopRecording();
    };
  }, []);

  const handleSocketEvent = (event: MessageEvent) => {
    const content = JSON.parse(event.data);
    switch (content.event) {
      case 'speech_update':
        if (!content.data.text) return;
        if (content.data.type === 'recognized') {
          fullTranscript.current += content.data.text + ' ';
          setTranscript(fullTranscript.current);
        } else {
          setTranscript(fullTranscript.current + content.data.text);
        }
        break;
      case 'realtime_video_update':
        setRealtimeFeedback(content.data);
        break;
      case 'analysis_pending':
        setStatus(content.data.message);
        break;
      case 'voice_scores_update':
        setFinalResults(prev => ({ ...prev, voice: content.data }));
        break;
      case 'video_analysis_update':
        setFinalResults(prev => ({ ...prev, video: content.data }));
        break;
      case 'error':
        setStatus(`오류: ${content.data.message}`);
        break;
    }
  };

  const setupWebSockets = (sessionId: string) => {
    if (!WS_URL) {
      setStatus('웹소켓 서버 주소가 설정되지 않았습니다.');
      console.error('WebSocket URL is not set.');
      return;
    }
    const wsScheme = WS_URL.startsWith('wss') ? 'wss' : 'ws';
    const host = WS_URL.replace(/^(wss?:\/\/)/, '');

    sockets.current.results = new WebSocket(`${wsScheme}://${host}/ws/interview/results/${sessionId}/`);
    sockets.current.audio = new WebSocket(`${wsScheme}://${host}/ws/interview/audio/${sessionId}/`);
    sockets.current.video = new WebSocket(`${wsScheme}://${host}/ws/interview/video/${sessionId}/`);

    sockets.current.results.onmessage = handleSocketEvent;

    sockets.current.results.onopen = () => console.log('Results socket connected');
    sockets.current.audio.onopen = () => console.log('Audio socket connected');
    sockets.current.video.onopen = () => console.log('Video socket connected');

    sockets.current.results.onerror = (e) => console.error('Results socket error', e.message);
    sockets.current.audio.onerror = (e) => console.error('Audio socket error', e.message);
    sockets.current.video.onerror = (e) => console.error('Video socket error', e.message);
  };

  const closeWebSockets = () => {
    sockets.current.results?.close();
    sockets.current.audio?.close();
    sockets.current.video?.close();
  };

  const sendJsonMessage = (socket: WebSocket | null, event: string, data: object) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ event, data }));
    }
  };

  const startSendingVideoFrames = () => {
    stopSendingVideoFrames(); // Ensure no multiple intervals are running
    videoFrameSender.current = setInterval(async () => {
      if (cameraRef.current && sockets.current.video?.readyState === WebSocket.OPEN) {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: true });
        sockets.current.video.send(photo.base64 as string);
      }
    }, 500); // 2 FPS
  };

  const stopSendingVideoFrames = () => {
    if (videoFrameSender.current) {
      clearInterval(videoFrameSender.current);
      videoFrameSender.current = null;
    }
  };

  const startRecording = async () => {
    try {
      await stopRecording(); // Ensure previous recording is stopped
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      // This is a workaround to get audio data periodically.
      recording.setOnRecordingStatusUpdate(async (status) => {
        if (!status.isRecording) return;
        const uri = recording.getURI();
        if (uri) {
            try {
                const audioData = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                if (sockets.current.audio?.readyState === WebSocket.OPEN) {
                    // The backend will need to handle base64 encoded audio file data
                    // instead of raw PCM stream.
                    sockets.current.audio.send(audioData);
                }
            } catch (e) {
                console.error('Error reading audio file:', e);
            }
        }
      });
      await recording.startAsync();
      audioRecording.current = recording;
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!audioRecording.current) return;
    try {
      await audioRecording.current.stopAndUnloadAsync();
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
    audioRecording.current = null;
  };

  const startAnalysis = async () => {
    if (!hasPermission) {
      setStatus('카메라/마이크 권한이 필요합니다.');
      return;
    }
    setIsAnalyzing(true);
    setFinalResults({ voice: null, video: null });
    setTranscript('');
    fullTranscript.current = '';
    setStatus('답변을 말씀해주세요...');

    const sessionId = uuidv4();
    setupWebSockets(sessionId);

    // Delay to allow sockets to connect
    setTimeout(() => {
      startSendingVideoFrames();
      startRecording();
      sendJsonMessage(sockets.current.results, 'toggle_analysis', { analyze: true });
    }, 1000);
  };

  const stopAnalysis = async () => {
    setIsAnalyzing(false);
    setStatus('분석을 종료하고 결과를 확인합니다...');
    stopSendingVideoFrames();
    await stopRecording();
    sendJsonMessage(sockets.current.results, 'finish_analysis_signal', {});
    // Sockets will be closed by the effect cleanup or when analysis is fully complete
  };

  return {
    hasPermission,
    isAnalyzing,
    status,
    transcript,
    realtimeFeedback,
    finalResults,
    cameraRef,
    startAnalysis,
    stopAnalysis,
  };
};