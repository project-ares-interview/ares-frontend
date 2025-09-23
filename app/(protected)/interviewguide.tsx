import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Link } from 'expo-router';

const markdownContent = `# 🎯 AI 면접 시스템 사용 가이드

## 📋 시스템 개요
JAI 면접 시스템은 실제 면접과 유사한 환경에서 연습할 수 있도록 설계된 종합적인 면접 준비 도구입니다. AI 면접관이 질문을 하고, 사용자의 답변을 실시간으로 분석하여 피드백을 제공합니다.

---

## 🚀 면접 시작하기

### 1️⃣ 면접 준비 단계 (InterviewStart 페이지)

#### 필수 정보 입력
**개인정보**
- **이름**: 면접자 이름 입력
- **성별**: 음성 분석을 위한 성별 선택 (남성/여성)
- **지원회사명**: 지원하고자 하는 회사 이름
- **지원직무**: 구체적인 직무명 (예: 소프트웨어 개발자, 마케팅 매니저)

**면접 설정**
- **면접 모드**: 
  - 실무 면접: 팀장급 면접관 역할
  - 임원 면접: 경영진 수준의 면접관 역할
- **난이도**:
  - 보통: 기본적인 역량 평가 중심
  - 어려움: 심층적 역량과 압박 상황 대처 능력 평가

#### 선택 정보 입력
- **부서**: 지원 부서명 (선택사항)
- **기술 스택**: 보유 기술을 쉼표로 구분하여 입력 (예: React, Node.js, Python)
- **자격증**: 보유 자격증을 쉼표로 구분하여 입력
- **기타 활동**: 프로젝트, 봉사활동 등 특별한 경험

#### 문서 업로드
**직무기술서 (JD) - 필수**
- 파일 업로드 또는 직접 텍스트 입력 가능
- 지원하는 직무의 구체적인 요구사항 포함

**이력서 - 필수**
- 파일 업로드 또는 직접 텍스트 입력 가능
- 개인의 경험과 역량이 담긴 이력서

> 💡 **팁**: 파일과 텍스트 중 하나만 제공하면 됩니다. 파일 업로드 시 자동으로 텍스트가 추출됩니다.

---

### 2️⃣ 면접 진행 단계 (Interview 페이지)

#### 화면 구성
**좌측 (70%): AI 면접관**
- 3D 아바타가 음성으로 질문을 읽어줍니다
- 웹 환경에서만 아바타가 지원됩니다

**우측 (30%): 사용자 영역**
- 상단: 사용자 카메라 (실시간 비디오 분석용)
- 중단: 질문 패널 (현재 질문 표시)
- 하단: 실시간 답변 패널 (음성 인식 결과 표시)

#### 면접 진행 순서
1. **"AI 면접 시작" 버튼 클릭**
   - 카메라 및 마이크 권한 확인
   - 첫 번째 질문이 생성되고 아바타가 읽어줍니다

2. **질문 청취**
   - AI 면접관이 질문을 음성으로 전달
   - 질문 패널에 텍스트로도 표시됩니다

3. **답변 녹화**
   - "답변 시작하기" 버튼을 눌러 답변 시작
   - 실시간 음성 인식으로 답변이 텍스트로 변환
   - "답변 완료" 버튼으로 답변 종료

4. **다음 질문으로 진행**
   - 자동으로 다음 질문이 생성됩니다
   - 총 5~15개 질문이 진행됩니다

#### 면접 중 주의사항
- 📹 **카메라**: 항상 얼굴이 잘 보이도록 위치 조정, 면접이 시작되고 끝날 때까지 관련 점수가 측정되니 유의
- 🎤 **마이크**: 명확한 발음으로 답변, 매 답변 시작과 끝내기 버튼을 누르는 사이 관련 점수가 측정되니 유의
- ⏱️ **시간**: 각 질문당 적절한 시간 내에 답변
- 🔊 **소음**: 조용한 환경에서 진행

---

### 3️⃣ 분석 결과 확인 (InterviewAnalysis 페이지)

#### 분석 리포트 구성

**1. 종합 텍스트 분석 리포트**
- 전체 면접 내용에 대한 AI 분석
- 답변의 논리성, 적합성, 완성도 평가
- 개선점과 강점 종합 분석

**2. 음성 분석 결과**
- **자신감 점수**: 음성 강도, 안정성 기반
- **유창성 점수**: 말하기 속도, 유성음 비율
- **안정성 점수**: 피치 변동성, 음성 일관성
- **명료성 점수**: 발음 명확성, 스펙트럼 분석

**3. 비디오 분석 결과**
- **눈 접촉 분석**: 깜빡임 패턴, 시선 안정성
- **표정 분석**: 미소 빈도, 감정 표현
- **자세 분석**: 자세 안정성, 움직임 패턴
- **제스처 분석**: 손 움직임, 자연스러운 제스처

**4. 백분위 분석**
- 다른 사용자들과의 상대적 성과 비교
- 각 영역별 순위와 개선 필요 영역 식별

**5. JAI 맞춤 조언**
- 개인별 약점 분석 기반 개선 방안
- 구체적이고 실행 가능한 피드백
- 다음 면접을 위한 준비 방법

---

## 🔧 기술적 요구사항

### 필수 권한
- **카메라 접근 권한**: 비디오 분석을 위해 필수
- **마이크 접근 권한**: 음성 분석을 위해 필수

### 권장 환경
- **브라우저**: Chrome, Firefox, Safari 최신 버전
- **인터넷**: 안정적인 인터넷 연결 (업로드/다운로드)
- **하드웨어**: 웹캠, 마이크 내장 또는 외장

### 지원 파일 형식
- **문서**: PDF, DOC, DOCX, TXT
- **최대 용량**: 파일당 10MB 이하 권장

---

## ⚠️ 주의사항 및 팁

### 면접 준비
- 🎯 **구체적인 정보 입력**: 더 정확한 분석을 위해 상세한 정보 제공
- 📄 **최신 문서 사용**: 가장 최근의 JD와 이력서 사용 권장
- 🔍 **미리보기 확인**: 업로드한 문서의 텍스트 추출 결과 확인

### 면접 진행
- 😊 **자연스러운 표정**: 과도하게 긴장하지 말고 자연스럽게 진행
- 🗣️ **명확한 발음**: 음성 인식 정확도를 위해 또렷한 발음
- ⏰ **적절한 속도**: 너무 빠르거나 느리지 않은 말하기 속도 유지

### 분석 결과 활용
- 📊 **점수 해석**: 절대적 수치보다는 상대적 비교와 개선점에 집중
- 🎯 **반복 연습**: 약점 영역을 중심으로 반복 연습 권장
- 📈 **진전 추적**: 여러 번의 면접을 통해 개선 추세 확인

---

## 🆘 문제 해결

### 자주 발생하는 문제
**카메라/마이크 권한 오류**
- 브라우저 설정에서 권한 허용 확인
- 페이지 새로고침 후 재시도

**음성 인식이 되지 않을 때**
- 마이크가 제대로 연결되었는지 확인
- 브라우저의 마이크 권한 설정 점검
- 조용한 환경에서 다시 시도

**파일 업로드 실패**
- 파일 크기가 제한을 초과하지 않는지 확인
- 지원되는 파일 형식인지 확인
- 인터넷 연결 상태 점검

**분석 결과 로딩 지연**
- 복잡한 분석 과정으로 시간이 소요될 수 있습니다
- 페이지를 새로고침하지 말고 대기해 주세요
- 지속적인 문제 발생 시 다시 면접 진행

---

## 🎯 성공적인 면접을 위한 최종 체크리스트

### 면접 전
- ✅ 조용하고 밝은 환경 준비
- ✅ 카메라/마이크 연결 및 테스트
- ✅ 안정적인 인터넷 연결 확인
- ✅ 최신 이력서와 JD 준비

### 면접 중
- ✅ 화면을 직접 보며 아이컨택 유지
- ✅ 자연스러운 표정과 제스처
- ✅ 명확하고 적절한 속도로 답변
- ✅ 각 질문에 충분히 생각한 후 답변

### 면접 후
- ✅ 분석 결과 꼼꼼히 검토
- ✅ 약점 영역 파악 및 개선 계획 수립
- ✅ 강점은 더욱 발전시키는 방향으로 활용
- ✅ 정기적인 반복 연습을 통한 실력 향상

---

🎉 **성공적인 면접 준비를 위해 JAI 면접 시스템을 적극 활용해 보세요!**
`;

