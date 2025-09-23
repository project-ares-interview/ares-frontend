import { AIAdvicePanel } from '@/components/interview/AIAdvicePanel';
import { VideoAnalysisPanel } from '@/components/interview/VideoAnalysisPanel';
import { VoiceAnalysisPanel } from '@/components/interview/VoiceAnalysisPanel';
import { PercentileAnalysisPanel } from '@/components/interview/PercentileAnalysisPanel';
import { TextAnalysisReport } from '@/components/interview/TextAnalysisReport';
import { TextAnalysisLoading } from '@/components/interview/TextAnalysisLoading';
import { useInterview } from '@/hooks/useInterview'; // Keep useInterview
import { useInterviewSessionStore } from '@/stores/interviewStore'; // Import the store
import React, { useEffect } from 'react'; // Keep useEffect
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native'; // Added ActivityIndicator

const InterviewAnalysisScreen = () => {
  const {
    isAnalyzing, // This is false when navigating to analysis page
    isFetchingAdvice,
    getAIAdvice,
    isFetchingPercentiles,
    getPercentileAnalysis,
  } = useInterview();

  const {
    finalResults,
    aiAdvice,
    percentileAnalysis,
    textAnalysis,
    isAnalysisComplete, // This is true when navigating here
  } = useInterviewSessionStore();

  // Determine if analysis results are still loading
  const isLoadingAnalysis = !finalResults?.voice || !finalResults?.video;

  console.log('InterviewAnalysisScreen Render:'); // Log
  console.log('  finalResults:', finalResults); // Log
  console.log('  finalResults?.voice:', finalResults?.voice); // Log
  console.log('  finalResults?.video:', finalResults?.video); // Log
  console.log('  isLoadingAnalysis:', isLoadingAnalysis); // Log

  // This effect fetches AI advice once the analysis results are available
  useEffect(() => {
    if (finalResults?.voice && finalResults?.video && !aiAdvice && !isFetchingAdvice) {
      getAIAdvice();
    }
  }, [finalResults, aiAdvice, isFetchingAdvice, getAIAdvice]); // Updated dependencies

  // This effect fetches percentile analysis once finalResults are available
  useEffect(() => {
    if (finalResults?.voice && finalResults?.video) { // Added optional chaining
      getPercentileAnalysis();
    }
  }, [finalResults, getPercentileAnalysis]); // Updated dependencies

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>면접 분석 결과</Text>

      {isLoadingAnalysis ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>리포트를 생성 중입니다. 잠시만 기다려주세요...</Text>
        </View>
      ) : (
        <>
          {/* Show loading indicator if analysis is done but text report is not yet ready */}
          {!isAnalyzing && finalResults?.voice && !textAnalysis && <TextAnalysisLoading />}

          {/* Show the report when it's ready */}
          {textAnalysis && <TextAnalysisReport report={textAnalysis} style={{ marginBottom: 24 }} />}

          {finalResults?.voice && finalResults?.video && ( // Added optional chaining
            <View style={styles.panel}>
              <Text style={styles.subTitle}>비언어적 표현 분석 결과</Text>
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
                  )}                  
                </View>
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
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f7f9',
  },
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
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#555',
  },
});

export default InterviewAnalysisScreen;