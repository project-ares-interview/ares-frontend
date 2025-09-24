import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AIAdvicePanel } from './AIAdvicePanel';
import { PercentileAnalysisPanel } from './PercentileAnalysisPanel';
import { TextAnalysisReport } from './TextAnalysisReport';
import { VideoAnalysisPanel } from './VideoAnalysisPanel';
import { VoiceAnalysisPanel } from './VoiceAnalysisPanel';

interface InterviewResultModalProps {
  visible: boolean;
  onClose: () => void;
  analysisData: {
    voiceScores?: any;
    videoAnalysis?: any;
    textAnalysis?: any;
    aiAdvice?: string;
    percentileAnalysis?: any;
    sessionId?: string;
    timestamp?: string;
  };
}

const { width } = Dimensions.get('window');

export const InterviewResultModal: React.FC<InterviewResultModalProps> = ({
  visible,
  onClose,
  analysisData
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎤 면접 분석 결과 리포트</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Session Info */}
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionText}>
              📅 생성일: {new Date().toLocaleDateString('ko-KR')}
            </Text>
            {analysisData.sessionId && (
              <Text style={styles.sessionText}>
                🆔 세션 ID: {analysisData.sessionId}
              </Text>
            )}
          </View>

          {/* Text Analysis Report */}
          {analysisData.textAnalysis && (
            <View style={styles.section}>
              <TextAnalysisReport 
                report={analysisData.textAnalysis} 
                style={styles.textReport}
              />
            </View>
          )}

          {/* Non-verbal Analysis Results */}
          {(analysisData.voiceScores || analysisData.videoAnalysis) && (
            <View style={styles.panel}>
              <Text style={styles.subTitle}>비언어적 표현 분석 결과</Text>
              <View style={styles.analysisResultsRow}>
                <View style={styles.analysisResultsColumn}>
                  {/* Voice Analysis */}
                  {analysisData.voiceScores && (
                    <VoiceAnalysisPanel voiceScores={analysisData.voiceScores} />
                  )}
                  
                  {/* Percentile Analysis */}
                  {analysisData.voiceScores && analysisData.percentileAnalysis && (
                    <View style={styles.percentilePanelWrapper}>
                      <PercentileAnalysisPanel 
                        percentileData={analysisData.percentileAnalysis}
                        isLoading={false}
                        onUpdateAnalysis={() => {}}
                      />
                    </View>
                  )}
                </View>
                
                <View style={styles.verticalDottedDivider} />
                
                <View style={styles.analysisResultsColumn}>
                  {/* Video Analysis */}
                  {analysisData.videoAnalysis && (
                    <VideoAnalysisPanel videoAnalysis={analysisData.videoAnalysis} />
                  )}
                  
                  {/* AI Advice */}
                  {analysisData.aiAdvice && (
                    <AIAdvicePanel 
                      advice={analysisData.aiAdvice} 
                      isLoading={false} 
                    />
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ⏰ 생성 시간: {new Date().toLocaleString('ko-KR')}
            </Text>
            <Text style={styles.footerText}>
              이 리포트는 AI 면접 분석 시스템에 의해 자동 생성되었습니다.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sessionInfo: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sessionText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  section: {
    marginBottom: 16,
  },
  textReport: {
    marginBottom: 0,
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2563eb',
  },
  analysisResultsRow: {
    flexDirection: width > 768 ? 'row' : 'column',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  analysisResultsColumn: {
    flex: 1,
    marginHorizontal: width > 768 ? 15 : 0,
    padding: width > 768 ? 20 : 0,
  },
  verticalDottedDivider: {
    width: width > 768 ? 1 : '100%',
    height: width > 768 ? '100%' : 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dotted',
    marginVertical: width > 768 ? 10 : 20,
    marginHorizontal: width > 768 ? 0 : 0,
  },
  percentilePanelWrapper: {
    backgroundColor: "#f7fafc",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
});
