import { Career, CareerCreate, CareerUpdate } from "@/schemas/resume";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
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
    {required && <Text style={styles.asterisk}>*</Text>}
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
    }
  }, [initialData]);

  useEffect(() => {
    const {
      company_name,
      department,
      start_date,
      end_date,
      is_current,
      responsibilities,
    } = formData;
    const requiredFieldsFilled =
      company_name.trim() !== "" &&
      department.trim() !== "" &&
      responsibilities.trim() !== "" &&
      start_date.trim() !== "";
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
      reason_for_leaving: formData.is_current
        ? null
        : formData.reason_for_leaving || null,
    };
    onSubmit(dataToSubmit);
  };

  const experienceTypeOptions = [
    {
      label: t("resume.career.experience_type_options.newcomer"),
      value: "newcomer",
    },
    {
      label: t("resume.career.experience_type_options.experienced"),
      value: "experienced",
    },
  ];

  return (
    <View style={styles.form}>
      <FormLabel label={t("resume.career.experience_type")} required />
      <Picker
        selectedValue={formData.experience_type}
        onValueChange={(v) => handleChange("experience_type", v)}
        style={styles.picker}
      >
        {experienceTypeOptions.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>

      <FormLabel label={t("resume.career.company_name")} required />
      <TextInput
        style={styles.input}
        placeholder={t("resume.career.company_name_placeholder")}
        placeholderTextColor="#aaa"
        value={formData.company_name}
        onChangeText={(v) => handleChange("company_name", v)}
      />
      <FormLabel label={t("resume.career.department")} required />
      <TextInput
        style={styles.input}
        placeholder={t("resume.career.department_placeholder")}
        placeholderTextColor="#aaa"
        value={formData.department}
        onChangeText={(v) => handleChange("department", v)}
      />
      <FormLabel label={t("resume.career.responsibilities")} required />
      <TextInput
        style={styles.input}
        placeholder={t("resume.career.responsibilities_placeholder")}
        placeholderTextColor="#aaa"
        value={formData.responsibilities}
        onChangeText={(v) => handleChange("responsibilities", v)}
      />
      <FormLabel label={t("resume.career.task")} />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder={t("resume.career.task_placeholder")}
        placeholderTextColor="#aaa"
        value={formData.task}
        onChangeText={(v) => handleChange("task", v)}
        multiline
      />
      <View style={styles.switchContainer}>
        <Text>{t("resume.career.is_current")}</Text>
        <Switch
          value={formData.is_current}
          onValueChange={(v) => handleChange("is_current", v)}
        />
      </View>
      <DatePicker
        label={t("resume.career.start_date")}
        date={formData.start_date}
        onDateChange={(v) => handleChange("start_date", v)}
        required
      />
      {!formData.is_current && (
        <>
          <DatePicker
            label={t("resume.career.end_date")}
            date={formData.end_date}
            onDateChange={(v) => handleChange("end_date", v)}
            required
          />
          <FormLabel label={t("resume.career.reason_for_leaving")} />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t("resume.career.reason_for_leaving_placeholder")}
            placeholderTextColor="#aaa"
            value={formData.reason_for_leaving}
            onChangeText={(v) => handleChange("reason_for_leaving", v)}
            multiline
          />
        </>
      )}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>{t("common.cancel")}</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            styles.saveButton,
            !isFormValid && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>{t("common.save")}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  asterisk: {
    color: "red",
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 10,
    padding: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  disabledButton: {
    backgroundColor: "#a1a1a1",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CareerForm;
