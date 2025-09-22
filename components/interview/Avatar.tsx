import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';

declare global {
  interface Window {
    SpeechSDK: any;
  }
}

interface AvatarProps {
  question: string | null;
  isRecording: boolean;
}

const htmlEncode = (text: string) => {
    const entityMap: {[key: string]: string} = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
    };
    return String(text).replace(/[&<>"'\/]/g, (m) => entityMap[m]);
}

const Avatar: React.FC<AvatarProps> = ({ question, isRecording }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const avatarSynthesizer = useRef<any>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isAvatarReady, setIsAvatarReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const spokenTextQueue = useRef<string[]>([]);

  const config = {
    speechKey: process.env.EXPO_PUBLIC_SPEECHKEY,
    speechRegion: 'eastus2',
    ttsVoice: 'ko-KR-BongJinNeural',
    avatarCharacter: 'harry',
    avatarStyle: 'business',
  };

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const scriptId = 'azure-speech-sdk';
    if (document.getElementById(scriptId)) {
      const checkSdk = setInterval(() => {
        if (window.SpeechSDK) {
          setIsSdkLoaded(true);
          clearInterval(checkSdk);
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://aka.ms/csspeech/jsbrowserpackageraw';
    script.async = true;
    script.onload = () => {
      console.log('Azure Speech SDK loaded.');
      setIsSdkLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  const startSession = async () => {
    if (!isSdkLoaded || !window.SpeechSDK || avatarSynthesizer.current) return;

    console.log('Starting avatar session...');
    const { SpeechSDK } = window;

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(config.speechKey, config.speechRegion);
    const avatarConfig = new SpeechSDK.AvatarConfig(config.avatarCharacter, config.avatarStyle);
    
    avatarSynthesizer.current = new SpeechSDK.AvatarSynthesizer(speechConfig, avatarConfig);

    try {
      const tokenResponse = await fetch(`https://${config.speechRegion}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`, {
        headers: { 'Ocp-Apim-Subscription-Key': config.speechKey }
      });
      if (!tokenResponse.ok) throw new Error(`Failed to get token: ${tokenResponse.status}`);
      
      const responseData = await tokenResponse.json();
      const iceServerUrl = responseData.Urls[0];
      const iceServerUsername = responseData.Username;
      const iceServerCredential = responseData.Password;

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: [iceServerUrl], username: iceServerUsername, credential: iceServerCredential }]
      });

      peerConnection.current.ontrack = (event: RTCTrackEvent) => {
        console.log(`Track received: ${event.track.kind}`);
        if (event.track.kind === 'video' && videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
        if (event.track.kind === 'audio' && audioRef.current) {
          audioRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.addTransceiver('video', { direction: 'sendrecv' });
      peerConnection.current.addTransceiver('audio', { direction: 'sendrecv' });

      const result = await avatarSynthesizer.current.startAvatarAsync(peerConnection.current);
      if (result.reason !== SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        console.error(`Unable to start avatar: ${result.errorDetails}`);
        stopSession();
      }
    } catch (error) {
      console.error('Failed to start avatar session:', error);
    }
  };

  const stopSession = () => {
    if (avatarSynthesizer.current) {
      avatarSynthesizer.current.close();
      avatarSynthesizer.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setIsAvatarReady(false);
    console.log('Avatar session stopped.');
  };

  useEffect(() => {
    if (isSdkLoaded && Platform.OS === 'web') {
      startSession();
    }
    return () => {
      if (Platform.OS === 'web') stopSession();
    };
  }, [isSdkLoaded]);

  const speakNext = (text: string) => {
    setIsSpeaking(true);
    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='ko-KR'>
                    <voice name='${config.ttsVoice}'><mstts:ttsembedding><mstts:leadingsilence-exact value='0'/>${htmlEncode(text)}</mstts:ttsembedding></voice>
                  </speak>`;

    avatarSynthesizer.current.speakSsmlAsync(ssml,
      (result: any) => {
        if (result.reason !== window.SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.error(`Speech synthesis canceled, ${result.errorDetails}`);
        }
        
        const nextText = spokenTextQueue.current.shift();
        if (nextText) {
          speakNext(nextText);
        } else {
          setIsSpeaking(false);
        }
      },
      (err: any) => {
        console.error(`speakSsmlAsync error: ${err}`);
        setIsSpeaking(false);
      }
    );
  };

  const speak = (text: string) => {
    if (!avatarSynthesizer.current || !isAvatarReady) return;
    if (isSpeaking) {
      spokenTextQueue.current.push(text);
    } else {
      speakNext(text);
    }
  };

  const stopSpeaking = () => {
    spokenTextQueue.current = [];
    if (avatarSynthesizer.current && isSpeaking) {
      avatarSynthesizer.current.stopSpeakingAsync(() => setIsSpeaking(false), (err: any) => console.error('Failed to stop speaking:', err));
    }
  };

  useEffect(() => {
    if (question && isAvatarReady) {
      speak(question);
    }
  }, [question, isAvatarReady]);

  useEffect(() => {
    if (isRecording) {
      stopSpeaking();
    }
  }, [isRecording]);

  if (Platform.OS !== 'web') {
    return <View style={styles.container}><Text style={styles.text}>아바타는 웹에서만 지원됩니다.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        style={styles.video as any}
        autoPlay
        playsInline
        muted
        onPlaying={() => {
          console.log('WebRTC video connected.');
          setIsAvatarReady(true);
        }}
      />
      <audio
        ref={audioRef}
        autoPlay
        onPlaying={() => console.log('WebRTC audio connected.')}
      />
      {!isAvatarReady && <Text style={styles.loadingText}>아바타 로딩 중...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%', backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 8, overflow: 'hidden' },
  video: { width: '100%', height: '100%', objectFit: 'cover' },
  text: { color: 'white' },
  loadingText: { position: 'absolute', color: 'white' }
});

export default Avatar;
