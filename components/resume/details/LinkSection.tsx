import { Link, LinkCreate, LinkUpdate } from "@/schemas/resume";
import { resumeService } from "@/services/resumeService";
import { useResumeStore } from "@/stores/resumeStore";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { showConfirmation } from "../../../utils/alert";
import LinkCard from "./LinkCard";
import LinkForm from "./LinkForm";

interface LinkSectionProps {
  resumeId: number;
  links: Link[];
}

const LinkSection: React.FC<LinkSectionProps> = ({ resumeId, links }) => {
  const { t } = useTranslation();
  const { fetchFullResume } = useResumeStore();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const handleSave = async (data: LinkCreate | LinkUpdate) => {
    try {
      if (editingLink) {
        await resumeService.links.update(resumeId, editingLink.id, data);
      } else {
        await resumeService.links.create(resumeId, data as LinkCreate);
      }
      await fetchFullResume(resumeId);
      setIsFormVisible(false);
      setEditingLink(null);
    } catch (error) {
      console.error("Failed to save link:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const onConfirmDelete = async () => {
      try {
        await resumeService.links.delete(resumeId, id);
        await fetchFullResume(resumeId);
      } catch (error) {
        console.error("Failed to delete link:", error);
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
    setEditingLink(null);
    setIsFormVisible(true);
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setIsFormVisible(true);
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("resume.link.section_title")}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <FontAwesome5 name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {links.length > 0 && (
        <View style={styles.cardContainer}>
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={() => handleEdit(link)}
              onDelete={() => handleDelete(link.id)}
            />
          ))}
        </View>
      )}

      {isFormVisible && (
        <LinkForm
          initialData={editingLink}
          onSubmit={handleSave}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingLink(null);
          }}
        />
      )}

      {links.length === 0 && !isFormVisible && (
        <Text style={styles.noDataText}>{t("resume.link.no_data")}</Text>
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

export default LinkSection;