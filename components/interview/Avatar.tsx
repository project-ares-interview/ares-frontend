import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';

declare global {
  interface Window {
    SpeechSDK: any;
  }
}

export interface AvatarRef {
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

const htmlEncode = (text: string) => {
    const entityMap: {[key: string]: string} = {
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;'
    };
    return String(text).replace(/[&<>"'\/]/g, (m) => entityMap[m]);
}

const Avatar = forwardRef<AvatarRef, {}>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const avatarSynthesizer = useRef<any>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isAvatarReady, setIsAvatarReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const spokenTextQueue = useRef<string[]>([]);
  const pendingSpeakRequest = useRef<string | null>(null);

  const avatarProfiles = [
    { character: 'harry', style: 'business', voice: 'ko-KR-BongJinNeural' },
    { character: 'jeff', style: 'business', voice: 'ko-KR-InJoonNeural' },
    { character: 'lori', style: 'graceful', voice: 'ko-KR-JiMinNeural' },
    { character: 'lisa', style: 'casual-sitting', voice: 'ko-KR-SoonBokNeural' }
  ];

  const [selectedProfile] = useState(() => {
      const randomIndex = Math.floor(Math.random() * avatarProfiles.length);
      return avatarProfiles[randomIndex];
  });

  const config = {
    speechKey: process.env.EXPO_PUBLIC_SPEECHKEY,
    speechRegion: 'eastus2',
    ttsVoice: selectedProfile.voice,
    avatarCharacter: selectedProfile.character,
    avatarStyle: selectedProfile.style,
  };

  const speakNext = (text: string) => {
    setIsSpeaking(true);

    // Watchdog timer to prevent isSpeaking from getting stuck
    const speechDurationEstimate = text.length * 150; // Estimate 150ms per character
    const timeoutId = setTimeout(() => {
      console.warn(`Speech for "${text.substring(0, 20)}..." seems stuck. Resetting speaking state.`);
      // Check queue before resetting
      const nextText = spokenTextQueue.current.shift();
      if (nextText) {
        speakNext(nextText);
      } else {
        setIsSpeaking(false);
      }
    }, speechDurationEstimate + 5000); // Add a 5-second buffer

    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='ko-KR'>
                    <voice name='${config.ttsVoice}'><mstts:ttsembedding><mstts:leadingsilence-exact value='0'/>${htmlEncode(text)}</mstts:ttsembedding></voice>
                  </speak>`;

    avatarSynthesizer.current.speakSsmlAsync(ssml,
      (result: any) => {
        clearTimeout(timeoutId); // Speech finished, clear the watchdog
        if (result.reason !== window.SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.error(`Speech synthesis canceled for "${text.substring(0, 20)}...": ${result.errorDetails}`);
        }
        const nextText = spokenTextQueue.current.shift();
        if (nextText) {
          speakNext(nextText);
        } else {
          setIsSpeaking(false);
        }
      },
      (err: any) => {
        clearTimeout(timeoutId); // Speech failed, clear the watchdog
        console.error(`speakSsmlAsync error for "${text.substring(0, 20)}...": ${err}`);
        setIsSpeaking(false);
      }
    );
  };

  useImperativeHandle(ref, () => ({
    speak: (text: string) => {
      if (!isAvatarReady) {
        console.log('Avatar not ready, queuing speak request for: ', text);
        pendingSpeakRequest.current = text;
        return;
      }
      
      pendingSpeakRequest.current = null;
      if (isSpeaking) {
        spokenTextQueue.current.push(text);
      } else {
        speakNext(text);
      }
    },
    stopSpeaking: () => {
      spokenTextQueue.current = [];
      pendingSpeakRequest.current = null;
      if (avatarSynthesizer.current && isSpeaking) {
        avatarSynthesizer.current.stopSpeakingAsync(() => setIsSpeaking(false), (err: any) => console.error('Failed to stop speaking:', err));
      }
    }
  }));

  useEffect(() => {
    if (isAvatarReady && pendingSpeakRequest.current) {
      console.log('Avatar is now ready, processing pending speak request.');
      speakNext(pendingSpeakRequest.current);
      pendingSpeakRequest.current = null;
    }
  }, [isAvatarReady]);

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
});

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%', backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 8, overflow: 'hidden' },
  video: { width: '100%', height: '100%', objectFit: 'cover' },
  text: { color: 'white' },
  loadingText: { position: 'absolute', color: 'white' }
});

export default Avatar;
