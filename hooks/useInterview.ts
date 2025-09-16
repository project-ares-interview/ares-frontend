import { VideoAnalysis, VoiceScores } from '@/components/interview/AnalysisResultPanel';
import { RealtimeFeedbackData } from '@/components/interview/RealtimeFeedbackPanel';
import { decode } from 'base-64';
import { Audio } from 'expo-av';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


const WS_URL = process.env.EXPO_PUBLIC_WS_URL;

/**
 * Resamples the audio buffer to the target sample rate.
 * @param {Float32Array} inputBuffer - The original audio data.
 * @param {number} sourceSampleRate - The original sample rate.
 * @param {number} targetSampleRate - The target sample rate.
 * @returns {Float32Array} - The resampled audio data.
 */
function resampleBuffer(inputBuffer: Float32Array, sourceSampleRate: number, targetSampleRate: number): Float32Array {
  if (sourceSampleRate === targetSampleRate) {
    return inputBuffer;
  }
  const sampleRateRatio = sourceSampleRate / targetSampleRate;
  const newLength = Math.round(inputBuffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0, count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < inputBuffer.length; i++) {
      accum += inputBuffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}


export const useInterview = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState('카메라 및 마이크 권한을 허용해주세요...');
  const [transcript, setTranscript] = useState('');
  const [realtimeFeedback, setRealtimeFeedback] = useState<RealtimeFeedbackData | null>(null);
  const [finalResults, setFinalResults] = useState<{ voice: VoiceScores | null; video: VideoAnalysis | null }>({ voice: null, video: null });
  const [localStream, setLocalStream] = useState<MediaStream | null>(null); // State for web's MediaStream

  // --- Refs for both platforms ---
  const cameraRef = useRef<CameraView>(null);
  const sockets = useRef<{
    results: WebSocket | null;
    audio: WebSocket | null;
    video: WebSocket | null;
  }>({ results: null, audio: null, video: null });
  const videoFrameSender = useRef<ReturnType<typeof setInterval> | null>(null);
  const fullTranscript = useRef('');
  
  // --- Native-specific refs ---
  const audioRecording = useRef<Audio.Recording | null>(null);
  const audioLastReadPosition = useRef(0);
  
  // --- Web-specific refs ---
  const webAudio = useRef<{
    localStream: MediaStream | null;
    audioContext: AudioContext | null;
    audioSource: MediaStreamAudioSourceNode | null;
    audioProcessor: ScriptProcessorNode | null;
  }>({ localStream: null, audioContext: null, audioSource: null, audioProcessor: null });

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'web') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
          setLocalStream(stream); // Store stream in state to trigger effect
          webAudio.current.localStream = stream; // Also keep in ref for audio logic
          setHasPermission(true);
          setStatus('분석 시작 버튼을 누르면 음성 인식이 시작됩니다.');
        } catch (err) {
          console.error("getUserMedia error:", err);
          setStatus('카메라/마이크 권한이 필요합니다. 브라우저 설정을 확인해주세요.');
        }
      } else { // Native
        const { status } = await Camera.requestCameraPermissionsAsync();
        const audioPerm = await Audio.requestPermissionsAsync();
        if (status === 'granted' && audioPerm.status === 'granted') {
          setHasPermission(true);
          setStatus('분석 시작 버튼을 누르면 음성 인식이 시작됩니다.');
          await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        } else {
          setStatus('카메라/마이크 권한이 필요합니다.');
        }
      }
    };
    requestPermissions();

    return () => {
      // Cleanup function
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      closeWebSockets();
      stopSendingVideoFrames();
      if (Platform.OS !== 'web') {
        stopRecording_Native(false);
      }
    };
  }, []); // This effect should run only once on mount

  // New effect to safely attach the stream to the video element on web
  useEffect(() => {
    if (Platform.OS === 'web' && cameraRef.current && localStream) {
      const videoElement = (cameraRef.current as any).video;
      if (videoElement) {
        videoElement.srcObject = localStream;
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('muted', '');
        videoElement.play();
      }
    }
  }, [localStream]); // Reruns when the localStream state is set

  // --- WebSocket Logic (Common) ---
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
    
    sockets.current.results.onopen = () => {
      sendJsonMessage(sockets.current.results, 'toggle_analysis', { analyze: true });
    };
    sockets.current.audio.onopen = () => {
      // startAudioStreaming(); // This is now handled by the event listener
    };
    sockets.current.video.onopen = () => {
      startSendingVideoFrames();
    };

    sockets.current.results.onerror = (e: Event) => console.error('Results socket error', (e as any).message);
    sockets.current.audio.onerror = (e: Event) => console.error('Audio socket error', (e as any).message);
    sockets.current.video.onerror = (e: Event) => console.error('Video socket error', (e as any).message);
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

  // --- Video Streaming Logic (Reverted to previous working version) ---
  const startSendingVideoFrames = () => {
    stopSendingVideoFrames();
    videoFrameSender.current = setInterval(async () => {
      if (!cameraRef.current || sockets.current.video?.readyState !== WebSocket.OPEN) {
        return;
      }
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
        if (photo && photo.uri) {
          const response = await fetch(photo.uri);
          const blob = await response.blob();
          sockets.current.video.send(blob);
        }
      } catch (error) {
        console.error('Error taking picture and sending as blob:', error);
      }
    }, 500);
  };
  
  const stopSendingVideoFrames = () => {
    if (videoFrameSender.current) {
      clearInterval(videoFrameSender.current);
      videoFrameSender.current = null;
    }
  };

  // --- Audio Streaming Logic (Platform-specific) ---
  const startAudioProcessing = async () => {
    if (Platform.OS === 'web') {
      startAudioProcessing_Web();
    } else {
      await startRecording_Native();
    }
  };

  const stopAudioProcessing = async () => {
    if (Platform.OS === 'web') {
      stopAudioProcessing_Web();
    } else {
      await stopRecording_Native(true); // true to send final chunk
    }
  };

  // --- Web Audio Implementation ---
  const startAudioProcessing_Web = () => {
    const stream = webAudio.current.localStream;
    if (!stream) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioSource = audioContext.createMediaStreamSource(stream);
    const audioProcessor = audioContext.createScriptProcessor(4096, 1, 1);
    
    const targetSampleRate = 16000;

    audioProcessor.onaudioprocess = (e) => {
      if (sockets.current.audio?.readyState !== WebSocket.OPEN) return;
      
      const inputData = e.inputBuffer.getChannelData(0);
      const sourceSampleRate = audioContext.sampleRate;
      
      const resampledData = resampleBuffer(inputData, sourceSampleRate, targetSampleRate);
      
      const int16Data = new Int16Array(resampledData.length);
      for (let i = 0; i < resampledData.length; i++) {
        int16Data[i] = Math.max(-1, Math.min(1, resampledData[i])) * 32767;
      }
      sockets.current.audio!.send(int16Data.buffer);
    };

    audioSource.connect(audioProcessor);
    audioProcessor.connect(audioContext.destination);

    webAudio.current = { ...webAudio.current, audioContext, audioSource, audioProcessor };
  };

  const stopAudioProcessing_Web = () => {
    webAudio.current.audioSource?.disconnect();
    webAudio.current.audioProcessor?.disconnect();
    webAudio.current.audioContext?.close();
  };

  // --- Native Audio Implementation ---
  const startRecording_Native = async () => {
    try {
      if (audioRecording.current) {
        await stopRecording_Native(false);
      }
      const recording = new Audio.Recording();
      audioLastReadPosition.current = 0;

      recording.setOnRecordingStatusUpdate(async (status) => {
        if (!status.isRecording) return;
        
        const uri = status.uri;
        if (!uri || sockets.current.audio?.readyState !== WebSocket.OPEN) {
          return;
        }

        try {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (!fileInfo.exists || !('size' in fileInfo)) return;

          const newBytes = fileInfo.size - audioLastReadPosition.current;
          if (newBytes > 0) {
            const audioDataChunkBase64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
              position: audioLastReadPosition.current,
              length: newBytes,
            });
            
            const binaryString = decode(audioDataChunkBase64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const audioBlob = new Blob([bytes]);

            sockets.current.audio.send(audioBlob);
            audioLastReadPosition.current = fileInfo.size;
          }
        } catch (e) {
          console.error('❌ [Audio] Error in onRecordingStatusUpdate:', e);
        }
      });
      
      const recordingOptions = {
        isMeteringEnabled: true,
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
        }
      };

      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      audioRecording.current = recording;
      console.log('✅ [Audio][Native] Recording started.');
    } catch (err) {
      console.error('❌ [Audio][Native] Failed to start recording:', err);
    }
  };

  const stopRecording_Native = async (sendFinalChunk: boolean) => {
    if (!audioRecording.current) return;
    
    if (sendFinalChunk) {
      try {
        const status = await audioRecording.current.getStatusAsync();
        const uri = status.uri;

        if (uri) {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (fileInfo.exists && 'size' in fileInfo && fileInfo.size > audioLastReadPosition.current) {
            const finalBytes = fileInfo.size - audioLastReadPosition.current;
            const finalAudioChunkBase64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
                position: audioLastReadPosition.current,
                length: finalBytes,
              });
              
              const binaryString = decode(finalAudioChunkBase64);
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
              }
              const finalAudioBlob = new Blob([bytes]);
              sockets.current.audio.send(finalAudioBlob);
          }
        }
      } catch (e) {
        console.error('Error sending final audio chunk:', e);
      }
    }

    try {
      await audioRecording.current.setOnRecordingStatusUpdate(null);
      await audioRecording.current.stopAndUnloadAsync();
    } catch (error) {
      console.error('Error stopping native recording:', error);
    }
    audioRecording.current = null;
  };

  // --- Main Control Functions ---
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
    setupWebSockets(sessionId); // Setup sockets first

    // Wait for sockets to open before starting streams
    const waitForSockets = setInterval(() => {
        if (sockets.current.audio?.readyState === WebSocket.OPEN && 
            sockets.current.video?.readyState === WebSocket.OPEN) {
            clearInterval(waitForSockets);
            startSendingVideoFrames();
            startAudioProcessing();
            sendJsonMessage(sockets.current.results, 'toggle_analysis', { analyze: true });
        }
    }, 100);
  };

  const stopAnalysis = async () => {
    setIsAnalyzing(false);
    setStatus('분석을 종료하고 결과를 확인합니다...');
    stopSendingVideoFrames();
    await stopAudioProcessing();
    
    sendJsonMessage(sockets.current.results, 'finish_analysis_signal', {});
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