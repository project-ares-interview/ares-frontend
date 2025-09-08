import { Link, LinkCreate, LinkUpdate } from "@/schemas/resume";
import { resumeService } from "@/services/resumeService";
import { useResumeStore } from "@/stores/resumeStore";
import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
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
              await resumeService.links.delete(resumeId, id);
              await fetchFullResume(resumeId);
            } catch (error) {
              console.error("Failed to delete link:", error);
            }
          },
        },
      ],
    );
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
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{t("resume.link.section_title")}</Text>
        <Pressable style={styles.addButton} onPress={handleAddNew}>
          <Icon name="add" color="white" style={{ pointerEvents: "none" }} />
        </Pressable>
      </View>

      {links.length > 0 ? (
        links.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            onEdit={() => handleEdit(link)}
            onDelete={() => handleDelete(link.id)}
          />
        ))
      ) : (
        !isFormVisible && <Text>{t("resume.link.no_data")}</Text>
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

export default LinkSection;
