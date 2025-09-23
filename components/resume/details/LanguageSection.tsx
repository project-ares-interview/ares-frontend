import { Language, LanguageCreate, LanguageUpdate } from "@/schemas/resume";
import { resumeService } from "@/services/resumeService";
import { useResumeStore } from "@/stores/resumeStore";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { showConfirmation } from "../../../utils/alert";
import LanguageCard from "./LanguageCard";
import LanguageForm from "./LanguageForm";

interface LanguageSectionProps {
  resumeId: number;
  languages: Language[];
}

const LanguageSection: React.FC<LanguageSectionProps> = ({
  resumeId,
  languages,
}) => {
  const { t } = useTranslation();
  const { fetchFullResume } = useResumeStore();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);

  const handleSave = async (data: LanguageCreate | LanguageUpdate) => {
    try {
      if (editingLanguage) {
        await resumeService.languages.update(
          resumeId,
          editingLanguage.id,
          data
        );
      } else {
        await resumeService.languages.create(resumeId, data as LanguageCreate);
      }
      await fetchFullResume(resumeId);
      setIsFormVisible(false);
      setEditingLanguage(null);
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const onConfirmDelete = async () => {
      try {
        await resumeService.languages.delete(resumeId, id);
        await fetchFullResume(resumeId);
      } catch (error) {
        console.error("Failed to delete language:", error);
      }
    };

    showConfirmation({
      title: t("resume.delete_confirm.title"),
      message: t("resume.delete_confirm.message"),
      onConfirm: onConfirmDelete,
      confirmText: t("common.delete"),
      cancelText: t("common.cancel"),
    });
  };

  const handleAddNew = () => {
    setEditingLanguage(null);
    setIsFormVisible(true);
  };

  const handleEdit = (language: Language) => {
    setEditingLanguage(language);
    setIsFormVisible(true);
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t("resume.language.section_title")}
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <FontAwesome5 name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {languages.length > 0 && (
        <View style={styles.cardContainer}>
          {languages.map((language) => (
            <LanguageCard
              key={language.id}
              language={language}
              onEdit={() => handleEdit(language)}
              onDelete={() => handleDelete(language.id)}
            />
          ))}
        </View>
      )}

      {isFormVisible && (
        <LanguageForm
          initialData={editingLanguage}
          onSubmit={handleSave}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingLanguage(null);
          }}
        />
      )}

      {languages.length === 0 && !isFormVisible && (
        <Text style={styles.noDataText}>{t("resume.language.no_data")}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#4972c3ff",
    padding: 8,
    borderRadius: 8,
  },
  cardContainer: {
    marginTop: 8,
  },
  noDataText: {
    textAlign: "center",
    color: "#888",
    paddingVertical: 16,
  },
});

export default LanguageSection;