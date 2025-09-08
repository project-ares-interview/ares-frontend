import { Resume } from "@/schemas/resume";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ResumeCardProps {
  resume: Resume;
  onSelect: () => void;
  onDelete: () => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  onSelect,
  onDelete,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <Pressable onPress={onSelect} style={styles.contentContainer}>
        <Text style={styles.title}>{resume.title}</Text>
        <Text style={styles.date}>
          {t("resume.list.last_updated")}:{" "}
          {new Date(resume.updated_at).toLocaleDateString()}
        </Text>
      </Pressable>
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>{t("common.delete")}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    marginLeft: 16,
    padding: 8,
    backgroundColor: "#ff4d4f",
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ResumeCard;
