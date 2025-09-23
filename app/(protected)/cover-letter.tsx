import CoverLetterCard from "@/components/cover-letter/CoverLetterCard";
import CoverLetterForm from "@/components/cover-letter/CoverLetterForm";
import { CoverLetterCreate } from "@/schemas/coverLetter";
import { useCoverLetterStore } from "@/stores/coverLetterStore";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { showConfirmation } from "../../utils/alert";

const CoverLetterPage = () => {
  const { t } = useTranslation();
  const {
    coverLetters,
    selectedCoverLetter,
    isLoading,
    error,
    fetchCoverLetters,
    createCoverLetter,
    updateCoverLetter,
    deleteCoverLetter,
    selectCoverLetter,
    clearSelectedCoverLetter,
  } = useCoverLetterStore();

  useEffect(() => {
    fetchCoverLetters();
  }, [fetchCoverLetters]);

  const handleFormSubmit = async (data: CoverLetterCreate) => {
    if (selectedCoverLetter && selectedCoverLetter.id) {
      await updateCoverLetter(selectedCoverLetter.id, data);
    } else {
      await createCoverLetter(data);
    }
    clearSelectedCoverLetter();
  };

  const handleAddNew = () => {
    selectCoverLetter({
      id: 0,
      user: 0,
      title: "",
      content: "",
      created_at: "",
    });
  };

  const handleDelete = (id: number) => {
    showConfirmation({
      title: t("cover_letter.delete_confirm.title"),
      message: t("cover_letter.delete_confirm.message"),
      onConfirm: () => deleteCoverLetter(id),
      confirmText: t("common.delete"),
      cancelText: t("common.cancel"),
    });
  };

  if (isLoading && coverLetters.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>{t("cover_letter.loading")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.outerContainer}>
      <View style={styles.mainContentContainer}>
        <Text style={styles.title}>{t("cover_letter.page_title")}</Text>

        {selectedCoverLetter ? (
          <CoverLetterForm
            onSubmit={handleFormSubmit}
            onCancel={clearSelectedCoverLetter}
            initialData={selectedCoverLetter.id ? selectedCoverLetter : undefined}
            isLoading={isLoading}
          />
        ) : (
          <>
            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>💡 자기소개서 작성 꿀팁!</Text>
              <Text style={styles.tipText}>
                {
                  "자기소개서 관리가 힘들 떄 회사별/직무별로 자기소개서를 관리해보세요!✨\n-회사와 직무에 맞는 지원 동기를 구체적으로 연결하세요.\n-경험은 상황 → 행동 → 결과(STAR) 구조로 스토리처럼 풀어내세요.\n-강점은 성과와 수치로 증명하고, 마지막은 포부로 마무리하세요."
                }
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAddNew}>
              <Text style={styles.buttonText}>
                {t("cover_letter.add_button")}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>
              {t("cover_letter.my_letters")}
            </Text>

            {isLoading && coverLetters.length > 0 && <ActivityIndicator />}

            {coverLetters.length > 0
              ? coverLetters.map((item) => (
                  <CoverLetterCard
                    key={item.id}
                    coverLetter={item}
                    onSelect={() => selectCoverLetter(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))
              : !isLoading && (
                  <Text style={styles.emptyText}>
                    {t("cover_letter.no_data")}
                  </Text>
                )}
          </>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Add some bottom padding
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
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
    marginBottom: 20,
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
    lineHeight: 22, // Adjusted for better readability
  },
  button: {
    backgroundColor: "#4972c3ff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default CoverLetterPage;
