import { Career } from "@/schemas/resume";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
  },
  content: {
    marginBottom: 8,
  },
  company: {
    fontSize: 16,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
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
  responsibilities: {
    fontSize: 14,
    color: "#333",
  },
  reason: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 8,
    marginTop: 8,
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

export default CareerCard;
