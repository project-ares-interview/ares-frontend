# ARES Frontend - AI Interview Coach

## 📖 개요

ARES는 취업 준비생들이 면접 과정에서 겪는 어려움을 AI 기술로 해결하고자 탄생한 **AI 기반 모의 면접 및 역량 분석 플랫폼**의 프론트엔드 애플리케이션입니다. React Native와 Expo를 기반으로 구축되어, iOS, Android, 그리고 웹에서 일관된 사용자 경험을 제공합니다.

이 애플리케이션은 [ARES Backend API](https://github.com/project-ares-interview/ares-backend)와 통신하여 AI 면접, 이력서 분석, 심층 리포트 등 핵심 기능들을 사용자에게 직관적이고 편리한 UI로 제공하는 역할을 합니다.

## 🚀 관련 프로젝트

- **[ARES Backend](https://github.com/project-ares-interview/ares-backend)**: Django 기반의 RESTful API 서버입니다. AI/ML 로직, 데이터베이스 관리 등 모든 핵심 비즈니스 로직을 처리합니다.

## 🎬 시연 영상

[시연 영상](results/videos/jai_presentation.gif)

## 주요 기능 (UI/UX 관점)

### 🤖 가상 아바타 AI 면접

사용자가 실제와 같은 환경에서 AI 아바타와 음성으로 대화하며 면접을 진행하는 몰입형 UI를 제공합니다.

- **주요 사용 라이브러리**: `expo-camera`, `expo-av`, `react-native-webview`
- **구현 상세**:
    1. **면접 설정**: 사용자는 `app/(protected)/interviewstart.tsx` 화면에서 직무, 기업, 면접 난이도를 선택합니다.
    2. **실시간 면접 진행**: `app/(protected)/interview.tsx` 화면에서 `expo-camera`를 통해 사용자의 영상과 `expo-av`를 통해 음성을 실시간으로 백엔드에 스트리밍합니다. AI의 질문은 음성으로 재생되며, 사용자는 실제 대화처럼 답변할 수 있습니다.
    3. **아바타 상호작용**: `react-native-webview`를 사용하여 3D 아바타를 렌더링하고, 면접의 흐름과 AI의 피드백에 따라 아바타가 상호작용하여 현실감을 높입니다.
- **결과**: 사용자는 텍스트 기반의 정적인 인터페이스를 넘어, 실제 사람과 대화하는 듯한 동적인 환경에서 면접을 연습하며 실전 감각을 극대화할 수 있습니다.

![interview with avatar](./results/images/avatar_interview.png)

### 📄 이력서 및 자소서 분석

사용자가 업로드한 이력서와 자기소개서 문서를 AI가 분석하여 강점과 약점을 진단하고, 예상 질문을 생성해주는 기능입니다.

- **주요 사용 라이브러리**: `expo-document-picker`, `axios`
- **구현 상세**:
    1. **문서 업로드**: `expo-document-picker`를 사용하여 사용자의 기기에서 PDF, DOCX 형식의 이력서 파일을 선택하고, `FormData` 형식으로 백엔드에 전송합니다.
    2. **분석 결과 요청 및 표시**: `services/resumeService.ts`를 통해 백엔드에 분석을 요청하고, 반환된 예상 질문, 역량 키워드, 개선 제안 등의 결과를 `app/(protected)/resume-analysis.tsx` 화면에 구조화하여 표시합니다.
- **결과**: 사용자는 자신의 이력서에 기반한 맞춤형 면접 질문을 미리 파악하고, 답변을 준비하며 면접 경쟁력을 높일 수 있습니다.

### 📊 심층 분석 리포트

면접 종료 후, 복잡한 분석 데이터를 사용자가 쉽게 이해할 수 있도록 시각화하여 제공합니다.

- **주요 사용 라이브러리**: `react-native-chart-kit`, `react-native-svg`
- **구현 상세**:
    1. **데이터 요청 및 수신**: 면접이 종료되면 `services/interviewService.ts`를 통해 백엔드에 분석 리포트를 요청하고, `app/(protected)/interviewanalysis.tsx` 화면에서 데이터를 수신합니다.
    2. **NCS 역량 차트**: `react-native-chart-kit`의 레이더 차트(Radar Chart)를 커스터마이징하여, 백엔드로부터 받은 NCS 직무 역량 점수를 시각적으로 표현합니다.
    3. **강점/약점 및 AI 조언**: 백분위, 점수, 텍스트 피드백 등 다양한 형태의 데이터를 `components/interview/AnalysisResultPanel.tsx` 와 같은 컴포넌트들을 통해 구조화하여 보여줍니다.
- **결과**: 사용자는 자신의 역량 수준을 객관적인 차트와 수치로 한눈에 파악하고, 구체적인 AI의 피드백을 통해 개선점을 명확히 인지할 수 있습니다.

### 👤 사용자 프로필 및 이력서 관리

사용자의 커리어 정보를 효율적으로 입력하고 관리할 수 있는 체계적인 폼(Form)과 UI를 제공합니다.

- **주요 사용 라이브러리**: `react-hook-form`, `zod`, `zustand`
- **구현 상세**:
    1. **상태 관리**: `stores/resumeStore.ts`와 `stores/profileStore.ts`에서 `zustand`를 사용하여 프로필 및 이력서 관련 전역 상태를 관리합니다.
    2. **폼 UI 및 유효성 검사**: 학력, 경력 등 각 항목 입력 폼(`components/resume/details/*Form.tsx`)은 `react-hook-form`으로 제어되며, `zod`를 이용해 각 필드의 유효성을 실시간으로 검증하여 사용자 실수를 방지합니다.
    3. **데이터 동기화**: 사용자가 폼을 제출하면 `services/resumeService.ts` 또는 `profileService.ts` 내의 `axios` 인스턴스를 통해 백엔드 API와 데이터를 동기화합니다.
- **결과**: 사용자는 복잡한 이력서 항목들을 체계적이고 편리한 UI를 통해 작성하고 관리할 수 있으며, 입력 데이터의 정합성을 보장받습니다.

### 📅 구글 캘린더 연동

사용자가 자신의 구글 캘린더와 ARES 서비스를 연동하여 면접 일정을 자동으로 기록하고 관리할 수 있도록 돕습니다.

- **주요 사용 라이브러리**: `expo-auth-session`, `expo-web-browser`
- **구현 상세**:
    1. **OAuth 2.0 인증**: `expo-auth-session`을 사용하여 백엔드에서 생성한 구글 인증 URL을 열고, `expo-web-browser`를 통해 안전하게 인증을 진행합니다. 인증 후 콜백을 받아 토큰을 백엔드로 전송합니다.
    2. **캘린더 연동**: 인증이 완료되면, 사용자는 `app/(protected)/calendar.tsx` 화면에서 자신의 캘린더에 저장된 면접 일정을 확인하고, 새로운 일정을 추가할 수 있습니다.
- **결과**: ARES 플랫폼 내에서 잡힌 모의 면접 일정이나, 사용자가 직접 등록한 실제 면접 일정이 사용자의 구글 캘린더에 자동으로 동기화되어 편리하게 일정을 관리할 수 있습니다.

## 아키텍처

ARES 프론트엔드는 확장성과 유지보수성을 고려하여 다음과 같은 아키텍처로 설계되었습니다.

- **기반 프레임워크 (React Native & Expo)**: Expo의 관리형 워크플로우를 채택하여 네이티브 모듈 설정의 복잡함을 줄이고, OTA(Over-the-Air) 업데이트, 다양한 플랫폼(iOS, Android, Web) 지원 등의 이점을 활용합니다. React Native를 통해 단일 코드베이스로 여러 플랫폼을 지원하여 개발 효율성을 높입니다.

- **화면 라우팅 (Expo Router)**: 파일 시스템 기반의 라우팅 방식을 사용하여 직관적으로 페이지를 관리합니다. `app` 디렉토리의 파일 구조가 곧바로 앱의 네비게이션 구조가 되므로, 새로운 페이지를 추가하거나 수정하기 용이합니다. `(auth)`와 `(protected)` 같은 그룹 라우트를 활용하여 인증 상태에 따른 접근 제어를 선언적으로 구현합니다.

- **상태 관리 (Zustand)**: Redux와 같은 기존 상태 관리 라이브러리의 복잡성과 보일러플레이트를 줄이기 위해 `Zustand`를 선택했습니다. Hook 기반의 간단한 API로 쉽게 전역 상태를 만들고 사용할 수 있으며, 도메인별(`authStore`, `resumeStore` 등)로 스토어를 분리하여 코드의 응집도를 높이고, 필요한 컴포넌트에서만 상태를 구독하여 불필요한 리렌더링을 최소화합니다.

- **데이터 통신 (Axios)**: 백엔드 API와의 통신을 위해 `axios`를 사용합니다. `services/api.ts`에 중앙화된 `axios` 인스턴스를 생성하고, 인터셉터(interceptor)를 활용하여 모든 API 요청에 인증 토큰(JWT)을 자동으로 주입합니다. 이를 통해 API 요청 코드를 간결하게 유지하고, 인증 관련 로직을 한 곳에서 관리할 수 있습니다.

## 프로젝트 구조

```
/ares-frontend
├── app/                # Expo Router가 관리하는 화면 영역
│   ├── (auth)/         # 인증이 필요 없는 화면 (로그인, 회원가입)
│   ├── (protected)/    # 인증이 필요한 화면
│   └── _layout.tsx     # 전역 레이아웃 및 네비게이션 설정
├── assets/             # 폰트, 이미지, 비디오 등 정적 에셋
├── components/         # 재사용 가능한 UI 컴포넌트
│   ├── ui/             # 버튼, 헤더 등 범용적인 기초 컴포넌트
│   └── {domain}/       # 이력서, 면접 등 특정 도메인 관련 컴포넌트
├── constants/          # 색상, 레이아웃 등 앱 전역에서 사용되는 상수
├── hooks/              # 공통 로직을 담은 커스텀 훅
├── i18n/               # 다국어 지원(i18next) 설정
├── schemas/            # Zod를 사용한 데이터 유효성 검사 스키마
├── services/           # Axios 인스턴스 및 API 호출 서비스
├── stores/             # Zustand를 사용한 전역 상태 관리 스토어
└── utils/              # 기타 유틸리티 함수 (날짜 포맷팅 등)
```

## 기술 스택

- **Framework**: React Native, Expo
- **Language**: TypeScript
- **Routing**: Expo Router
- **State Management**: Zustand
- **Data Fetching**: Axios
- **Forms**: React Hook Form
- **Schema Validation**: Zod
- **UI**: React Navigation, React Native Elements, React Native SVG
- **Animation**: React Native Reanimated
- **Camera/AV**: Expo Camera, Expo AV
- **Internationalization**: i18next, React-i18next
- **Charting**: React Native Chart Kit

## 설치 및 실행 방법

### 1. 사전 요구사항

- Node.js (LTS 버전 권장)
- `npm` 또는 `yarn`
- ARES 백엔드 서버 실행 ([백엔드 저장소](https://github.com/project-ares-interview/ares-backend) 참고)

### 2. 프로젝트 클론

```bash
git clone https://github.com/project-ares-interview/ares-frontend.git
cd ares-frontend
```

### 3. 라이브러리 설치

```bash
npm install
# 또는
yarn install
```

### 4. 환경 변수 설정

프로젝트 루트에 `.env.development` 파일을 생성하고, 실행 중인 백엔드 서버의 주소를 입력합니다.

```env
# ARES Backend API URL
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 5. 개발 서버 실행

```bash
dotenvx run -f .env.environments -- npm start
# 또는
dotenvx run -f .env.environments -- yarn start
```

실행 후 나타나는 QR 코드를 Expo Go 앱으로 스캔하거나, 각 플랫폼(Android, iOS, Web)에 맞게 실행할 수 있습니다.

## Team

| <a href="https://github.com/Windy-kim12"><img src="https://github.com/Windy-kim12.png" width="100px" /></a> | <a href="https://github.com/howl-papa"><img src="https://github.com/howl-papa.png" width="100px" /></a> | <a href="https://github.com/Jang-Eunho"><img src="https://github.com/Jang-Eunho.png" width="100px" /></a> | <a href="https://github.com/J1STAR"><img src="https://github.com/J1STAR.png" width="100px" /></a> | <a href="https://github.com/soheejin"><img src="https://github.com/soheejin.png" width="100px" /></a> | <a href="https://github.com/DongDong2e2e"><img src="https://github.com/DongDong2e2e.png" width="100px" /></a> |
| :----------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
|                               [김서현](https://github.com/Windy-kim12)                               |                               [박용락](https://github.com/howl-papa)                               |                               [장은호](https://github.com/Jang-Eunho)                               |                                [장한별](https://github.com/J1STAR)                                 |                                [진소희](https://github.com/soheejin)                                 |                              [최동휘](https://github.com/DongDong2e2e)                               |
