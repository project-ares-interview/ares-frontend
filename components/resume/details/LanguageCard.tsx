import { Language } from "@/schemas/resume";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        <TouchableOpacity style={styles.button} onPress={onEdit}>
          <FontAwesome5 name="pen" size={14} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
        >
          <FontAwesome5 name="trash" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#4972c3ff",
  },
  content: {
    flex: 1,
  },
  language: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  proficiency: {
    fontSize: 14,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4972c3ff",
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: "#7e91b9ff",
  },
});

export default LanguageCard;