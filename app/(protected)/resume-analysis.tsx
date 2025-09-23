import { AnalysisInput, AnalysisResult, CompanyData } from "@/schemas/analysis";
import { resumeService } from "@/services/resumeService";
import { FontAwesome5 } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DocumentPicker from "expo-document-picker";
import { DocumentPickerAsset } from "expo-document-picker";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  useForm,
  UseFormHandleSubmit,
} from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { z } from "zod";

// Schemas and Types
const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  job_title: z.string().min(1, "Job title is required"),
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
  setResumeFile: React.Dispatch<
    React.SetStateAction<DocumentPickerAsset | null>
  >;
  researchFile: DocumentPickerAsset | null;
  setResearchFile: React.Dispatch<
    React.SetStateAction<DocumentPickerAsset | null>
  >;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({
  control,
  errors,
  handleSubmit,
  onSubmit,
  loading,
  jdFile,
  setJdFile,
  resumeFile,
  setResumeFile,
  researchFile,
  setResearchFile,
}) => {
  const pickDocument = async (
    setter: React.Dispatch<React.SetStateAction<DocumentPickerAsset | null>>
  ) => {
    try {
      const pickerResult = await DocumentPicker.getDocumentAsync({});
      if (!pickerResult.canceled) {
        setter(pickerResult.assets[0]);
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Error", "Failed to pick document.");
    }
  };

  const renderFileInput = (
    label: string,
    file: DocumentPickerAsset | null,
    onPress: () => void
  ) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.fileButton} onPress={onPress}>
        <FontAwesome5
          name="file-upload"
          size={16}
          color="#4972c3ff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.fileButtonText} numberOfLines={1}>
          {file ? file.name : `${label} 파일 선택`}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <Text style={styles.title}>AI 이력서 첨삭</Text>
      <Text style={styles.requiredInfoText}>📌 는 필수 항목입니다.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>회사 & 직업 정보 </Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>회사 이름 📌</Text>
          <Controller
            name="company.name"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="예시: Microsoft"
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.company?.name && (
            <Text style={styles.errorText}>{errors.company.name.message}</Text>
          )}
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>직업 이름 📌</Text>
          <Controller
            name="company.job_title"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="예시: 데이터 분석가"
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.company?.job_title && (
            <Text style={styles.errorText}>
              {errors.company.job_title.message}
            </Text>
          )}
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>우대사항 ( , 로 구분해주세요)</Text>
          <Controller
            name="company.requirements"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="예시: ADP 자격증 보유, 경력 5년 이상..."
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
              />
            )}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>직무 기술서 📌</Text>
        {renderFileInput("직무 기술서", jdFile, () => pickDocument(setJdFile))}
        <View style={styles.formGroup}>
          <Text style={styles.label}>또는 직무 기술서 작성</Text>
          <Controller
            name="jd_text"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="📎여기에 직무 기술서를 붙여넣어 주세요!"
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
              />
            )}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>이력서/자기소개서 📌</Text>
        {renderFileInput("이력서/자기소개서", resumeFile, () =>
          pickDocument(setResumeFile)
        )}
        <View style={styles.formGroup}>
          <Text style={styles.label}>또는 이력서/자기소개서 작성</Text>
          <Controller
            name="resume_text"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="📎여기에 이력서/자소서를 붙여넣어 주세요!"
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
              />
            )}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>추가 자료</Text>
        {renderFileInput("자료", researchFile, () =>
          pickDocument(setResearchFile)
        )}
        <View style={styles.formGroup}>
          <Text style={styles.label}>또는 추자 자료 작성</Text>
          <Controller
            name="research_text"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="📎여기에 추가 조사 자료를 붙여넣어 주세요!"
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
              />
            )}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>이력서 분석하기📈</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

interface AnalysisResultDisplayProps {
  loading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({
  loading,
  error,
  result,
}) => {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4972c3ff" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  if (!result) {
    return (
      <View style={styles.centered}>
        <Text style={styles.placeholderText}>
          분석 결과가 여기에 표시됩니다.
        </Text>
      </View>
    );
  }

