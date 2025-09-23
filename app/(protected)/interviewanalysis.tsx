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
import Markdown from 'react-native-markdown-display'; // Import Markdown

const voiceGuidePart1 = `# 🎤 음성 점수 향상 가이드

## 📊 점수 체계 개요

음성 분석 시스템은 **4개의 주요 점수**를 통해 사용자의 음성을 평가합니다:
- 🗣️ **자신감 점수 (30%)**: 목소리의 힘과 안정성
- 🌊 **유창성 점수 (30%)**: 말하기 속도와 흐름
- ⚖️ **안정성 점수 (20%)**: 음성의 일관성  
- 🎯 **명료성 점수 (20%)**: 발음의 명확성

---

## 🚀 전체적인 점수 향상 전략

### 📅 일일 연습 루틴
**아침 (10분)**
- 복식 호흡 및 발성 준비 운동
- 기본 모음 발성 연습
- 자신의 최적 음높이 찾기

**연습 시간 (20분)**  
- 160 WPM 속도로 뉴스 기사 읽기
- 다양한 문장을 일정한 음높이로 읽기
- 녹음 후 재생하여 자가 점검

**면접 전 (5분)**
- 심호흡으로 긴장 완화  
- 간단한 발성 워밍업
- 자연스러운 목소리 톤 확인

### 🎬 녹음 분석 방법
1. **30초 자기소개 녹음**
2. **객관적 청취**: 하루 뒤 들어보기
3. **체크 포인트**: 음량, 속도, 명확성, 안정성
4. **개선점 메모** 후 다시 녹음
5. **주간 진전 비교**

### ⚡ 즉시 적용 가능한 팁

**환경 설정**
- 🎤 마이크와 15-20cm 거리 유지
- 🔇 조용한 환경에서 연습
- 💺 바른 자세로 앉기
- 💧 미지근한 물 준비

**정신적 준비**
- 😌 긴장하지 말고 자연스럽게
- 🎯 한 번에 하나씩 개선에 집중  
- 📈 완벽보다는 지속적 향상 추구
- 🏆 작은 개선도 성취로 인식

### 📊 점수별 우선순위 전략

**70점 미만**: 기본기 집중
- 적절한 음량과 속도 확보
- 명확한 발음 연습
- 일정한 호흡 패턴 구축

**70-80점**: 안정성 개선  
- 음높이와 음량 일관성 향상
- 감정 조절 능력 개발
- 자연스러운 유창성 구축

**80점 이상**: 세밀한 조정
- 개인 최적화 수치 발견
- 상황별 적응 능력 개발
- 면접 특화 음성 스타일 구축

---

## ⚠️ 주의사항

### 🚫 피해야 할 습관
- 과도한 "음...", "어..." 사용
- 목소리 톤의 급격한 변화
- 너무 빠르거나 느린 말속도
- 불충분한 호흡으로 인한 끊어진 발성
- 마이크 거리 변화로 인한 음량 불일치

### 💡 면접 당일 주의점
- 컨디션 관리로 목소리 최적 상태 유지
- 카페인 과다 섭취로 인한 떨림 방지  
- 충분한 수면으로 음성 안정성 확보
- 면접 30분 전 가벼운 발성 연습

---

🎯 **꾸준한 연습과 의식적인 개선을 통해 모든 음성 점수를 향상시킬 수 있습니다!**
`;

