import ResumeCard from "@/components/resume/ResumeCard";
import { useResumeStore } from "@/stores/resumeStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
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
    <ScrollView style={styles.outerContainer}>
      <View style={styles.mainContentContainer}>
        <Text style={styles.header}>{t("resume.list.page_title")}</Text>

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 이력서 작성 꿀팁!</Text>
          <Text style={styles.tipText}>
            이력서를 관리하고 가상면접 전에 미리 이력서 첨삭을 받아보세요!✨{" "}
            {"\n"} - 지원하는 직무와 관련된 경험과 성과를 강조하세요.{"\n"}-
            성과는 정량적인 수치(예: 매출 20% 증가, 5개 프로젝트 완료)로 표현하면
            좋습니다.{"\n"}- 최신 정보로 항상 업데이트하고, 오탈자가 없는지 꼼꼼히
            확인하세요.
          </Text>
        </View>

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
          <View style={styles.actionButtonsContainer}>
            <Pressable
              style={styles.addButton}
              onPress={() => setIsCreating(true)}
            >
              <Text style={styles.addButtonText}>
                {t("resume.list.add_button")}
              </Text>
            </Pressable>
            <Link href="/resume-analysis" asChild>
              <Pressable style={{ ...styles.addButton, ...styles.aiButton }}>
                <FontAwesome5
                  name="magic"
                  size={16}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.addButtonText}>AI 이력서 분석</Text>
              </Pressable>
            </Link>
          </View>
        )}

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>{t("resume.list.my_resumes")}</Text>

        {resumes.length > 0 ? (
          resumes.map((item) => (
            <ResumeCard
              key={item.id}
              resume={item}
              onSelect={() => router.push(`/(protected)/resumes/${item.id}`)}
              onDelete={() => handleDelete(item.id)}
            />
          ))
        ) : (
          !isLoading &&
          !isCreating && (
            <Text style={styles.emptyText}>{t("resume.list.no_data")}</Text>
          )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mainContentContainer: {
    width: "70%",
    maxWidth: 1280,
    alignSelf: "center",
    paddingVertical: 20,
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
    marginBottom: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  tipBox: {
    backgroundColor: "#eef7ff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4972c3ff",
  },
  tipTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  tipText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#4972c3ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 8,
  },
  aiButton: {
    backgroundColor: "#7e91b9ff",
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
    color: "#555",
  },
  createForm: {
    padding: 16,
    backgroundColor: "white",
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
    backgroundColor: "#4972c3ff",
  },
  cancelButton: {
    backgroundColor: "#7e91b9ff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#101828",
  },
});

export default ResumesPage;
