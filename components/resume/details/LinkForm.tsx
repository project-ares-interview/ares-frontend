import { Link, LinkCreate, LinkUpdate } from "@/schemas/resume";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

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
    <View style={styles.form}>
      <FormLabel label={t("resume.link.title")} required />
      <TextInput
        style={styles.input}
        placeholder={t("resume.link.title_placeholder")}
        placeholderTextColor="#aaa"
        value={formData.title}
        onChangeText={(v) => handleChange("title", v)}
      />
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

export default LinkForm;