const voiceGuidePart2 = `## 🗣️ 자신감 점수 향상 가이드 (가중치: 30%)

### 📈 구성 요소
- **음성 강도** (50%): 목소리의 세기
- **피치 안정성** (30%): 목소리 높낮이의 일관성
- **음질** (20%): Jitter와 Shimmer 수치

### 🎯 목표 수치
- **남성**: 58dB 강도, 120Hz 평균 피치
- **여성**: 55dB 강도, 200Hz 평균 피치
- **피치 변동계수**: 0.15 이하 (15% 이내 변동)
- **Jitter**: 0.008 이하, **Shimmer**: 0.025 이하

### 💪 실천 방법

#### 1. 음성 강도 개선
**호흡 연습**
- 복식 호흡을 통해 충분한 공기 확보
- 말하기 전 깊은 숨을 들이마시고 천천히 내뱉으며 발성
- 일정한 호흡 리듬 유지로 음성 에너지 안정화

**발성 자세**
- 어깨를 펴고 가슴을 내밀어 기도 확보
- 턱을 너무 들거나 숙이지 말고 자연스럽게 유지
- 마이크와 적절한 거리(15-20cm) 유지

**음성 훈련**
- "아, 에, 이, 오, 우" 모음 발성 연습을 통한 성대 단련
- 낮은 음부터 높은 음까지 계단식 발성 연습
- 일정한 볼륨으로 긴 문장 읽기 연습

#### 2. 피치 안정성 개선
**음높이 인식 훈련**
- 자신의 자연스러운 음역대 파악하기
- 피아노 앱이나 성조기를 활용한 음높이 연습
- 동일한 문장을 같은 음높이로 반복 연습

**감정 조절**
- 긴장 시 높아지는 목소리 조절 연습
- 명상이나 심호흡을 통한 마음 안정
- 면접 전 충분한 워밍업으로 자연스러운 음성 찾기

#### 3. 음질 개선 (Jitter/Shimmer 감소)
**성대 건강 관리**
- 충분한 수분 섭취 (하루 2L 이상)
- 카페인, 알코올 섭취 제한
- 면접 전 목소리 남용 피하기

**정확한 발음 연습**
- 자음과 모음을 명확하게 구분하여 발음
- 혀의 위치와 입모양을 의식적으로 조절
- 녹음 후 재생을 통한 자가 점검

---

## 🌊 유창성 점수 향상 가이드 (가중치: 30%) 

### 📈 구성 요소  
- **말하기 속도** (50%): 분당 단어 수 (WPM)
- **유성음 비율** (30%): 목소리가 나는 구간 비율
- **스펙트럼 안정성** (20%): 음성 스펙트럼의 일관성

### 🎯 목표 수치
- **최적 말속도**: 160 WPM (±30)  
- **유성음 비율**: 0.45 (45% ±15%)
- **제로 크로싱 비율**: 0.003 이하

### 💪 실천 방법

#### 1. 말하기 속도 최적화
**속도 조절 연습**
- 메트로놈이나 타이머 활용한 일정 속도 연습
- 긴 문장을 천천히, 중간 속도, 빠르게 읽으며 차이 체감
- 1분간 160개 단어 읽기 연습 (약 2.7단어/초)

**호흡과 속도 조화**
- 문장의 의미 단위별 적절한 휴지 삽입
- 중요한 부분은 천천히, 부연설명은 자연스럽게 진행
- 질문을 들은 후 1-2초 생각하는 시간 갖기

**유성음 비율 개선**
- 명확한 발성
- 자음보다 모음을 더 길고 명확하게 발음
- "음..", "어.." 같은 불필요한 간투사 최소화
- 침묵보다는 자연스러운 연결 음성 사용

**문장 연결 기술**
- 단어 간 자연스러운 연결 의식
- 끊어지지 않는 매끄러운 문장 구성 연습
- 숨쉬는 구간을 최소화하되 자연스럽게 유지

#### 3. 스펙트럼 안정성 향상
**일관된 음색 유지**
- 동일한 발성 방식으로 전체 답변 진행  
- 갑작스러운 음색 변화 피하기
- 감정 기복이 음성에 과도하게 반영되지 않도록 조절
`;

