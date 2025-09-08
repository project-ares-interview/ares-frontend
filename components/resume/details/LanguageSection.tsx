import { Language, LanguageCreate, LanguageUpdate } from "@/schemas/resume";
import { resumeService } from "@/services/resumeService";
import { useResumeStore } from "@/stores/resumeStore";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
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
          data,
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
    Alert.alert(
      t("resume.delete_confirm.title"),
      t("resume.delete_confirm.message"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await resumeService.languages.delete(resumeId, id);
              await fetchFullResume(resumeId);
            } catch (error) {
              console.error("Failed to delete language:", error);
            }
          },
        },
      ],
    );
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
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>
          {t("resume.language.section_title")}
        </Text>
        <Pressable style={styles.addButton} onPress={handleAddNew}>
          <Icon name="add" color="white" style={{ pointerEvents: "none" }} />
        </Pressable>
      </View>

      {languages.length > 0 ? (
        languages.map((language) => (
          <LanguageCard
            key={language.id}
            language={language}
            onEdit={() => handleEdit(language)}
            onDelete={() => handleDelete(language.id)}
          />
        ))
      ) : (
        !isFormVisible && <Text>{t("resume.language.no_data")}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007bff",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
});

export default LanguageSection;
