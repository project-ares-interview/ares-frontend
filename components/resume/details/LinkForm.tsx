import { Link, LinkCreate, LinkUpdate } from "@/schemas/resume";
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

interface LinkFormProps {
  initialData?: Link | null;
  onSubmit: (data: LinkCreate | LinkUpdate) => void;
  onCancel: () => void;
}

const LinkForm: React.FC<LinkFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    url: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        url: initialData.url,
      });
    } else {
      setFormData({ title: "", url: "" });
    }
  }, [initialData]);

  useEffect(() => {
    const { title, url } = formData;
    setIsFormValid(title.trim() !== "" && url.trim() !== "");
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
        <FormLabel label={t("resume.link.title")} required />
        <TextInput
          style={styles.input}
          placeholder={t("resume.link.title_placeholder")}
          placeholderTextColor="#aaa"
          value={formData.title}
          onChangeText={(v) => handleChange("title", v)}
        />
      </View>
      <View style={styles.formGroup}>
        <FormLabel label={t("resume.link.url")} required />
        <TextInput
          style={styles.input}
          placeholder={t("resume.link.url_placeholder")}
          placeholderTextColor="#aaa"
          value={formData.url}
          onChangeText={(v) => handleChange("url", v)}
          autoCapitalize="none"
          keyboardType="url"
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

export default LinkForm;