const voiceGuidePart3 = `## ⚖️ 안정성 점수 향상 가이드 (가중치: 20%)

### 📈 구성 요소
- **피치 안정성** (60%): 피치 변동계수
- **강도 안정성** (40%): 음성 강도 변동계수  

### 🎯 목표 수치
- **피치 변동계수**: 0.12 (±0.08)
- **강도 변동계수**: 0.2 (±0.1)

### 💪 실천 방법

#### 1. 피치 안정성 개선
**음높이 고정 연습**
- 한 음높이로 긴 문장 읽기 연습
- 감정적 변화 시에도 기본 음높이 유지
- 강조할 때 음높이보다 강세로 표현하기

**음성 모니터링**
- 실시간으로 자신의 목소리 높이 의식하기
- 상승조나 하강조 패턴을 의도적으로 조절
- 질문 시 끝을 과도하게 올리지 않기

#### 2. 강도 안정성 개선
**일정한 볼륨 유지**
- 전체 답변 동안 일관된 음성 크기 유지
- 중요한 부분 강조 시에도 급격한 변화 피하기
- 마이크와의 거리를 일정하게 유지

**감정 조절**
- 흥미진진한 내용도 차분하게 표현
- 긴장이나 당황 상황에서도 음성 크기 일정하게
- 문장의 시작과 끝의 볼륨 차이 최소화

---

## 🎯 명료성 점수 향상 가이드 (가중치: 20%)

### 📈 구성 요소
- **스펙트럼 중심** (50%): 음성의 명료함
- **스펙트럼 대역폭** (30%): 음성 주파수 분포
- **MFCC 일관성** (20%): 음성 특성 일관성

### 🎯 목표 수치
- **스펙트럼 중심**: 성별별 기준값 ±600Hz (남성: 1400Hz, 여성: 1800Hz)
- **스펙트럼 대역폭**: 1200Hz 중심
- **MFCC 표준편차**: 15 이하

### 💪 실천 방법

#### 1. 스펙트럼 중심 최적화
**명확한 자음 발음**
- 'ㅅ', 'ㅆ', 'ㅈ', 'ㅊ' 같은 마찰음 정확히 발음
- 혀의 위치를 정확히 하여 선명한 자음 소리 생성
- 'ㄱ', 'ㅋ', 'ㄷ', 'ㅌ' 등 폐쇄음 명확하게 구분

**모음 정확성**
- 'ㅏ', 'ㅓ', 'ㅗ', 'ㅜ' 등 기본 모음 정확한 입모양으로 발음
- 복합모음 시 각 요소를 뚜렷하게 구분
- 입술과 혀의 정확한 위치 의식하기

#### 2. 스펙트럼 대역폭 조절
**균형 잡힌 음성**
- 너무 높거나 낮지 않은 중간 음역대 사용
- 극단적인 음색 변화 피하기
- 자연스러운 공명 활용으로 풍부한 음성 만들기

**발성 기법**
- 목구멍이 아닌 가슴에서 나오는 소리 의식
- 과도한 비음이나 후두음 피하기
- 적절한 구강 공간 활용

#### 3. MFCC 일관성 향상
**지속적인 발음 패턴**
- 같은 단어는 항상 같은 방식으로 발음
- 개인적인 발음 습관 유지하되 명확성 확보
- 전체 답변 동안 일관된 발성 방식 유지
`;

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
          {textAnalysis && <TextAnalysisReport report={textAnalysis} style={{ marginBottom: 24, width: '100%', alignSelf: 'center' }} />}

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
      <View style={styles.voiceGuideContainer}>
        <View style={styles.voiceGuideColumn}>
          <Markdown style={markdownStyles}>
            {voiceGuidePart1}
          </Markdown>
        </View>
        <View style={styles.voiceGuideColumn}>
          <Markdown style={markdownStyles}>
            {voiceGuidePart2}
          </Markdown>
        </View>
        <View style={styles.voiceGuideColumn}>
          <Markdown style={markdownStyles}>
            {voiceGuidePart3}
          </Markdown>
        </View>
      </View>
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
    width: '100%', // Set width to 100%
    alignSelf: 'center', // Center the panel
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
  voiceGuideContainer: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 40,
    marginVertical: 40,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row', // Added for two-column layout
    justifyContent: 'space-between', // Added for spacing between columns
  },
  voiceGuideColumn: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

const markdownStyles = StyleSheet.create({
  heading1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a202c',
    borderBottomWidth: 2,
    borderColor: '#e2e8f0',
    paddingBottom: 8,
    marginBottom: 15,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    paddingBottom: 6,
    marginTop: 30,
    marginBottom: 15,
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a5568',
    marginTop: 18,
    marginBottom: 12,
  },
  heading4: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a5568',
    marginTop: 12,
    marginBottom: 8,
  },
  hr: {
    backgroundColor: '#e2e8f0',
    height: 1,
    marginVertical: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a5568',
  },
  list_item: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a5568',
    marginVertical: 2,
  },
  blockquote: {
    backgroundColor: '#f7fafc',
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    padding: 12,
    marginVertical: 12,
  },
});

export default InterviewAnalysisScreen;