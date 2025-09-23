import { CoverLetter, CoverLetterCreate } from "@/schemas/coverLetter";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CoverLetterFormProps {
  onSubmit: (data: CoverLetterCreate) => void;
  onCancel: () => void;
  initialData?: CoverLetter;
  isLoading: boolean;
}

const CoverLetterForm: React.FC<CoverLetterFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({ title, content });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {initialData?.id
          ? t("cover_letter.form.edit_title")
          : t("cover_letter.form.new_title")}
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("cover_letter.form.title")}</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={t("cover_letter.form.title_placeholder")}
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("cover_letter.form.content")}</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={content}
          onChangeText={setContent}
          placeholder={t("cover_letter.form.content_placeholder")}
          placeholderTextColor="#aaa"
          multiline
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{t("common.cancel")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t("common.save")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "#f9f9f9", // Slightly different background for the form
    padding: 20,
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "left",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
    backgroundColor: "white",
  },
  textarea: {
    height: 250,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  button: {
    backgroundColor: "#4972c3ff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#7e91b9ff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default CoverLetterForm;
