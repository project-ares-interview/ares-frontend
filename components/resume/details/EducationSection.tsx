import {
  Education,
  EducationCreate,
  EducationUpdate,
} from "@/schemas/resume";
import { resumeService } from "@/services/resumeService";
import { useResumeStore } from "@/stores/resumeStore";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
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
    null,
  );

  const handleSave = async (data: EducationCreate | EducationUpdate) => {
    try {
      if (editingEducation) {
        await resumeService.educations.update(
          resumeId,
          editingEducation.id,
          data,
        );
      } else {
        await resumeService.educations.create(
          resumeId,
          data as EducationCreate,
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
              await resumeService.educations.delete(resumeId, id);
              await fetchFullResume(resumeId);
            } catch (error) {
              console.error("Failed to delete education:", error);
            }
          },
        },
      ],
    );
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
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>
          {t("resume.education.section_title")}
        </Text>
        <Pressable style={styles.addButton} onPress={handleAddNew}>
          <Icon name="add" color="white" style={{ pointerEvents: "none" }} />
        </Pressable>
      </View>

      {educations.length > 0 ? (
        educations.map((education) => (
          <EducationCard
            key={education.id}
            education={education}
            onEdit={() => handleEdit(education)}
            onDelete={() => handleDelete(education.id)}
          />
        ))
      ) : (
        !isFormVisible && <Text>{t("resume.education.no_data")}</Text>
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

export default EducationSection;
