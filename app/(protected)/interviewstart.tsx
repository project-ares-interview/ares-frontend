import { useInterviewActions, useInterviewSettings } from '@/stores/interviewStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input, Text as RNEText } from '@rneui/themed';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

const interviewSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  company: z.string().min(1, '지원회사명을 입력해주세요.'),
  job_title: z.string().min(1, '지원직무를 입력해주세요.'),
  department: z.string().optional(),
  skills: z.string().optional(),
  certifications: z.string().optional(),
  activities: z.string().optional(),
});

type InterviewFormData = z.infer<typeof interviewSchema>;

export default function InterviewStartPage() {
  const { t } = useTranslation();
  const { setInterviewSettings } = useInterviewActions();
  const settings = useInterviewSettings();

  const [gender, setGender] = React.useState(settings.gender);
  const [interviewerMode, setInterviewerMode] = React.useState(settings.interviewer_mode);
  const [difficulty, setDifficulty] = React.useState(settings.difficulty);

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
    },
    mode: 'onChange',
  });

  const onSubmit = (data: InterviewFormData) => {
    if (!gender || !interviewerMode || !difficulty) {
      // 간단한 유효성 검사
      alert('성별, 면접모드, 난이도를 선택해주세요.');
      return;
    }
    setInterviewSettings({ 
      ...data, 
      gender, 
      interviewer_mode: interviewerMode, 
      difficulty 
    });
    router.push('/interview');
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

        <Text style={styles.label}>특기 (선택)</Text>
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

        <Button
          title="면접 시작하기"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || !gender || !interviewerMode || !difficulty}
          containerStyle={styles.buttonContainer}
        />
      </Card>
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
});
