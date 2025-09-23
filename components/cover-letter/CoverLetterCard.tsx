import { CoverLetter } from "@/schemas/coverLetter";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CoverLetterCardProps {
  coverLetter: CoverLetter;
  onSelect: () => void;
  onDelete: () => void;
}

const CoverLetterCard: React.FC<CoverLetterCardProps> = ({
  coverLetter,
  onSelect,
  onDelete,
}) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity onPress={onSelect} style={styles.eventItem}>
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventSummary}>{coverLetter.title}</Text>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>{t("common.delete")}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {coverLetter.content}
        </Text>

        <Text style={styles.eventTime}>
          {t("cover_letter.created_date")}:{" "}
          {new Date(coverLetter.created_at).toLocaleDateString()}
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
    flex: 1,
  },
  eventDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 10,
  },
  eventTime: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#7e91b9ff ",
    padding: 8,
    borderRadius: 10,
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

export default CoverLetterCard;
