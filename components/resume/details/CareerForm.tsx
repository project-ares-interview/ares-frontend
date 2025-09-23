import { Career, CareerCreate, CareerUpdate } from "@/schemas/resume";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "./DatePicker";

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

interface CareerFormProps {
  initialData?: Career | null;
  onSubmit: (data: CareerCreate | CareerUpdate) => void;
  onCancel: () => void;
}

const CareerForm: React.FC<CareerFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    company_name: "",
    department: "",
    start_date: "",
    end_date: "",
    is_current: false,
    responsibilities: "",
    experience_type: "experienced" as "newcomer" | "experienced",
    reason_for_leaving: "",
    task: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name,
        department: initialData.department,
        start_date: initialData.start_date,
        end_date: initialData.end_date || "",
        is_current: initialData.is_current,
        responsibilities: initialData.responsibilities,
        task: initialData.task || "",
        experience_type: initialData.experience_type,
        reason_for_leaving: initialData.reason_for_leaving || "",
      });
    } else {
        setFormData({
            company_name: "",
            department: "",
            start_date: "",
            end_date: "",
            is_current: false,
            responsibilities: "",
            experience_type: "experienced",
            reason_for_leaving: "",
            task: "",
        });
    }
  }, [initialData]);

  useEffect(() => {
    const { company_name, department, start_date, end_date, is_current, responsibilities } = formData;
    const requiredFieldsFilled = company_name.trim() !== "" && department.trim() !== "" && responsibilities.trim() !== "" && start_date.trim() !== "";
    const endDateValid = is_current || end_date.trim() !== "";
    setIsFormValid(requiredFieldsFilled && endDateValid);
  }, [formData]);

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (name === "is_current" && value) {
        newFormData.end_date = "";
        newFormData.reason_for_leaving = "";
      }
      return newFormData;
    });
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    const dataToSubmit = {
      ...formData,
      end_date: formData.is_current ? null : formData.end_date || null,
      reason_for_leaving: formData.is_current ? null : formData.reason_for_leaving || null,
    };
    onSubmit(dataToSubmit);
  };

  const experienceTypeOptions = [
    { label: t("resume.career.experience_type_options.newcomer"), value: "newcomer" },
    { label: t("resume.career.experience_type_options.experienced"), value: "experienced" },
  ];

  return (
    <View style={styles.formContainer}>
        <View style={styles.formGroup}>
            <FormLabel label={t("resume.career.experience_type")} required />
            <View style={styles.pickerContainer}>
                <Picker selectedValue={formData.experience_type} onValueChange={(v) => handleChange("experience_type", v)} style={styles.picker}>
                    {experienceTypeOptions.map((opt) => <Picker.Item key={opt.value} label={opt.label} value={opt.value} />)}
                </Picker>
            </View>
        </View>

        <View style={styles.formGroup}>
            <FormLabel label={t("resume.career.company_name")} required />
            <TextInput style={styles.input} placeholder={t("resume.career.company_name_placeholder")} placeholderTextColor="#aaa" value={formData.company_name} onChangeText={(v) => handleChange("company_name", v)} />
        </View>

        <View style={styles.formGroup}>
            <FormLabel label={t("resume.career.department")} required />
            <TextInput style={styles.input} placeholder={t("resume.career.department_placeholder")} placeholderTextColor="#aaa" value={formData.department} onChangeText={(v) => handleChange("department", v)} />
        </View>

        <View style={styles.formGroup}>
            <FormLabel label={t("resume.career.responsibilities")} required />
            <TextInput style={styles.input} placeholder={t("resume.career.responsibilities_placeholder")} placeholderTextColor="#aaa" value={formData.responsibilities} onChangeText={(v) => handleChange("responsibilities", v)} />
        </View>

        <View style={styles.formGroup}>
            <FormLabel label={t("resume.career.task")} />
            <TextInput style={[styles.input, styles.textarea]} placeholder={t("resume.career.task_placeholder")} placeholderTextColor="#aaa" value={formData.task} onChangeText={(v) => handleChange("task", v)} multiline />
        </View>

        <View style={styles.formGroup}>
            <DatePicker label={t("resume.career.start_date")} date={formData.start_date} onDateChange={(v) => handleChange("start_date", v)} required />
        </View>

        <View style={styles.switchContainer}>
            <Text style={styles.label}>{t("resume.career.is_current")}</Text>
            <Switch value={formData.is_current} onValueChange={(v) => handleChange("is_current", v)} trackColor={{ false: "#767577", true: "#4972c3ff" }} thumbColor={formData.is_current ? "#fff" : "#f4f3f4"} />
        </View>

        {!formData.is_current && (
            <>
                <View style={styles.formGroup}>
                    <DatePicker label={t("resume.career.end_date")} date={formData.end_date} onDateChange={(v) => handleChange("end_date", v)} required />
                </View>
                <View style={styles.formGroup}>
                    <FormLabel label={t("resume.career.reason_for_leaving")} />
                    <TextInput style={[styles.input, styles.textarea]} placeholder={t("resume.career.reason_for_leaving_placeholder")} placeholderTextColor="#aaa" value={formData.reason_for_leaving} onChangeText={(v) => handleChange("reason_for_leaving", v)} multiline />
                </View>
            </>
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
    textarea: { height: 100, textAlignVertical: "top" },
    pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, backgroundColor: "white" },
    picker: { height: 50 },
    switchContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15, paddingVertical: 10 },
    buttonContainer: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10, gap: 10 },
    button: { backgroundColor: "#4972c3ff", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
    cancelButton: { backgroundColor: "#7e91b9ff" },
    disabledButton: { backgroundColor: "#ccc" },
    buttonText: { color: "white", fontWeight: "bold", fontSize: 14 },
});

export default CareerForm;