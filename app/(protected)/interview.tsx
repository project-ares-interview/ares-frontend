import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { Camera } from 'expo-camera';
import { useInterview } from '@/hooks/useInterview';
import { InterviewControls } from '@/components/interview/InterviewControls';
import { RealtimeFeedbackPanel } from '@/components/interview/RealtimeFeedbackPanel';
import { AnalysisResultPanel } from '@/components/interview/AnalysisResultPanel';

const InterviewScreen = () => {
  const {
    hasPermission,
    isAnalyzing,
    status,
    transcript,
    realtimeFeedback,
    finalResults,
    cameraRef,
    startAnalysis,
    stopAnalysis,
  } = useInterview();

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>카메라 권한 요청 상태: {status}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 면접 코칭</Text>

      <View style={styles.videoContainer}>
        <Camera style={styles.camera} type={Camera.Type.front} ref={cameraRef} />
      </View>

      <InterviewControls
        isAnalyzing={isAnalyzing}
        onStart={startAnalysis}
        onFinish={stopAnalysis} // Correct prop name is onFinish
        startDisabled={!hasPermission || isAnalyzing}
      />

      <ScrollView style={styles.transcriptionPanel}>
        <Text style={styles.panelTitle}>실시간 답변</Text>
        <Text style={styles.transcriptionText}>{transcript || status}</Text>
      </ScrollView>

      <RealtimeFeedbackPanel feedback={realtimeFeedback} />

      {finalResults.voice && finalResults.video && (
        <AnalysisResultPanel
          voiceScores={finalResults.voice} // Correct prop name
          videoAnalysis={finalResults.video} // Correct prop name
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f7f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  camera: {
    flex: 1,
  },
  transcriptionPanel: {
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    minHeight: 80,
    marginBottom: 20,
    flexGrow: 0, // Prevent ScrollView from taking over the flexbox
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2d3748',
  },
});

export default InterviewScreen;
