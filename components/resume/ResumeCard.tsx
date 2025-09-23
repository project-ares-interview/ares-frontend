import { Resume } from "@/schemas/resume";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <TouchableOpacity onPress={onSelect} style={styles.eventItem}>
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventSummary}>{resume.title}</Text>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>{t("common.delete")}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.eventTime}>
          {t("resume.list.last_updated")}:{" "}
          {new Date(resume.updated_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16, // Keep horizontal margin for list consistency
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#4972c3ff",
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventSummary: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    flex: 1,
  },
  eventTime: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#4972c3ff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ResumeCard;