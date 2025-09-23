import Avatar, { AvatarRef } from '@/components/interview/Avatar';
import { useInterview } from '@/hooks/useInterview';
import { useInterviewSessionStore } from '@/stores/interviewStore';
import { CameraView } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';

const InterviewScreen = () => {
  const avatarRef = useRef<AvatarRef>(null);
  const {
    hasPermission,
    isAnalyzing,
    isRecording,
    status,
    transcript,
    realtimeFeedback,
    cameraRef,
    startAnalysis,
    stopAnalysis,
    startRecording,
    stopRecording,
    isFetchingNextQuestion,
  } = useInterview();
  const { current_question } = useInterviewSessionStore();

  const [isWaitingForFirstQuestion, setIsWaitingForFirstQuestion] = useState(false);
  const prevQuestionRef = useRef<string | null>();

  const handleStartAnalysis = () => {
    startAnalysis();
    setIsWaitingForFirstQuestion(true);
  };

  // Effect for the first question
  useEffect(() => {
    if (isWaitingForFirstQuestion && current_question) {
      avatarRef.current?.speak(current_question);
      setIsWaitingForFirstQuestion(false); // Reset the flag
    }
  }, [isWaitingForFirstQuestion, current_question]);

  // Effect for subsequent questions (Q2 onwards)
  useEffect(() => {
    const questionChanged = prevQuestionRef.current !== current_question;
    // This should only run for Q2+
    if (isAnalyzing && !isWaitingForFirstQuestion && questionChanged && current_question) {
      avatarRef.current?.speak(current_question);
    }
    prevQuestionRef.current = current_question;
  }, [current_question, isAnalyzing, isWaitingForFirstQuestion]);


  // This effect handles stopping the avatar's speech when the user starts recording
  useEffect(() => {
    if (isRecording && avatarRef.current && Platform.OS === 'web') {
      avatarRef.current.stopSpeaking();
    }
  }, [isRecording]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>카메라 권한 요청 상태: {status}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Left 70% for Avatar */}
      <View style={styles.leftPanel}>
        {Platform.OS === 'web' ?
          <Avatar ref={avatarRef} /> :
          <Text style={{ color: 'white', textAlign: 'center', marginTop: '50%' }}>아바타는 웹에서만 지원됩니다.</Text>
        }
      </View>

      {/* Right 30% for Camera, Question, Answer, Buttons */}
      <View style={styles.rightPanel}>
        {/* User's Camera */}
        <View style={styles.cameraViewWrapperSmall}>
          <CameraView
            style={styles.camera}
            ref={cameraRef}
          />
        </View>

        {/* Question and Answer Panels */}
        {isAnalyzing ? (
          <>
            {(current_question || isFetchingNextQuestion) && (
              <View style={styles.questionPanelSmall}>
                <Text style={styles.panelTitle}>질문</Text>
                <Text style={styles.questionText}>
                  {isFetchingNextQuestion
                    ? "다음 질문을 생성중입니다. 잠시만 기다려주세요..."
                    : current_question}
                </Text>
              </View>
            )}
            <View style={styles.transcriptionPanelSmall}>
              <Text style={styles.panelTitle}>실시간 답변</Text>
              <Text style={styles.transcriptionText}>
                {isAnalyzing && !isRecording && !transcript
                  ? "답변 시작하기 버튼을 눌러주세요."
                  : transcript || status}
              </Text>
            </View>
          </>
        ) : null}

        {/* Control Buttons */}
        {!isAnalyzing ? (
          <View style={styles.buttonContainerSmall}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartAnalysis}
              disabled={isAnalyzing}
            >
              <Text style={styles.startButtonText}>AI 면접 시작</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.controlsContainerSmall}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f4f7f9',
  },
  leftPanel: {
    flex: 7, // 70% width
    marginRight: 8,
    justifyContent: 'center', // Center avatar vertically
    alignItems: 'center', // Center avatar horizontally
    backgroundColor: '#333', // Background for avatar area
    borderRadius: 8,
    overflow: 'hidden',
  },
  rightPanel: {
    flex: 3, // 30% width
    marginLeft: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cameraViewWrapperSmall: {
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
  questionPanelSmall: {
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#91d5ff',
    borderRadius: 8,
    padding: 10, // Adjusted padding
    marginBottom: 10, // Adjusted margin
    width: '100%',
  },
  questionText: {
    fontSize: 14, // Adjusted font size
    lineHeight: 20, // Adjusted line height
    color: '#0050b3',
  },
  transcriptionPanelSmall: {
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10, // Adjusted padding
    minHeight: 60, // Adjusted min height
    marginBottom: 10, // Adjusted margin
    width: '100%',
  },
  buttonContainerSmall: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 16,
  },
  controlsContainerSmall: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    width: '100%',
  },
  buttonWrapper: {
    marginHorizontal: 4, // Adjusted margin
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default InterviewScreen;