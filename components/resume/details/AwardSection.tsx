import { Award, AwardCreate, AwardUpdate } from "@/schemas/resume";
import { resumeService } from "@/services/resumeService";
import { useResumeStore } from "@/stores/resumeStore";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { showConfirmation } from "../../../utils/alert";
import AwardCard from "./AwardCard";
import AwardForm from "./AwardForm";

interface AwardSectionProps {
  resumeId: number;
  awards: Award[];
}

const AwardSection: React.FC<AwardSectionProps> = ({ resumeId, awards }) => {
  const { t } = useTranslation();
  const { fetchFullResume } = useResumeStore();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);

  const handleSave = async (data: AwardCreate | AwardUpdate) => {
    try {
      if (editingAward) {
        await resumeService.awards.update(resumeId, editingAward.id, data);
      } else {
        await resumeService.awards.create(resumeId, data as AwardCreate);
      }
      await fetchFullResume(resumeId);
      setIsFormVisible(false);
      setEditingAward(null);
    } catch (error) {
      console.error("Failed to save award:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const onConfirmDelete = async () => {
      try {
        await resumeService.awards.delete(resumeId, id);
        await fetchFullResume(resumeId);
      } catch (error) {
        console.error("Failed to delete award:", error);
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
    setEditingAward(null);
    setIsFormVisible(true);
  };

  const handleEdit = (award: Award) => {
    setEditingAward(award);
    setIsFormVisible(true);
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("resume.award.section_title")}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <FontAwesome5 name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {awards.length > 0 && (
        <View style={styles.cardContainer}>
          {awards.map((award) => (
            <AwardCard
              key={award.id}
              award={award}
              onEdit={() => handleEdit(award)}
              onDelete={() => handleDelete(award.id)}
            />
          ))}
        </View>
      )}

      {isFormVisible && (
        <AwardForm
          initialData={editingAward}
          onSubmit={handleSave}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingAward(null);
          }}
        />
      )}

      {awards.length === 0 && !isFormVisible && (
        <Text style={styles.noDataText}>{t("resume.award.no_data")}</Text>
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

export default AwardSection;