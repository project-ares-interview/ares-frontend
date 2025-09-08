import { Education } from "@/schemas/resume";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
  school: {
    fontSize: 16,
    fontWeight: "bold",
  },
  major: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  courses: {
    fontSize: 14,
    color: "#333",
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

export default EducationCard;