  const renderResultSection = (title: string, content: string) => (
    <View key={title} style={styles.eventItem}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventSummary}>{title}</Text>
      </View>
      <Markdown style={markdownStyles}>{content || "N/A"}</Markdown>
    </View>
  );

  return (
    <View>
      <Text style={styles.title}>Analysis Result</Text>
      {renderResultSection("심층분석", result["심층분석"])}
      {renderResultSection("교차분석", result["교차분석"])}
      {renderResultSection("정합성 점검", result["정합성점검"])}
      {renderResultSection("NCS 요약", result["NCS요약"])}
    </View>
  );
};

// --- Main Screen ---

const ResumeAnalysisScreen = () => {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 1000;

  const [jdFile, setJdFile] = useState<DocumentPickerAsset | null>(null);
  const [resumeFile, setResumeFile] = useState<DocumentPickerAsset | null>(
    null
  );
  const [researchFile, setResearchFile] = useState<DocumentPickerAsset | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      company: { name: "", job_title: "", requirements: "" },
      jd_text: "",
      resume_text: "",
      research_text: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!jdFile && !data.jd_text) {
      Alert.alert(
        "Validation Error",
        "Please provide either a Job Description file or text."
      );
      return;
    }
    if (!resumeFile && !data.resume_text) {
      Alert.alert(
        "Validation Error",
        "Please provide either a Resume file or text."
      );
      return;
    }
    setLoading(true);
    setError(null);

    const companyData: CompanyData = {
      ...data.company,
      kpi: [], // kpi and location are not in the form anymore
      location: "",
      requirements: data.company.requirements
        ? data.company.requirements.split(",").map((s) => s.trim())
        : [],
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
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "An unknown error occurred.";
      setError(`Analysis failed: ${errorMessage}`);
      Alert.alert(
        "Analysis Error",
        `Failed to analyze resume. ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.outerContainer}>
      <View
        style={[
          styles.mainContainer,
          isWideScreen ? styles.rowLayout : styles.columnLayout,
        ]}
      >
        <View
          style={[
            styles.formColumn,
            isWideScreen && styles.wideColumn,
            isWideScreen && styles.formColumnBorder,
          ]}
        >
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
          <AnalysisResultDisplay
            loading={loading}
            error={error}
            result={result}
          />
        </View>
      </View>
    </ScrollView>
  );
};

// --- Styles ---

const markdownStyles = StyleSheet.create({
  heading1: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
    color: "#555",
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    color: "#555",
  },
  body: { fontSize: 16, lineHeight: 24, color: "#555" },
});

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#fff" },
  mainContainer: {
    width: "70%",
    maxWidth: 1280,
    alignSelf: "center",
  },
  rowLayout: { flexDirection: "row", alignItems: "flex-start" },
  columnLayout: { flexDirection: "column" },
  formColumn: { padding: 20 },
  resultColumn: { padding: 20, backgroundColor: "#f9f9f9" },
  wideColumn: { flex: 1, minWidth: 450 },
  formColumnBorder: { borderRightWidth: 1, borderRightColor: "#e0e0e0" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10, // Reduced margin
    color: "#555",
    textAlign: "center",
  },
  requiredInfoText: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    marginBottom: 20,
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#555",
  },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
    backgroundColor: "white",
  },
  textarea: { height: 120, textAlignVertical: "top" },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef7ff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#7e91b9ff",
  },
  fileButtonText: { color: "#4972c3ff", fontWeight: "600", flexShrink: 1 },
  button: {
    backgroundColor: "#4972c3ff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 300,
  },
  errorText: { color: "red", textAlign: "center", marginTop: 5 },
  placeholderText: { fontSize: 18, color: "#a4a2a2ff", textAlign: "center" },
  eventItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#4972c3ff",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  eventSummary: { fontSize: 18, fontWeight: "600", color: "#555" },
});

export default ResumeAnalysisScreen;
