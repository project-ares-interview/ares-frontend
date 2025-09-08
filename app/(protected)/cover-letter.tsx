import CoverLetterCard from "@/components/cover-letter/CoverLetterCard";
import CoverLetterForm from "@/components/cover-letter/CoverLetterForm";
import { CoverLetterCreate } from "@/schemas/coverLetter";
import { useCoverLetterStore } from "@/stores/coverLetterStore";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
    deleteCoverLetter(id);
  };

  if (isLoading && coverLetters.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t("cover_letter.page_title")}</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      {selectedCoverLetter ? (
        <CoverLetterForm
          onSubmit={handleFormSubmit}
          onCancel={clearSelectedCoverLetter}
          initialData={selectedCoverLetter.id ? selectedCoverLetter : undefined}
          isLoading={isLoading}
        />
      ) : (
        <>
          <Pressable style={styles.addButton} onPress={handleAddNew}>
            <Text style={styles.addButtonText}>
              {t("cover_letter.add_button")}
            </Text>
          </Pressable>
          <FlatList
            data={coverLetters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CoverLetterCard
                coverLetter={item}
                onSelect={() => selectCoverLetter(item)}
                onDelete={() => handleDelete(item.id)}
              />
            )}
            ListEmptyComponent={
              !isLoading ? (
                <Text style={styles.emptyText}>
                  {t("cover_letter.no_data")}
                </Text>
              ) : null
            }
          />
        </>
      )}
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
});

export default CoverLetterPage;
