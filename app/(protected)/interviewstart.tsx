import { AnalysisInput, CompanyData } from '@/schemas/analysis';
import { InterviewStartRequest } from '@/schemas/interview';
import { interviewService } from '@/services/interviewService';
import { resumeService } from '@/services/resumeService';
import {
  useInterviewSessionStore,
  useInterviewSettingsStore,
} from '@/stores/interviewStore';
import { FontAwesome5 } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input, Text as RNEText } from '@rneui/themed';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerAsset } from 'expo-document-picker';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const interviewSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  company: z.string().min(1, '지원회사명을 입력해주세요.'),
  job_title: z.string().min(1, '지원직무를 입력해주세요.'),
  department: z.string().optional(),
  skills: z.string().optional(),
  certifications: z.string().optional(),
  activities: z.string().optional(),
  jd_text: z.string().optional(),
  resume_text: z.string().optional(),
});

type InterviewFormData = z.infer<typeof interviewSchema>;

export default function InterviewStartPage() {
  const { t } = useTranslation();
  const { setSettings: setInterviewSettings, setAnalysisContext, ...settings } = useInterviewSettingsStore();
  const { startSession: startInterviewSession } = useInterviewSessionStore();
  const router = useRouter(); // Declare router here

  const [gender, setGender] = useState(settings.gender);
  const [interviewerMode, setInterviewerMode] = useState(settings.interviewer_mode || 'team_lead');
  const [difficulty, setDifficulty] = useState(settings.difficulty || 'normal');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [jdFile, setJdFile] = useState<DocumentPickerAsset | null>(null);
  const [resumeFile, setResumeFile] = useState<DocumentPickerAsset | null>(null);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      name: settings.name,
      company: settings.company,
      job_title: settings.job_title,
      department: settings.department,
      skills: settings.skills,
      certifications: settings.certifications,
      activities: settings.activities,
      jd_text: settings.jd_context,
      resume_text: settings.resume_context,
    },
    mode: 'onChange',
  });

  const pickDocument = async (setter: React.Dispatch<React.SetStateAction<DocumentPickerAsset | null>>) => {
    try {
      const pickerResult = await DocumentPicker.getDocumentAsync({});
      if (!pickerResult.canceled) {
        setter(pickerResult.assets[0]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  const onSubmit = async (data: InterviewFormData) => {
    console.log('onSubmit called');
    if (!gender) {
      Alert.alert('Validation Error', '성별을 선택해주세요.');
      console.log('Validation failed: gender not selected');
      return;
    }
    if (!jdFile && !data.jd_text) {
      Alert.alert('Validation Error', 'Please provide either a Job Description file or text.');
      console.log('Validation failed: JD missing');
      return;
    }
    if (!resumeFile && !data.resume_text) {
      Alert.alert('Validation Error', 'Please provide either a Resume file or text.');
      console.log('Validation failed: Resume missing');
      return;
    }

    setIsAnalyzing(true);
    console.log('setIsAnalyzing(true)');

    try {
      console.log('Starting resume analysis...');
      // 1. 이력서 분석 요청
      const companyData: CompanyData = {
        name: data.company,
        job_title: data.job_title,
        department: data.department,
      };

      const analysisInput: AnalysisInput = {
        company: companyData,
        jd_file: jdFile,
        jd_text: data.jd_text,
        resume_file: resumeFile,
        resume_text: data.resume_text,
      };

      const analysisResponse = await resumeService.analyzeResume(analysisInput);
      console.log('Resume analysis complete', analysisResponse);

      const jd_context = analysisResponse?.input_contexts?.raw?.jd_context;
      const resume_context = analysisResponse?.input_contexts?.raw?.resume_context;

      if (!jd_context || !resume_context) {
        console.error('Failed to get raw context from analysis: jd_context or resume_context missing');
        throw new Error('Failed to get raw context from analysis.');
      }

      console.log('Starting interview...');
      // 2. 면접 시작 요청 (질문 생성)
      const interviewStartPayload: InterviewStartRequest = {
        jd_context,
        resume_context,
        difficulty,
        interviewer_mode: interviewerMode,
        meta: {
          company_name: data.company,
          job_title: data.job_title,
          person_name: data.name,
          division: data.department,
          skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
        }
      };

      const interviewResponse = await interviewService.startInterview(interviewStartPayload);
      console.log('Interview started', interviewResponse);

      // 3. 모든 정보 스토어에 저장
      setAnalysisContext(jd_context, resume_context);
      setInterviewSettings({ 
        ...data, 
        gender, 
        interviewer_mode: interviewerMode, 
        difficulty 
      });
      startInterviewSession({
        session_id: interviewResponse.session_id,
        current_question: interviewResponse.question,
        turn_label: interviewResponse.turn_label,
      });
      console.log('Interview session data saved');

      // 4. 면접 페이지로 이동
      console.log('Navigating to interview page...');
      router.push('/(protected)/interview');

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'An unknown error occurred.';
      Alert.alert('Error', `Failed to start interview. ${errorMessage}`);
      console.error('Error during interview start process:', err);
    } finally {
      setIsAnalyzing(false);
      console.log('setIsAnalyzing(false)');
    }
  };

  const renderSelectButtons = (value: any, setValue: any, options: any[]) => (
    <View style={styles.selectContainer}>
      {options.map(option => (
        <Button
          key={option.value}
          title={option.label}
          onPress={() => setValue(option.value)}
          type={value === option.value ? 'solid' : 'outline'}
          containerStyle={styles.selectButtonContainer}
          buttonStyle={value === option.value ? styles.selectedButton : styles.unselectedButton}
          titleStyle={value === option.value ? styles.selectedButtonText : styles.unselectedButtonText}
        />
      ))}
    </View>
  );

  const renderFileInput = (
    label: string,
    file: DocumentPickerAsset | null,
    onPress: () => void
  ) => (
    <View style={styles.fileInputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.fileInput}>
        <Button
          onPress={onPress}
          title={file ? file.name : `Select ${label} File`}
          icon={<FontAwesome5 name="file-upload" size={16} color="white" style={{ marginRight: 8 }} />}
          buttonStyle={styles.fileUploadButton}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.twoColumnLayout}> {/* Main two-column container */}
        <View style={styles.leftColumn}> {/* Left column for Interview Settings */}
          <Card containerStyle={styles.card}>
            <View style={styles.sectionHeader}>
              <RNEText style={styles.title}>면접 설정</RNEText>
              <View style={styles.guideTextAndButtonContainer}>
                <Text style={styles.guidePromptText}>JAI 면접 이용이 처음이시라면?</Text>
                <Link href="/(protected)/interviewguide" asChild>
                  <TouchableOpacity style={styles.guideButton}>
                    <Text style={styles.guideButtonText}>면접 가이드 보기</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            <Text style={styles.label}>이름 (필수)</Text>
            <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
              <Input inputContainerStyle={styles.inputField} placeholder="홍길동" value={value} onBlur={onBlur} onChangeText={onChange} errorMessage={errors.name?.message} />
            )} />

            <Text style={styles.label}>성별 (필수)</Text>
            {renderSelectButtons(gender, setGender, [{ label: '남성', value: 'male' }, { label: '여성', value: 'female' }])}

            <Text style={styles.label}>지원회사명 (필수)</Text>
            <Controller control={control} name="company" render={({ field: { onChange, onBlur, value } }) => (
              <Input inputContainerStyle={styles.inputField} placeholder="(주)아레스" value={value} onBlur={onBlur} onChangeText={onChange} errorMessage={errors.company?.message} />
            )} />

            <Text style={styles.label}>지원직무 (필수)</Text>
            <Controller control={control} name="job_title" render={({ field: { onChange, onBlur, value } }) => (
              <Input inputContainerStyle={styles.inputField} placeholder="프론트엔드 개발자" value={value} onBlur={onBlur} onChangeText={onChange} errorMessage={errors.job_title?.message} />
            )} />

            <Text style={styles.label}>면접 모드 (필수)</Text>
            {renderSelectButtons(interviewerMode, setInterviewerMode, [{ label: '실무 면접', value: 'team_lead' }, { label: '임원 면접', value: 'executive' }])}

            <Text style={styles.label}>난이도 (필수)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              {renderSelectButtons(difficulty, setDifficulty, [{ label: '보통', value: 'normal' }, { label: '어려움', value: 'hard' }])}
              <Text style={{ fontSize: 12, color: '#666', marginLeft: 10, flexShrink: 1 }}>
                보통 난이도: 기본적인 역량 평가, 어려움 난이도: 심층적인 역량과 압박 상황에서의 대처 능력 평가
              </Text>
            </View>

            <Text style={styles.label}>부서 (선택)</Text>
            <Controller control={control} name="department" render={({ field: { onChange, onBlur, value } }) => (
              <Input inputContainerStyle={styles.inputField} placeholder="개발팀" value={value} onBlur={onBlur} onChangeText={onChange} />
            )} />

            <Text style={styles.label}>기술 스택 (선택, 쉼표로 구분)</Text>
            <Controller control={control} name="skills" render={({ field: { onChange, onBlur, value } }) => (
              <Input inputContainerStyle={styles.inputField} placeholder="React, TypeScript" value={value} onBlur={onBlur} onChangeText={onChange} />
            )} />

            <Text style={styles.label}>자격증 (선택, 쉼표로 구분)</Text>
            <Controller control={control} name="certifications" render={({ field: { onChange, onBlur, value } }) => (
              <Input inputContainerStyle={styles.inputField} placeholder="정보처리기사, 토익900점" value={value} onBlur={onBlur} onChangeText={onChange} />
            )} />

            <Text style={styles.label}>기타 활동 (선택, 쉼표로 구분)</Text>
            <Controller control={control} name="activities" render={({ field: { onChange, onBlur, value } }) => (
              <Input inputContainerStyle={styles.inputField} placeholder="오픈소스 프로젝트 참여, 자원봉사" value={value} onBlur={onBlur} onChangeText={onChange} />
            )} />
          </Card>
        </View>

        <View style={styles.rightColumn}> {/* Right column for JD and Resume */}
          <Card containerStyle={styles.card}>
            <Card.Title>직무기술서(JD, 필수)</Card.Title>
            <Card.Divider />
            {renderFileInput('직무기술서(JD)', jdFile, () => pickDocument(setJdFile))}
            <Controller name="jd_text" control={control} render={({ field: { onChange, onBlur, value } }) => <Input label="또는 텍스트로 붙여넣기" placeholder="이곳에 지원회사에서 제공한 직무기술서 내용을 붙여넣거나, 파일이 없는 경우 '없음'이라고 입력하세요." value={value} onChangeText={onChange} onBlur={onBlur} multiline numberOfLines={6} style={styles.textArea} />} />
          </Card>

          <Card containerStyle={styles.card}>
            <Card.Title>이력서(필수)</Card.Title>
            <Card.Divider />
            {renderFileInput('이력서', resumeFile, () => pickDocument(setResumeFile))}
            <Controller control={control} name="resume_text" render={({ field: { onChange, onBlur, value } }) => <Input label="또는 텍스트로 붙여넣기" placeholder="이곳에 본인의 이력서 내용을 붙여넣거나, 파일이 없는 경우 '없음'이라고 입력하세요." value={value} onChangeText={onChange} onBlur={onBlur} multiline numberOfLines={6} style={styles.textArea} />} />
          </Card>

          <Button
            title={isAnalyzing ? "작성 내용을 분석중입니다. 잠시만 기다려주세요.\n해당 작업은 작성 내용에 따라 30초~1분 정도 소요됩니다." : "면접 시작하기"}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || !gender || isAnalyzing}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.startButton}
            titleStyle={styles.startButtonText}
            icon={isAnalyzing ? <ActivityIndicator color="white" style={{ marginRight: 8 }} /> : null}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f9', // Consistent with home screen's neutral background
  },
  contentContainer: {
    padding: 16,
    justifyContent: 'center',
  },
  twoColumnLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 16,
  },
  leftColumn: {
    flex: 1,
    marginRight: 8,
  },
  rightColumn: {
    flex: 1,
    marginLeft: 8,
  },
  card: {
    borderRadius: 12, // Slightly more rounded
    marginBottom: 16,
    backgroundColor: '#ffffff', // Explicitly white background for cards
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    borderWidth: 0, // Remove default border if RNEUI adds one
  },
  title: {
    fontSize: 28, // Larger title
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333', // Darker text for titles on light background
  },
  label: {
    fontSize: 15, // Slightly smaller for labels
    fontWeight: '600', // Medium bold
    marginBottom: 8,
    color: '#444', // Softer dark color
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 24, // More spacing
    marginBottom: 32,
    paddingHorizontal: 16, // Match column padding
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16, // Added marginBottom
    marginLeft: 10,
  },
  selectButtonContainer: {
    marginRight: 10,
    borderRadius: 8, // Rounded buttons
  },
  selectedButton: {
    backgroundColor: '#0056b3', // Darker blue for selected buttons
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  unselectedButton: {
    borderColor: '#bdc3c7', // Softer gray border
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  selectedButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  unselectedButtonText: {
    color: '#34495e', // Match selected button text color
    fontWeight: '600',
  },
  fileUploadButton: {
    backgroundColor: '#17a2b8', // A light blue for file upload buttons
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  fileInputContainer: {
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  fileInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textArea: {
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8, // Consistent with cards
    padding: 12, // More padding
    height: 300,
    marginTop: 8,
    fontSize: 15,
    color: '#333',
  },
  inputField: { // New style for regular Input fields
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8, // Reduced height
    marginBottom: 16,
    fontSize: 15,
    color: '#333',
  },
  startButton: {
    backgroundColor: '#2ecc71', // A vibrant green, slightly different from #4CAF50
    paddingVertical: 14, // Larger button
    paddingHorizontal: 25,
    borderRadius: 10, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18, // Larger text
    fontWeight: 'bold',
  },
  guideTextAndButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Explicitly push content to the right within this container
    justifyContent: 'flex-end',
    flex: 1, // Allow container to take available space
  },
  guidePromptText: {
    fontSize: 13,
    color: '#555',
    marginRight: 8,
  },
  guideButton: {
    backgroundColor: '#007bff', // A more prominent blue for the guide button
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  guideButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});