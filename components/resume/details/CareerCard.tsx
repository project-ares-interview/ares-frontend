import { Career } from "@/schemas/resume";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CareerCardProps {
  career: Career;
  onEdit: () => void;
  onDelete: () => void;
}

const CareerCard: React.FC<CareerCardProps> = ({
  career,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const startDate = career.start_date.substring(0, 10);
  const endDate = career.is_current
    ? t("resume.career.is_current")
    : career.end_date
    ? career.end_date.substring(0, 10)
    : "N/A";

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.company}>
          {career.company_name} (
          {t(`resume.career.experience_type_options.${career.experience_type}`)})
        </Text>
        <Text style={styles.role}>
          {career.department} / {career.responsibilities}
        </Text>
        <Text style={styles.date}>
          {startDate} - {endDate}
        </Text>
        {career.task && <Text style={styles.task}>{career.task}</Text>}
        {!career.is_current && career.reason_for_leaving && (
          <Text style={styles.reason}>
            {t("resume.career.reason_for_leaving")}: {career.reason_for_leaving}
          </Text>
        )}
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
    alignItems: "flex-start",
    borderLeftWidth: 4,
    borderLeftColor: "#4972c3ff",
  },
  content: {
    flex: 1,
  },
  company: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  role: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  task: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  reason: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
    fontStyle: "italic",
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

export default CareerCard;