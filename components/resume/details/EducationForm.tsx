import {
  DegreeType,
  Education,
  EducationCreate,
  EducationStatus,
  EducationUpdate,
  SchoolType,
} from "@/schemas/resume";
import { convertYearMonthToYearMonthDay } from "@/utils/dateUtils";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import YearMonthPicker from "./YearMonthPicker";

interface FormLabelProps {
  label: string;
  required?: boolean;
}

const FormLabel: React.FC<FormLabelProps> = ({ label, required }) => (
  <Text style={styles.label}>
    {label}
    {required && <Text style={styles.requiredAsterisk}> *</Text>}
  </Text>
);

interface EducationFormProps {
  initialData?: Education | null;
  onSubmit: (data: EducationCreate | EducationUpdate) => void;
  onCancel: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    school_name: "",
    major: "",
    degree: "" as DegreeType | "",
    school_type: "university" as SchoolType,
    status: "graduated" as EducationStatus,
    admission_date: "",
    graduation_date: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        school_name: initialData.school_name || "",
        major: initialData.major || "",
        degree: initialData.degree || "",
        school_type: initialData.school_type,
        status: initialData.status,
        admission_date: initialData.admission_date.substring(0, 7),
        graduation_date: initialData.graduation_date?.substring(0, 7) || "",
      });
    } else {
        setFormData({
            school_name: "",
            major: "",
            degree: "",
            school_type: "university",
            status: "graduated",
            admission_date: "",
            graduation_date: "",
        });
    }
  }, [initialData]);

  useEffect(() => {
    const { school_name, major, degree, school_type, status, admission_date, graduation_date } = formData;
    const isMajorValid = ["elementary_school", "middle_school", "high_school"].includes(school_type) || major.trim() !== "";
    const isDegreeValid = ["elementary_school", "middle_school", "high_school"].includes(school_type) || !!degree;
    const isGraduationDateValid = status === "attending" || graduation_date.trim() !== "";
    setIsFormValid(school_name.trim() !== "" && isMajorValid && isDegreeValid && admission_date.trim() !== "" && isGraduationDateValid);
  }, [formData]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "school_type") {
        if (["elementary_school", "middle_school", "high_school"].includes(value)) {
          newState.degree = "";
          newState.major = "";
        }
      }
      return newState;
    });
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    const dataToSubmit = {
      ...formData,
      major: ["elementary_school", "middle_school", "high_school"].includes(formData.school_type) ? null : formData.major,
      degree: ["elementary_school", "middle_school", "high_school"].includes(formData.school_type) ? null : formData.degree || null,
      admission_date: convertYearMonthToYearMonthDay(formData.admission_date)!,
      graduation_date: formData.status !== "attending" && formData.graduation_date ? convertYearMonthToYearMonthDay(formData.graduation_date) : null,
    };
    onSubmit(dataToSubmit);
  };

  const schoolTypeOptions: { label: string; value: SchoolType }[] = [
    { label: t("resume.education.school_type_options.elementary_school"), value: "elementary_school" },
    { label: t("resume.education.school_type_options.middle_school"), value: "middle_school" },
    { label: t("resume.education.school_type_options.high_school"), value: "high_school" },
    { label: t("resume.education.school_type_options.junior_college"), value: "junior_college" },
    { label: t("resume.education.school_type_options.university"), value: "university" },
  ];

  const degreeOptions: { label: string; value: DegreeType }[] = [
    { label: t("resume.education.degree_options.associate"), value: "associate" },
    { label: t("resume.education.degree_options.bachelor"), value: "bachelor" },
    { label: t("resume.education.degree_options.master"), value: "master" },
    { label: t("resume.education.degree_options.doctorate"), value: "doctorate" },
  ];

  const statusOptions: { label: string; value: EducationStatus }[] = [
    { label: t("resume.education.status_options.attending"), value: "attending" },
    { label: t("resume.education.status_options.graduated"), value: "graduated" },
    { label: t("resume.education.status_options.completed"), value: "completed" },
    { label: t("resume.education.status_options.dropout"), value: "dropout" },
  ];

  const showMajorAndDegree = !["elementary_school", "middle_school", "high_school"].includes(formData.school_type);

  return (
    <View style={styles.formContainer}>
        <View style={styles.formGroup}>
            <FormLabel label={t("resume.education.school_type")} required />
            <View style={styles.pickerContainer}>
                <Picker selectedValue={formData.school_type} onValueChange={(v) => handleChange("school_type", v)} style={styles.picker}>
                    {schoolTypeOptions.map((opt) => <Picker.Item key={opt.value} label={opt.label} value={opt.value} />)}
                </Picker>
            </View>
        </View>

        <View style={styles.formGroup}>
            <FormLabel label={t("resume.education.school_name")} required />
            <TextInput style={styles.input} placeholder={t("resume.education.school_name_placeholder")} placeholderTextColor="#aaa" value={formData.school_name} onChangeText={(v) => handleChange("school_name", v)} />
        </View>

        {showMajorAndDegree && (
            <>
                <View style={styles.formGroup}>
                    <FormLabel label={t("resume.education.major")} required />
                    <TextInput style={styles.input} placeholder={t("resume.education.major_placeholder")} placeholderTextColor="#aaa" value={formData.major} onChangeText={(v) => handleChange("major", v)} />
                </View>
                <View style={styles.formGroup}>
                    <FormLabel label={t("resume.education.degree")} required />
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={formData.degree} onValueChange={(v) => handleChange("degree", v)} style={styles.picker}>
                            <Picker.Item label={t("resume.education.degree_placeholder")} value="" />
                            {degreeOptions.map((opt) => <Picker.Item key={opt.value} label={opt.label} value={opt.value} />)}
                        </Picker>
                    </View>
                </View>
            </>
        )}

        <View style={styles.formGroup}>
            <FormLabel label={t("resume.education.status")} required />
            <View style={styles.pickerContainer}>
                <Picker selectedValue={formData.status} onValueChange={(v) => handleChange("status", v)} style={styles.picker}>
                    {statusOptions.map((opt) => <Picker.Item key={opt.value} label={opt.label} value={opt.value} />)}
                </Picker>
            </View>
        </View>

        <View style={styles.formGroup}>
            <YearMonthPicker label={t("resume.education.admission_date")} date={formData.admission_date} onDateChange={(v) => handleChange("admission_date", v)} required />
        </View>

        {formData.status !== "attending" && (
            <View style={styles.formGroup}>
                <YearMonthPicker label={t("resume.education.graduation_date")} date={formData.graduation_date} onDateChange={(v) => handleChange("graduation_date", v)} required />
            </View>
        )}

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                <Text style={styles.buttonText}>{t("common.cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, !isFormValid && styles.disabledButton]} onPress={handleSubmit} disabled={!isFormValid}>
                <Text style={styles.buttonText}>{t("common.save")}</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    formContainer: { backgroundColor: "#f9f9f9", borderRadius: 8, padding: 16, marginVertical: 10 },
    formGroup: { marginBottom: 15 },
    label: { fontSize: 16, marginBottom: 5, color: "#555", fontWeight: "500" },
    requiredAsterisk: { color: "#ff4d4f" },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, fontSize: 15, backgroundColor: "white" },
    pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, backgroundColor: "white" },
    picker: { height: 50 },
    buttonContainer: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10, gap: 10 },
    button: { backgroundColor: "#4972c3ff", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
    cancelButton: { backgroundColor: "#7e91b9ff" },
    disabledButton: { backgroundColor: "#ccc" },
    buttonText: { color: "white", fontWeight: "bold", fontSize: 14 },
});

export default EducationForm;