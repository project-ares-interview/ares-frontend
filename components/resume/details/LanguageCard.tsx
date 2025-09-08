import { Language } from "@/schemas/resume";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface LanguageCardProps {
  language: Language;
  onEdit: () => void;
  onDelete: () => void;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.language}>{language.language}</Text>
        <Text style={styles.proficiency}>{language.proficiency}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.editButton]} onPress={onEdit}>
          <Text style={styles.buttonText}>{t("common.edit")}</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={styles.buttonText}>{t("common.delete")}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  language: {
    fontSize: 16,
    fontWeight: "bold",
  },
  proficiency: {
    fontSize: 14,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#007bff",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LanguageCard;
