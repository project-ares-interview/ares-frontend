import { AnalysisInput, AnalysisResult, CompanyData } from '@/schemas/analysis';
import { resumeService } from '@/services/resumeService';
import { FontAwesome5 } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input, Text } from '@rneui/themed';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerAsset } from 'expo-document-picker';
import React, { useState } from 'react';
import { Control, Controller, FieldErrors, useForm, UseFormHandleSubmit } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { z } from 'zod';

// Schemas and Types
const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  department: z.string().optional(),
  location: z.string().optional(),
  kpi: z.string().optional(),
  requirements: z.string().optional(),
});
const analysisSchema = z.object({
  company: companySchema,
  jd_text: z.string().optional(),
  resume_text: z.string().optional(),
  research_text: z.string().optional(),
});
type FormData = z.infer<typeof analysisSchema>;

// --- Sub-components ---

interface AnalysisFormProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData>;
  onSubmit: (data: FormData) => void;
  loading: boolean;
  jdFile: DocumentPickerAsset | null;
  setJdFile: React.Dispatch<React.SetStateAction<DocumentPickerAsset | null>>;
  resumeFile: DocumentPickerAsset | null;
  setResumeFile: React.Dispatch<React.SetStateAction<DocumentPickerAsset | null>>;
  researchFile: DocumentPickerAsset | null;
  setResearchFile: React.Dispatch<React.SetStateAction<DocumentPickerAsset | null>>;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({
  control, errors, handleSubmit, onSubmit, loading,
  jdFile, setJdFile,
  resumeFile, setResumeFile,
  researchFile, setResearchFile
}) => {

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
    <View>
      <Text h3 style={styles.title}>AI Resume Analysis</Text>
      <Card containerStyle={styles.card}>
        <Card.Title>Company & Job Information</Card.Title>
        <Card.Divider />
        <Controller name="company.name" control={control} render={({ field: { onChange, onBlur, value } }) => <Input label="Company Name" placeholder="e.g., Google" value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={errors.company?.name?.message} />} />
        <Controller name="company.job_title" control={control} render={({ field: { onChange, onBlur, value } }) => <Input label="Job Title" placeholder="e.g., Software Engineer" value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={errors.company?.job_title?.message} />} />
        <Controller name="company.requirements" control={control} render={({ field: { onChange, onBlur, value } }) => <Input label="Requirements (comma-separated)" placeholder="e.g., 5+ years of React, AWS" value={value} onChangeText={onChange} onBlur={onBlur} multiline />} />
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
      <Card containerStyle={styles.card}>
        <Card.Title>Additional Research (Optional)</Card.Title>
        <Card.Divider />
        {renderFileInput('Research', researchFile, () => pickDocument(setResearchFile))}
        <Controller name="research_text" control={control} render={({ field: { onChange, onBlur, value } }) => <Input label="Or Paste Research Text" placeholder="Paste any additional research material here..." value={value} onChangeText={onChange} onBlur={onBlur} multiline numberOfLines={4} style={styles.textArea} />} />
      </Card>
      <Button title="Analyze Resume" onPress={handleSubmit(onSubmit)} loading={loading} disabled={loading} buttonStyle={styles.submitButton} containerStyle={styles.submitContainer} />
    </View>
  );
};

interface AnalysisResultDisplayProps {
  loading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ loading, error, result }) => {
  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#007bff" /></View>;
  }
  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }
  if (!result) {
    return (
        <View style={styles.centered}>
            <Text style={styles.placeholderText}>분석 결과가 여기에 표시됩니다.</Text>
        </View>
    );
  }

  return (
    <View>
        <Text h4 style={styles.resultAreaTitle}>Analysis Result</Text>
        <Card containerStyle={styles.card}><Card.Title>심층분석</Card.Title><Card.Divider /><Markdown style={markdownStyles}>{result["심층분석"]}</Markdown></Card>
        <Card containerStyle={styles.card}><Card.Title>교차분석</Card.Title><Card.Divider /><Markdown style={markdownStyles}>{result["교차분석"]}</Markdown></Card>
        <Card containerStyle={styles.card}><Card.Title>정합성 점검</Card.Title><Card.Divider /><Markdown style={markdownStyles}>{result["정합성점검"]}</Markdown></Card>
        <Card containerStyle={styles.card}><Card.Title>NCS 요약</Card.Title><Card.Divider /><Markdown style={markdownStyles}>{result["NCS요약"]}</Markdown></Card>
    </View>
  );
};

// --- Main Screen ---

const ResumeAnalysisScreen = () => {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 1000;

  const [jdFile, setJdFile] = useState<DocumentPickerAsset | null>(null);
  const [resumeFile, setResumeFile] = useState<DocumentPickerAsset | null>(null);
  const [researchFile, setResearchFile] = useState<DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(analysisSchema),
    defaultValues: { company: { name: '', job_title: '', department: '', location: '', kpi: '', requirements: '' }, jd_text: '', resume_text: '', research_text: '' },
  });

  const onSubmit = async (data: FormData) => {
    if (!jdFile && !data.jd_text) {
      Alert.alert('Validation Error', 'Please provide either a Job Description file or text.');
      return;
    }
    if (!resumeFile && !data.resume_text) {
      Alert.alert('Validation Error', 'Please provide either a Resume file or text.');
      return;
    }
    setLoading(true);
    setError(null);

    const companyData: CompanyData = {
      ...data.company,
      kpi: data.company.kpi ? data.company.kpi.split(',').map(s => s.trim()) : [],
      requirements: data.company.requirements ? data.company.requirements.split(',').map(s => s.trim()) : [],
    };
    const analysisInput: AnalysisInput = {
      company: companyData,
      jd_file: jdFile,
      jd_text: data.jd_text,
      resume_file: resumeFile,
      resume_text: data.resume_text,
      research_file: researchFile,
      research_text: data.research_text,
    };

    try {
      const response = await resumeService.analyzeResume(analysisInput);
      setResult(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'An unknown error occurred.';
      setError(`Analysis failed: ${errorMessage}`);
      Alert.alert('Analysis Error', `Failed to analyze resume. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.outerContainer}>
      <View style={[styles.mainContainer, isWideScreen ? styles.rowLayout : styles.columnLayout]}>
        <View style={[styles.formColumn, isWideScreen && styles.wideColumn, isWideScreen && styles.formColumnBorder]}>
          <AnalysisForm
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            loading={loading}
            jdFile={jdFile}
            setJdFile={setJdFile}
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            researchFile={researchFile}
            setResearchFile={setResearchFile}
          />
        </View>
        <View style={[styles.resultColumn, isWideScreen && styles.wideColumn]}>
          <AnalysisResultDisplay loading={loading} error={error} result={result} />
        </View>
      </View>
    </ScrollView>
  );
};

const markdownStyles = StyleSheet.create({
  heading1: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContainer: {
    // No flex: 1, allows ScrollView to manage height
  },
  rowLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Prevents columns from stretching to equal height
  },
  columnLayout: {
    flexDirection: 'column',
  },
  formColumn: {
    padding: 16,
  },
  resultColumn: {
    padding: 16,
  },
  wideColumn: {
    flex: 1, // Takes up proportional width
    minWidth: 450, // Ensures it doesn't get too cramped
  },
  formColumnBorder: {
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginLeft: 10,
  },
  fileInputContainer: {
    marginBottom: 16,
  },
  fileInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textArea: {
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    height: 120,
  },
  submitButton: {
    paddingVertical: 12,
  },
  submitContainer: {
    marginVertical: 24,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  resultAreaTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  resultContent: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ResumeAnalysisScreen;