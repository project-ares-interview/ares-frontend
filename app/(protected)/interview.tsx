import { AnalysisResultPanel } from '@/components/interview/AnalysisResultPanel';
import { PercentileAnalysisPanel } from '@/components/interview/PercentileAnalysisPanel';
import { RealtimeFeedbackPanel } from '@/components/interview/RealtimeFeedbackPanel';
import { useInterview } from '@/hooks/useInterview';
import { useInterviewSessionStore } from '@/stores/interviewStore';
import { CameraView } from 'expo-camera';
import React, { useEffect } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

const InterviewScreen = () => {
  const {
    hasPermission,
    isAnalyzing, // Overall session state
    isRecording, // Audio recording state
    status,
    transcript,
    realtimeFeedback,
    finalResults,
    cameraRef,
    startAnalysis, // Starts the whole session
    stopAnalysis,  // Ends the whole session
    startRecording,// Starts only audio recording
    stopRecording, // Stops only audio recording
    aiAdvice,
    isFetchingAdvice,
    getAIAdvice,
    percentileAnalysis,
    isFetchingPercentiles,
    getPercentileAnalysis,
  } = useInterview();
  const { current_question } = useInterviewSessionStore();

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

      {/* --- Main Controls --- */}
      {!isAnalyzing ? (
        <View style={styles.buttonContainer}>
          <Button 
            title="AI 면접 시작"
            onPress={startAnalysis} 
            disabled={isAnalyzing}
          />
        </View>
      ) : (
        <View style={styles.controlsContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title="답변 시작하기"
              onPress={startRecording}
              disabled={isRecording}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="답변 끝내기"
              onPress={stopRecording}
              disabled={!isRecording}
              color="#f44336"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="면접 종료하기"
              onPress={stopAnalysis}
              disabled={!isAnalyzing}
              color="#4CAF50"
            />
          </View>
        </View>
      )}

      <ScrollView>
        {isAnalyzing && current_question && (
          <View style={styles.questionPanel}>
            <Text style={styles.panelTitle}>질문</Text>
            <Text style={styles.questionText}>{current_question}</Text>
          </View>
        )}
        
        {isAnalyzing && (
          <View style={styles.transcriptionPanel}>
            <Text style={styles.panelTitle}>실시간 답변</Text>
            <Text style={styles.transcriptionText}>
              {transcript || status}
            </Text>
          </View>
        )}

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

        {finalResults.voice && percentileAnalysis && (
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
  questionPanel: {
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#91d5ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#0050b3',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  buttonContainer: {
    marginVertical: 16,
  },
  buttonWrapper: {
    marginHorizontal: 8,
  },
});

export default InterviewScreen;