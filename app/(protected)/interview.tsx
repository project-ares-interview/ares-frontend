import { AnalysisResultPanel } from '@/components/interview/AnalysisResultPanel';
import { InterviewControls } from '@/components/interview/InterviewControls';
import { PercentileAnalysisPanel } from '@/components/interview/PercentileAnalysisPanel';
import { RealtimeFeedbackPanel } from '@/components/interview/RealtimeFeedbackPanel';
import { useInterview } from '@/hooks/useInterview';
import { CameraView } from 'expo-camera'; // ← 수정된 import
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
    aiAdvice,
    isFetchingAdvice,
    getAIAdvice,
    percentileAnalysis,
    isFetchingPercentiles,
    getPercentileAnalysis,
  } = useInterview();

  useEffect(() => {
    if (cameraRef.current) {
      console.log('✅ CameraView가 성공적으로 연결되었습니다.');
    } else {
      console.log('🟡 CameraView가 아직 연결되지 않았습니다.');
    }
  }, [cameraRef.current]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>카메라 권한 요청 상태: {status}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI 면접 코칭</Text>
      
      <View style={styles.videoContainer}>
        <CameraView
          style={styles.camera}
          ref={cameraRef}
        />
      </View>

      <ScrollView>
        <View style={styles.transcriptionPanel}>
          <Text style={styles.panelTitle}>실시간 답변</Text>
          <Text style={styles.transcriptionText}>
            {transcript || status}
          </Text>
        </View>

        <InterviewControls
          isAnalyzing={isAnalyzing}
          onStart={startAnalysis}
          onStop={stopAnalysis}
        />

        <RealtimeFeedbackPanel feedback={realtimeFeedback} />

        {finalResults.voice && finalResults.video && (
          <AnalysisResultPanel 
            voiceScores={finalResults.voice} 
            videoAnalysis={finalResults.video}
            aiAdvice={aiAdvice}
            isFetchingAdvice={isFetchingAdvice}
            onGetAIAdvice={getAIAdvice}
          />
        )}

        {percentileAnalysis && (
          <PercentileAnalysisPanel 
            percentileData={percentileAnalysis}
            isLoading={isFetchingPercentiles}
            onUpdateAnalysis={getPercentileAnalysis}
          />
        )}
      </ScrollView>
    </ScrollView>
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