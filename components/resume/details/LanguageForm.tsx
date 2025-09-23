import { Language, LanguageCreate, LanguageUpdate } from "@/schemas/resume";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

interface LanguageFormProps {
  initialData?: Language | null;
  onSubmit: (data: LanguageCreate | LanguageUpdate) => void;
  onCancel: () => void;
}

const LanguageForm: React.FC<LanguageFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    language: "",
    proficiency: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        language: initialData.language,
        proficiency: initialData.proficiency,
      });
    } else {
      setFormData({ language: "", proficiency: "" });
    }
  }, [initialData]);

  useEffect(() => {
    const { language, proficiency } = formData;
    setIsFormValid(language.trim() !== "" && proficiency.trim() !== "");
  }, [formData]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit(formData);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.formGroup}>
        <FormLabel label={t("resume.language.language")} required />
        <TextInput
          style={styles.input}
          placeholder={t("resume.language.language_placeholder")}
          placeholderTextColor="#aaa"
          value={formData.language}
          onChangeText={(v) => handleChange("language", v)}
        />
      </View>
      <View style={styles.formGroup}>
        <FormLabel label={t("resume.language.proficiency")} required />
        <TextInput
          style={styles.input}
          placeholder={t("resume.language.proficiency_placeholder")}
          placeholderTextColor="#aaa"
          value={formData.proficiency}
          onChangeText={(v) => handleChange("proficiency", v)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>{t("common.cancel")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            !isFormValid && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>{t("common.save")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
    fontWeight: "500",
  },
  requiredAsterisk: {
    color: "#ff4d4f",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  button: {
    backgroundColor: "#4972c3ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#7e91b9ff",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default LanguageForm;