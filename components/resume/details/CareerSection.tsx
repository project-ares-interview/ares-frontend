import { Career, CareerCreate, CareerUpdate } from "@/schemas/resume";
import { resumeService } from "@/services/resumeService";
import { useResumeStore } from "@/stores/resumeStore";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { showConfirmation } from "../../../utils/alert";
import CareerCard from "./CareerCard";
import CareerForm from "./CareerForm";

interface CareerSectionProps {
  resumeId: number;
  careers: Career[];
}

const CareerSection: React.FC<CareerSectionProps> = ({
  resumeId,
  careers,
}) => {
  const { t } = useTranslation();
  const { fetchFullResume } = useResumeStore();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);

  const handleSave = async (data: CareerCreate | CareerUpdate) => {
    try {
      if (editingCareer) {
        await resumeService.careers.update(resumeId, editingCareer.id, data);
      } else {
        await resumeService.careers.create(resumeId, data as CareerCreate);
      }
      await fetchFullResume(resumeId); // Refresh data
      setIsFormVisible(false);
      setEditingCareer(null);
    } catch (error) {
      console.error("Failed to save career:", error);
      // TODO: Show error to user
    }
  };

  const handleDelete = async (id: number) => {
    const onConfirmDelete = async () => {
      try {
        await resumeService.careers.delete(resumeId, id);
        await fetchFullResume(resumeId); // Refresh data
      } catch (error) {
        console.error("Failed to delete career:", error);
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
    setEditingCareer(null);
    setIsFormVisible(true);
  };

  const handleEdit = (career: Career) => {
    setEditingCareer(career);
    setIsFormVisible(true);
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{t("resume.career.section_title")}</Text>
        <Pressable style={styles.addButton} onPress={handleAddNew}>
          <Icon name="add" color="white" style={{ pointerEvents: "none" }} />
        </Pressable>
      </View>

      {careers.length > 0 ? (
        careers.map((career) => (
          <CareerCard
            key={career.id}
            career={career}
            onEdit={() => handleEdit(career)}
            onDelete={() => handleDelete(career.id)}
          />
        ))
      ) : (
        !isFormVisible && <Text>{t("resume.career.no_data")}</Text>
      )}

      {isFormVisible && (
        <CareerForm
          initialData={editingCareer}
          onSubmit={handleSave}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingCareer(null);
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

export default CareerSection;
