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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
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
                "👉 자신에게 맞는 직무의 자기소개서를 작성할 시에 가상면접에 도움이 됩니다! 만약, 작성하고 싶지 않다면 안하셔도 가상면접은 실행됩니다.\n정확도를 올리고 싶다면 자기소개서를 적어주세요✍️\n\n1. 지원 동기 명확히\n회사·직무와 내 경험을 연결해 구체적으로 작성\n\n2. 스토리 구조 활용\n상황 → 행동 → 결과 (STAR 기법)로 풀어내기\n\n3. 성과는 수치로\n구체적 수치·결과를 넣어 신뢰도 높이기\n\n4. 직무와 연결\n강점이 해당 직무에 어떻게 쓰이는지 강조\n\n5. 차별화 포인트\n나만의 경험·배경으로 개성을 드러내기\n\n6. 간결하고 읽기 쉽게\n짧은 문장, 핵심만 담아 가독성 높이기\n\n7. 포부로 마무리\n회사와 함께 성장할 의지를 보여주기"
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
