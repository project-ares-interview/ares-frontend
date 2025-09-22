import { AIAdvicePanel } from '@/components/interview/AIAdvicePanel';
import { VideoAnalysisPanel } from '@/components/interview/VideoAnalysisPanel';
import { VoiceAnalysisPanel } from '@/components/interview/VoiceAnalysisPanel';
import { PercentileAnalysisPanel } from '@/components/interview/PercentileAnalysisPanel';
import { RealtimeFeedbackPanel } from '@/components/interview/RealtimeFeedbackPanel';
import { TextAnalysisReport } from '@/components/interview/TextAnalysisReport';
import { TextAnalysisLoading } from '@/components/interview/TextAnalysisLoading';
import Avatar from '@/components/interview/Avatar';
import { useInterview } from '@/hooks/useInterview';
import { useInterviewSessionStore } from '@/stores/interviewStore';
import { CameraView } from 'expo-camera';
import React, { useEffect } from 'react';
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';



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
    textAnalysis,
    isFetchingNextQuestion,
  } = useInterview();
  const { current_question } = useInterviewSessionStore();

  useEffect(() => {
    if (cameraRef.current) {
      console.log('✅ CameraView가 성공적으로 연결되었습니다.');
    } else {
      console.log('🟡 CameraView가 아직 연결되지 않았습니다.');
    }
  }, [cameraRef.current]);

  useEffect(() => {
    if (finalResults.voice && finalResults.video && !aiAdvice && !isFetchingAdvice) {
      getAIAdvice();
    }
  }, [finalResults.voice, finalResults.video, aiAdvice, isFetchingAdvice, getAIAdvice]);

  useEffect(() => {
    if (cameraRef.current) {
      console.log('✅ CameraView가 성공적으로 연결되었습니다.');
    } else {
      console.log('🟡 CameraView가 아직 연결되지 않았습니다.');
    }
  }, [cameraRef.current]);

  useEffect(() => {
    if (finalResults.voice && finalResults.video && !aiAdvice && !isFetchingAdvice) {
      getAIAdvice();
    }
  }, [finalResults.voice, finalResults.video, aiAdvice, isFetchingAdvice, getAIAdvice]);

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

      <View style={styles.cameraAndAvatarContainer}>
        <View style={styles.avatarPlaceholder}>
          {Platform.OS === 'web' ? 
            <Avatar question={current_question} isRecording={isRecording} /> :
            <Text style={{ color: 'white', textAlign: 'center', marginTop: '50%' }}>아바타는 웹에서만 지원됩니다.</Text>
          }
        </View>
        <View style={styles.cameraViewWrapper}>
          <CameraView
            style={styles.camera}
            ref={cameraRef}
          />
        </View>
      </View>

      {/* --- Main Controls --- */}
      {!isAnalyzing ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={startAnalysis}
            disabled={isAnalyzing}
          >
            <Text style={styles.startButtonText}>AI 면접 시작</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.controlsContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title="답변 시작하기"
              onPress={startRecording}
              disabled={isRecording || !current_question || isFetchingNextQuestion}
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

      <View>
        {isAnalyzing ? ( // During interview/analysis
          <View style={styles.twoColumnContainer}>
            <View style={styles.leftColumn}>
              {(current_question || isFetchingNextQuestion) && (
                <View style={styles.questionPanel}>
                  <Text style={styles.panelTitle}>질문</Text>
                  <Text style={styles.questionText}>
                    {isFetchingNextQuestion
                      ? "다음 질문을 생성중입니다. 잠시만 기다려주세요..."
                      : current_question}
                  </Text>
                </View>
              )}
              <View style={styles.transcriptionPanel}>
                <Text style={styles.panelTitle}>실시간 답변</Text>
                <Text style={styles.transcriptionText}>
                  {isAnalyzing && !isRecording && !transcript
                    ? "답변 시작하기 버튼을 눌러주세요."
                    : transcript || status}
                </Text>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <RealtimeFeedbackPanel feedback={realtimeFeedback} />
            </View>
          </View>
        ) : ( // After interview, show full analysis report in a ScrollView
          <ScrollView style={styles.analysisReportScrollView}>
            {/* Show loading indicator if analysis is done but text report is not yet ready */}
            {!isAnalyzing && finalResults.voice && !textAnalysis && <TextAnalysisLoading />}

            {/* Show the report when it's ready */}
            {textAnalysis && <TextAnalysisReport report={textAnalysis} style={{ marginBottom: 24 }} />}

            {finalResults.voice && finalResults.video && (
              <View style={styles.panel}>
                <Text style={styles.mainTitle}>비언어적 표현 분석 결과</Text>
                <View style={styles.analysisResultsRow}> {/* New container for two columns */}
                  <View style={styles.analysisResultsColumn}> {/* Left column for Voice and Percentile */}
                    <VoiceAnalysisPanel voiceScores={finalResults.voice} />
            {finalResults.voice && percentileAnalysis && (
              <View style={styles.percentilePanelWrapper}> {/* Apply new style */}
                <PercentileAnalysisPanel 
                  percentileData={percentileAnalysis}
                  isLoading={isFetchingPercentiles}
                  onUpdateAnalysis={getPercentileAnalysis}
                />
              </View>
            )}                  </View>
                  <View style={styles.verticalDottedDivider} /> {/* Dotted line divider */}
                  <View style={styles.analysisResultsColumn}> {/* Right column for Video and AI Advice */}
                    <VideoAnalysisPanel videoAnalysis={finalResults.video} />
                    {aiAdvice && (
                      <AIAdvicePanel advice={aiAdvice} isLoading={isFetchingAdvice} />
                    )}
                  </View>
                </View>
              </View>
            )}


          </ScrollView>
        )}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#ffffff', // White background
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  percentilePanelWrapper: { // New style for PercentileAnalysisPanel
    backgroundColor: "#f7fafc", // Reverted to previous light gray background
    borderRadius: 12,
    padding: 20,
    marginTop: 20, 
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20, // To match other panels
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  adviceButtonContainer: {
    marginTop: 20,
  },
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
  cameraAndAvatarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '75%', // This container will take 75% of the screen width
    alignSelf: 'center', // Center the container itself
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: '50%', // Each child takes 50% of cameraAndAvatarContainer's width
    aspectRatio: 16 / 9,
    backgroundColor: '#333', // A different background for placeholder
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8, // Space between avatar and camera
  },
  cameraViewWrapper: { // This will replace the old videoContainer style
    width: '50%', // Each child takes 50% of cameraAndAvatarContainer's width
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
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
    width: '15%',
    alignSelf: 'center',
    marginVertical: 16,
  },
  buttonWrapper: {
    marginHorizontal: 8,
  },
  startButton: {
    backgroundColor: '#4CAF50', // A pleasant green
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 25, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '75%',
    alignSelf: 'center',
  },
  leftColumn: {
    flex: 1,
    marginRight: 8,
  },
  rightColumn: {
    flex: 1,
    marginLeft: 8,
  },
  analysisReportScrollView: {
    flex: 1,
    marginTop: 16,
  },
  analysisResultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  analysisResultsColumn: {
    flex: 1,
    marginHorizontal: 15, // Further increased spacing between columns
    padding: 20, // Increased padding to further reduce graph size visually
  },
  verticalDottedDivider: {
    width: 1, // Thin line
    backgroundColor: 'transparent', // Transparent background
    borderWidth: 1,
    borderColor: '#ccc', // Light gray color
    borderStyle: 'dotted', // Dotted style
    marginVertical: 10, // Vertical margin to align with content
  },
});

export default InterviewScreen;