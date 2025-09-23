import { Education } from "@/schemas/resume";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EducationCardProps {
  education: Education;
  onEdit: () => void;
  onDelete: () => void;
}

const EducationCard: React.FC<EducationCardProps> = ({
  education,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const admissionDate = education.admission_date.substring(0, 7);
  const graduationDate = education.graduation_date
    ? education.graduation_date.substring(0, 7)
    : t(`resume.education.status_options.${education.status}`);

  const showMajorAndDegree = ![
    "elementary_school",
    "middle_school",
    "high_school",
  ].includes(education.school_type);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.school}>
          {education.school_name} (
          {t(`resume.education.school_type_options.${education.school_type}`)})
        </Text>
        {showMajorAndDegree && (
          <Text style={styles.major}>
            {education.major}{" "}
            {education.degree &&
              `(${t(`resume.education.degree_options.${education.degree}`)})`}
          </Text>
        )}
        <Text style={styles.date}>
          {admissionDate} - {graduationDate}
        </Text>
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
  school: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  major: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
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

export default EducationCard;