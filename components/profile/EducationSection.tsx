import { Picker } from "@react-native-picker/picker";
import { Button, Card, Icon, Input, Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Education,
    EducationStatus,
    SchoolType,
} from "../../services/profileService";
import { useProfileStore } from "../../stores/profileStore";

const EducationForm = ({
  education,
  onCancel,
  onSave,
}: {
  education: Partial<Education> | null;
  onCancel: () => void;
  onSave: (data: Omit<Education, "id">) => void;
}) => {
  const { t } = useTranslation();

  const [schoolType, setSchoolType] = useState<SchoolType>(
    education?.school_type ?? "university",
  );
  const [schoolName, setSchoolName] = useState(education?.school_name ?? "");
  const [major, setMajor] = useState(education?.major ?? "");
  const [status, setStatus] = useState<EducationStatus>(
    education?.status ?? "attending",
  );
  const [admissionDate, setAdmissionDate] = useState(
    education?.admission_date ?? "",
  );
  const [graduationDate, setGraduationDate] = useState(
    education?.graduation_date ?? "",
  );

  useEffect(() => {
    if (schoolType === "high_school") {
      setMajor("");
    }
  }, [schoolType]);

  useEffect(() => {
    if (status === "attending") {
      setGraduationDate("");
    }
  }, [status]);

  const schoolTypeOptions: { label: string; value: SchoolType }[] = [
    {
      label: t("profile.education.school_type_options.high_school"),
      value: "high_school",
    },
    {
      label: t("profile.education.school_type_options.junior_college"),
      value: "junior_college",
    },
    {
      label: t("profile.education.school_type_options.university"),
      value: "university",
    },
    {
      label: t("profile.education.school_type_options.master"),
      value: "master",
    },
    {
      label: t("profile.education.school_type_options.doctorate"),
      value: "doctorate",
    },
  ];

  const statusOptions: { label: string; value: EducationStatus }[] = [
    {
      label: t("profile.education.status_options.attending"),
      value: "attending",
    },
    {
      label: t("profile.education.status_options.graduated"),
      value: "graduated",
    },
    {
      label: t("profile.education.status_options.completed"),
      value: "completed",
    },
    {
      label: t("profile.education.status_options.dropout"),
      value: "dropout",
    },
  ];

  const handleSave = () => {
    onSave({
      school_type: schoolType,
      school_name: schoolName,
      major,
      status,
      admission_date: admissionDate,
      graduation_date: graduationDate,
    });
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.pickerLabel}>
        {t("profile.education.school_type")}
      </Text>
      <Picker
        selectedValue={schoolType}
        onValueChange={(itemValue) => setSchoolType(itemValue)}
      >
        {schoolTypeOptions.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>

      <Input
        label={t("profile.education.school_name")}
        value={schoolName}
        onChangeText={setSchoolName}
        containerStyle={styles.inputContainer}
      />
      {schoolType !== "high_school" && (
        <Input
          label={t("profile.education.major")}
          value={major}
          onChangeText={setMajor}
          containerStyle={styles.inputContainer}
        />
      )}

      <Text style={styles.pickerLabel}>{t("profile.education.status")}</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        {statusOptions.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>

      <Input
        label={t("profile.education.admission_date")}
        placeholder="YYYY-MM"
        value={admissionDate}
        onChangeText={setAdmissionDate}
        containerStyle={styles.inputContainer}
      />
      {status !== "attending" && (
        <Input
          label={t("profile.education.graduation_date")}
          placeholder="YYYY-MM"
          value={graduationDate}
          onChangeText={setGraduationDate}
          containerStyle={styles.inputContainer}
        />
      )}

      <View style={styles.formButtonGroup}>
        <Button
          title={t("common.save")}
          onPress={handleSave}
          disabled={!schoolName.trim() || !admissionDate.trim()}
          containerStyle={styles.formButton}
        />
        <Button
          title={t("common.cancel")}
          onPress={onCancel}
          type="outline"
          containerStyle={styles.formButton}
        />
      </View>
    </ScrollView>
  );
};

const EducationSection = () => {
  const { t } = useTranslation();
  const {
    educations,
    createEducation,
    updateEducation,
    deleteEducation,
    loading,
  } = useProfileStore();

  const [editingEducationId, setEditingEducationId] = useState<
    number | "new" | null
  >(null);

  const handleSave = async (data: Omit<Education, "id">) => {
    if (editingEducationId === "new") {
      await createEducation(data);
    } else if (editingEducationId) {
      await updateEducation(editingEducationId, data);
    }
    setEditingEducationId(null);
  };

  const handleDelete = async (id: number) => {
    await deleteEducation(id);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <Card>
      <Card.Title>{t("profile.education.title")}</Card.Title>
      <Card.Divider />
      {educations.map((edu) =>
        editingEducationId === edu.id ? (
          <EducationForm
            key={edu.id}
            education={edu}
            onCancel={() => setEditingEducationId(null)}
            onSave={handleSave}
          />
        ) : (
          <View key={edu.id} style={styles.itemContainer}>
            <View>
              <Text style={styles.itemTextBold}>{edu.school_name}</Text>
              <Text>{edu.major}</Text>
              <Text>
                {edu.admission_date} ~ {edu.graduation_date}
              </Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={() => setEditingEducationId(edu.id)}>
                <Icon name="edit" type="material" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(edu.id)}>
                <Icon name="delete" type="material" color="error" />
              </TouchableOpacity>
            </View>
          </View>
        ),
      )}

      {editingEducationId === "new" ? (
        <EducationForm
          education={null}
          onCancel={() => setEditingEducationId(null)}
          onSave={handleSave}
        />
      ) : (
        <Button
          title={t("profile.education.add_button")}
          onPress={() => setEditingEducationId("new")}
          containerStyle={styles.addButton}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  itemTextBold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 15,
  },
  addButton: {
    marginTop: 16,
  },
  formContainer: {
    paddingVertical: 8,
  },
  inputContainer: {
    marginVertical: 8,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#86939e",
    marginLeft: 10,
    marginTop: 8,
  },
  formButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  formButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default EducationSection;
