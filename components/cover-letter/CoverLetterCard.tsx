import { CoverLetter } from "@/schemas/coverLetter";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
    <View style={styles.card}>
      <Pressable onPress={onSelect} style={styles.contentContainer}>
        <Text style={styles.title}>{coverLetter.title}</Text>
        <Text style={styles.content} numberOfLines={2}>
          {coverLetter.content}
        </Text>
        <Text style={styles.date}>
          {t("cover_letter.created_date")}:{" "}
          {new Date(coverLetter.created_at).toLocaleDateString()}
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
  content: {
    fontSize: 14,
    color: "#666",
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

export default CoverLetterCard;