export default function InterviewGuideScreen() {
  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.backButtonContainer}>
        <Link href="/(protected)/interviewstart" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>면접 시작 페이지로 돌아가기</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.contentContainer}>
        <Markdown style={markdownStyles}>
          {markdownContent}
        </Markdown>
      </View>
      <View style={styles.backButtonContainer}>
        <Link href="/(protected)/interviewstart" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>면접 시작 페이지로 돌아가기</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f4f7f9',
  },
  contentContainer: {
    width: '80%',
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
  },
  backButtonContainer: {
    width: '80%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 20,
  },
  backButton: {
    backgroundColor: '#6c757d', // Neutral gray for navigation button
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

const markdownStyles = StyleSheet.create({
  heading1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a202c',
    borderBottomWidth: 2,
    borderColor: '#e2e8f0',
    paddingBottom: 10,
    marginBottom: 20,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    paddingBottom: 8,
    marginTop: 40,
    marginBottom: 20,
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a5568',
    marginTop: 24,
    marginBottom: 16,
  },
  heading4: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a5568',
    marginTop: 16,
    marginBottom: 12,
  },
  hr: {
    backgroundColor: '#e2e8f0',
    height: 1,
    marginVertical: 32,
  },
  body: {
    fontSize: 16,
    lineHeight: 28,
    color: '#4a5568',
  },
  list_item: {
    fontSize: 16,
    lineHeight: 28,
    color: '#4a5568',
    marginVertical: 4,
  },
  blockquote: {
    backgroundColor: '#f7fafc',
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    padding: 16,
    marginVertical: 16,
  },
});
