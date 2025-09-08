import { CoverLetter, CoverLetterCreate } from "@/schemas/coverLetter";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
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
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({ title, content });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("cover_letter.form.title")}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={t("cover_letter.form.title_placeholder")}
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>{t("cover_letter.form.content")}</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={setContent}
        placeholder={t("cover_letter.form.content_placeholder")}
        placeholderTextColor="#aaa"
        multiline
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading
              ? t("cover_letter.form.saving")
              : t("common.save")}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{t("common.cancel")}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#007bff",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CoverLetterForm;
