import {
  useInterviewSettings,
  useInterviewSettingsActions,
  useInterviewSessionActions,
} from '@/stores/interviewStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input, Text as RNEText } from '@rneui/themed';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { z } from 'zod';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerAsset } from 'expo-document-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { resumeService } from '@/services/resumeService';
import { interviewService } from '@/services/interviewService';
import { AnalysisInput, CompanyData } from '@/schemas/analysis';
import { InterviewStartRequest } from '@/schemas/interview';

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
  const settings = useInterviewSettings();
  const { set: setInterviewSettings, setAnalysisContext } = useInterviewSettingsActions();
  const { start: startInterviewSession } = useInterviewSessionActions();

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
    if (!gender) {
      Alert.alert('Validation Error', '성별을 선택해주세요.');
      return;
    }
    if (!jdFile && !data.jd_text) {
      Alert.alert('Validation Error', 'Please provide either a Job Description file or text.');
      return;
    }
    if (!resumeFile && !data.resume_text) {
      Alert.alert('Validation Error', 'Please provide either a Resume file or text.');
      return;
    }

    setIsAnalyzing(true);

    try {
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

      const jd_context = analysisResponse?.input_contexts?.refined?.jd_context;
      const resume_context = analysisResponse?.input_contexts?.refined?.resume_context;

      if (!jd_context || !resume_context) {
        throw new Error('Failed to get refined context from analysis.');
      }

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

      // 4. 면접 페이지로 이동
      router.push('/(protected)/interview');

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'An unknown error occurred.';
      Alert.alert('Error', `Failed to start interview. ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
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
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card containerStyle={styles.card}>
        <RNEText h4 style={styles.title}>면접 설정</RNEText>

        <Text style={styles.label}>이름 (필수)</Text>
        <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="홍길동" value={value} onBlur={onBlur} onChangeText={onChange} errorMessage={errors.name?.message} />
        )} />

        <Text style={styles.label}>성별 (필수)</Text>
        {renderSelectButtons(gender, setGender, [{ label: '남성', value: 'male' }, { label: '여성', value: 'female' }])}

        <Text style={styles.label}>지원회사명 (필수)</Text>
        <Controller control={control} name="company" render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="(주)아레스" value={value} onBlur={onBlur} onChangeText={onChange} errorMessage={errors.company?.message} />
        )} />

        <Text style={styles.label}>지원직무 (필수)</Text>
        <Controller control={control} name="job_title" render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="프론트엔드 개발자" value={value} onBlur={onBlur} onChangeText={onChange} errorMessage={errors.job_title?.message} />
        )} />

        <Text style={styles.label}>면접 모드 (필수)</Text>
        {renderSelectButtons(interviewerMode, setInterviewerMode, [{ label: '실무 면접', value: 'team_lead' }, { label: '임원 면접', value: 'executive' }])}

        <Text style={styles.label}>난이도 (필수)</Text>
        {renderSelectButtons(difficulty, setDifficulty, [{ label: '보통', value: 'normal' }, { label: '어려움', value: 'hard' }])}

        <Text style={styles.label}>부서 (선택)</Text>
        <Controller control={control} name="department" render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="개발팀" value={value} onBlur={onBlur} onChangeText={onChange} />
        )} />

        <Text style={styles.label}>기술 스택 (선택, 쉼표로 구분)</Text>
        <Controller control={control} name="skills" render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="React, TypeScript" value={value} onBlur={onBlur} onChangeText={onChange} />
        )} />

        <Text style={styles.label}>자격증 (선택)</Text>
        <Controller control={control} name="certifications" render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="정보처리기사" value={value} onBlur={onBlur} onChangeText={onChange} />
        )} />

        <Text style={styles.label}>기타 활동 (선택)</Text>
        <Controller control={control} name="activities" render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="오픈소스 프로젝트 참여" value={value} onBlur={onBlur} onChangeText={onChange} />
        )} />
      </Card>

      <Card containerStyle={styles.card}>
        <Card.Title>Job Description (JD)</Card.Title>
        <Card.Divider />
        {renderFileInput('JD', jdFile, () => pickDocument(setJdFile))}
        <Controller name="jd_text" control={control} render={({ field: { onChange, onBlur, value } }) => <Input label="Or Paste JD Text" placeholder="Paste the job description here..." value={value} onChangeText={onChange} onBlur={onBlur} multiline numberOfLines={6} style={styles.textArea} />} />
      </Card>

      <Card containerStyle={styles.card}>
        <Card.Title>Resume</Card.Title>
        <Card.Divider />
        {renderFileInput('Resume', resumeFile, () => pickDocument(setResumeFile))}
        <Controller name="resume_text" control={control} render={({ field: { onChange, onBlur, value } }) => <Input label="Or Paste Resume Text" placeholder="Paste your resume here..." value={value} onChangeText={onChange} onBlur={onBlur} multiline numberOfLines={6} style={styles.textArea} />} />
      </Card>

      <Button
        title={isAnalyzing ? "Starting Interview..." : "면접 시작하기"}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || !gender || isAnalyzing}
        containerStyle={styles.buttonContainer}
        icon={isAnalyzing ? <ActivityIndicator color="white" style={{ marginRight: 8 }} /> : null}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32, // Add some bottom margin
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
    marginLeft: 10,
  },
  selectButtonContainer: {
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: '#000000',
  },
  unselectedButton: {
    borderColor: '#000000',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  unselectedButtonText: {
    color: '#000000',
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
    borderRadius: 4,
    padding: 8,
    height: 120,
    marginTop: 8,
  },
});