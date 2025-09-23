import { Award, AwardCreate, AwardUpdate } from "@/schemas/resume";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
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

interface AwardFormProps {
  initialData?: Award | null;
  onSubmit: (data: AwardCreate | AwardUpdate) => void;
  onCancel: () => void;
}

const AwardForm: React.FC<AwardFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date_awarded: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        issuer: initialData.issuer,
        date_awarded: initialData.date_awarded,
      });
    } else {
      setFormData({ title: "", issuer: "", date_awarded: "" });
    }
  }, [initialData]);

  useEffect(() => {
    const { title, issuer, date_awarded } = formData;
    setIsFormValid(
      title.trim() !== "" &&
        issuer.trim() !== "" &&
        date_awarded.trim() !== ""
    );
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
        <FormLabel label={t("resume.award.title")} required />
        <TextInput
          style={styles.input}
          placeholder={t("resume.award.title_placeholder")}
          placeholderTextColor="#aaa"
          value={formData.title}
          onChangeText={(v) => handleChange("title", v)}
        />
      </View>
      <View style={styles.formGroup}>
        <FormLabel label={t("resume.award.issuer")} required />
        <TextInput
          style={styles.input}
          placeholder={t("resume.award.issuer_placeholder")}
          placeholderTextColor="#aaa"
          value={formData.issuer}
          onChangeText={(v) => handleChange("issuer", v)}
        />
      </View>
      <View style={styles.formGroup}>
        <DatePicker
          label={t("resume.award.date_awarded")}
          date={formData.date_awarded}
          onDateChange={(v) => handleChange("date_awarded", v)}
          required
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

export default AwardForm;