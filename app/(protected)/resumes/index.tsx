import ResumeCard from "@/components/resume/ResumeCard";
import { useResumeStore } from "@/stores/resumeStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { showConfirmation } from "../../../utils/alert";

const ResumesPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    resumes,
    isLoading,
    error,
    fetchResumes,
    createResume,
    deleteResume,
  } = useResumeStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState("");

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreate = async () => {
    const newResume = await createResume({ title: newResumeTitle });
    if (newResume) {
      router.push(`/(protected)/resumes/${newResume.id}`);
    }
    setIsCreating(false);
    setNewResumeTitle("");
  };

  const handleDelete = (id: number) => {
    showConfirmation({
      title: t("resume.list.delete_confirm.title"),
      message: t("resume.list.delete_confirm.message"),
      onConfirm: () => deleteResume(id),
      confirmText: t("common.delete"),
      cancelText: t("common.cancel"),
    });
  };

  if (isLoading && resumes.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t("resume.list.page_title")}</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      {isCreating ? (
        <View style={styles.createForm}>
          <TextInput
            style={styles.input}
            placeholder={t("resume.list.new_title_placeholder")}
            placeholderTextColor="#aaa"
            value={newResumeTitle}
            onChangeText={setNewResumeTitle}
          />
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsCreating(false)}
            >
              <Text style={styles.buttonText}>{t("common.cancel")}</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.createButton]}
              onPress={handleCreate}
            >
              <Text style={styles.buttonText}>{t("common.create")}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable style={styles.addButton} onPress={() => setIsCreating(true)}>
          <Text style={styles.addButtonText}>
            {t("resume.list.add_button")}
          </Text>
        </Pressable>
      )}

      <FlatList
        data={resumes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ResumeCard
            resume={item}
            onSelect={() => router.push(`/(protected)/resumes/${item.id}`)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          !isLoading && !isCreating ? (
            <Text style={styles.emptyText}>{t("resume.list.no_data")}</Text>
          ) : null
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  createForm: {
    padding: 16,
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
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
  createButton: {
    backgroundColor: "#28a745",
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

export default ResumesPage;
