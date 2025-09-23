import {
  Education,
  EducationCreate,
  EducationUpdate,
} from "@/schemas/resume";
import { resumeService } from "@/services/resumeService";
import { useResumeStore } from "@/stores/resumeStore";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { showConfirmation } from "../../../utils/alert";
import EducationCard from "./EducationCard";
import EducationForm from "./EducationForm";

interface EducationSectionProps {
  resumeId: number;
  educations: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({
  resumeId,
  educations,
}) => {
  const { t } = useTranslation();
  const { fetchFullResume } = useResumeStore();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );

  const handleSave = async (data: EducationCreate | EducationUpdate) => {
    try {
      if (editingEducation) {
        await resumeService.educations.update(
          resumeId,
          editingEducation.id,
          data
        );
      } else {
        await resumeService.educations.create(
          resumeId,
          data as EducationCreate
        );
      }
      await fetchFullResume(resumeId);
      setIsFormVisible(false);
      setEditingEducation(null);
    } catch (error) {
      console.error("Failed to save education:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const onConfirmDelete = async () => {
      try {
        await resumeService.educations.delete(resumeId, id);
        await fetchFullResume(resumeId);
      } catch (error) {
        console.error("Failed to delete education:", error);
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
    setEditingEducation(null);
    setIsFormVisible(true);
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setIsFormVisible(true);
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t("resume.education.section_title")}
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <FontAwesome5 name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {educations.length > 0 && (
        <View style={styles.cardContainer}>
          {educations.map((education) => (
            <EducationCard
              key={education.id}
              education={education}
              onEdit={() => handleEdit(education)}
              onDelete={() => handleDelete(education.id)}
            />
          ))}
        </View>
      )}

      {isFormVisible && (
        <EducationForm
          initialData={editingEducation}
          onSubmit={handleSave}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingEducation(null);
          }}
        />
      )}

      {educations.length === 0 && !isFormVisible && (
        <Text style={styles.noDataText}>{t("resume.education.no_data")}</Text>
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

export default EducationSection;