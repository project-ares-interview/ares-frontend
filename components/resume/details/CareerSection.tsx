import { Career, CareerCreate, CareerUpdate } from "@/schemas/resume";
import { resumeService } from "@/services/resumeService";
import { useResumeStore } from "@/stores/resumeStore";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("resume.career.section_title")}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <FontAwesome5 name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {careers.length > 0 && (
        <View style={styles.cardContainer}>
          {careers.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
              onEdit={() => handleEdit(career)}
              onDelete={() => handleDelete(career.id)}
            />
          ))}
        </View>
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

      {careers.length === 0 && !isFormVisible && (
        <Text style={styles.noDataText}>{t("resume.career.no_data")}</Text>
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

export default CareerSection;