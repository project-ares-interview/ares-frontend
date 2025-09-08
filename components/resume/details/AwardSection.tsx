import { Award, AwardCreate, AwardUpdate } from "@/schemas/resume";
import { resumeService } from "@/services/resumeService";
import { useResumeStore } from "@/stores/resumeStore";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{t("resume.award.section_title")}</Text>
        <Pressable style={styles.addButton} onPress={handleAddNew}>
          <Icon name="add" color="white" style={{ pointerEvents: "none" }} />
        </Pressable>
      </View>

      {awards.length > 0 ? (
        awards.map((award) => (
          <AwardCard
            key={award.id}
            award={award}
            onEdit={() => handleEdit(award)}
            onDelete={() => handleDelete(award.id)}
          />
        ))
      ) : (
        !isFormVisible && <Text>{t("resume.award.no_data")}</Text>
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

export default AwardSection;
