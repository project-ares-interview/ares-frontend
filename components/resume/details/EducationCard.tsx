import { Education, SchoolType } from "@/schemas/resume";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

const schoolTypeMap: Record<SchoolType, string> = {
  elementary_school: "초등학교",
  middle_school: "중학교",
  high_school: "고등학교",
  junior_college: "대학교 (2-3년제)",
  university: "대학교 (4년제)",
};


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
    : "진행중";

  const showMajorAndDegree = ![
    "elementary_school",
    "middle_school",
    "high_school",
  ].includes(education.school_type);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.school}>
          {education.school_name}
        </Text>
        {showMajorAndDegree && (
          <Text style={styles.major}>
            {education.major} {education.degree && `(${t(`profile.education.degree_options.${education.degree}`)})`}
          </Text>
        )}
        <Text style={styles.date}>
          {admissionDate} - {graduationDate}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.editButton]} onPress={onEdit}>
          <Text style={styles.buttonText}>수정</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={styles.buttonText}>삭제</Text>
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
