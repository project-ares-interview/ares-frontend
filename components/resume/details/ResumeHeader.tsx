import { Resume } from "@/schemas/resume";
import { useResumeStore } from "@/stores/resumeStore";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

interface ResumeHeaderProps {
  resume: Resume;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ resume }) => {
  const { t } = useTranslation();
  const { updateResume } = useResumeStore();
  const [title, setTitle] = useState(resume.title);

  useEffect(() => {
    setTitle(resume.title);
  }, [resume.title]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (title.trim() && title !== resume.title) {
        updateResume(resume.id, { title });
      }
    }, 500); // 500ms after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [title, resume.id, resume.title, updateResume]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={t("resume.list.title_placeholder")}
        placeholderTextColor="#aaa"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  input: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ResumeHeader;