import {
  DegreeType,
  Education,
  EducationCreate,
  EducationStatus,
  EducationUpdate,
  SchoolType,
} from "@/schemas/resume";
import { convertYearMonthToYearMonthDay } from "@/utils/dateUtils";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import YearMonthPicker from "./YearMonthPicker";

interface FormLabelProps {
  label: string;
  required?: boolean;
}

const FormLabel: React.FC<FormLabelProps> = ({ label, required }) => (
  <Text style={styles.label}>
    {label}
    {required && <Text style={styles.asterisk}>*</Text>}
  </Text>
);

interface EducationFormProps {
  initialData?: Education | null;
  onSubmit: (data: EducationCreate | EducationUpdate) => void;
  onCancel: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    school_name: "",
    major: "",
    degree: "" as DegreeType | "",
    school_type: "university" as SchoolType,
    status: "graduated" as EducationStatus,
    admission_date: "",
    graduation_date: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        school_name: initialData.school_name || "",
        major: initialData.major || "",
        degree: initialData.degree || "",
        school_type: initialData.school_type,
        status: initialData.status,
        admission_date: initialData.admission_date.substring(0, 7),
        graduation_date: initialData.graduation_date?.substring(0, 7) || "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    const {
      school_name,
      major,
      degree,
      school_type,
      status,
      admission_date,
      graduation_date,
    } = formData;

    const isMajorValid =
      ["elementary_school", "middle_school", "high_school"].includes(school_type) ||
      major.trim() !== "";
    const isDegreeValid =
      ["elementary_school", "middle_school", "high_school"].includes(school_type) ||
      !!degree;
    const isGraduationDateValid =
      status === "attending" || graduation_date.trim() !== "";

    setIsFormValid(
      school_name.trim() !== "" &&
        isMajorValid &&
        isDegreeValid &&
        admission_date.trim() !== "" &&
        isGraduationDateValid,
    );
  }, [formData]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "school_type") {
        if (["elementary_school", "middle_school", "high_school"].includes(value)) {
          newState.degree = "";
          newState.major = "";
        }
      }
      return newState;
    });
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const dataToSubmit = {
      ...formData,
      major: ["elementary_school", "middle_school", "high_school"].includes(
        formData.school_type,
      )
        ? null
        : formData.major,
      degree: ["elementary_school", "middle_school", "high_school"].includes(
        formData.school_type,
      )
        ? null
        : formData.degree || null,
      admission_date: convertYearMonthToYearMonthDay(
        formData.admission_date,
      )!,
      graduation_date:
        formData.status !== "attending" && formData.graduation_date
          ? convertYearMonthToYearMonthDay(formData.graduation_date)
          : null,
    };
    onSubmit(dataToSubmit);
  };

  const schoolTypeOptions: { label: string; value: SchoolType }[] = [
    {
      label: t("resume.education.school_type_options.elementary_school"),
      value: "elementary_school",
    },
    {
      label: t("resume.education.school_type_options.middle_school"),
      value: "middle_school",
    },
    {
      label: t("resume.education.school_type_options.high_school"),
      value: "high_school",
    },
    {
      label: t("resume.education.school_type_options.junior_college"),
      value: "junior_college",
    },
    {
      label: t("resume.education.school_type_options.university"),
      value: "university",
    },
  ];

  const degreeOptions: { label: string; value: DegreeType }[] = [
    {
      label: t("resume.education.degree_options.associate"),
      value: "associate",
    },
    { label: t("resume.education.degree_options.bachelor"), value: "bachelor" },
    { label: t("resume.education.degree_options.master"), value: "master" },
    {
      label: t("resume.education.degree_options.doctorate"),
      value: "doctorate",
    },
  ];

  const statusOptions: { label: string; value: EducationStatus }[] = [
    {
      label: t("resume.education.status_options.attending"),
      value: "attending",
    },
    { label: t("resume.education.status_options.graduated"), value: "graduated" },
    { label: t("resume.education.status_options.completed"), value: "completed" },
    { label: t("resume.education.status_options.dropout"), value: "dropout" },
  ];

  const showMajorAndDegree = !["elementary_school", "middle_school", "high_school"].includes(
    formData.school_type,
  );

  return (
    <View style={styles.form}>
      <FormLabel label={t("resume.education.school_type")} required />
      <Picker
        selectedValue={formData.school_type}
        onValueChange={(v) => handleChange("school_type", v)}
        style={styles.picker}
      >
        {schoolTypeOptions.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
      <FormLabel label={t("resume.education.school_name")} required />
      <TextInput
        style={styles.input}
        placeholder={t("resume.education.school_name_placeholder")}
        placeholderTextColor="#aaa"
        value={formData.school_name}
        onChangeText={(v) => handleChange("school_name", v)}
      />
      {showMajorAndDegree && (
        <>
          <FormLabel label={t("resume.education.major")} required />
          <TextInput
            style={styles.input}
            placeholder={t("resume.education.major_placeholder")}
            placeholderTextColor="#aaa"
            value={formData.major}
            onChangeText={(v) => handleChange("major", v)}
          />
          <FormLabel label={t("resume.education.degree")} required />
          <Picker
            selectedValue={formData.degree}
            onValueChange={(v) => handleChange("degree", v)}
            style={styles.picker}
          >
            <Picker.Item label={t("resume.education.degree_placeholder")} value="" />
            {degreeOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </>
      )}
      <FormLabel label={t("resume.education.status")} required />
      <Picker
        selectedValue={formData.status}
        onValueChange={(v) => handleChange("status", v)}
        style={styles.picker}
      >
        {statusOptions.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
      <YearMonthPicker
        label={t("resume.education.admission_date")}
        date={formData.admission_date}
        onDateChange={(v) => handleChange("admission_date", v)}
        required
      />
      {formData.status !== "attending" && (
        <YearMonthPicker
          label={t("resume.education.graduation_date")}
          date={formData.graduation_date}
          onDateChange={(v) => handleChange("graduation_date", v)}
          required
        />
      )}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>{t("common.cancel")}</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            styles.saveButton,
            !isFormValid && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>{t("common.save")}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  asterisk: {
    color: "red",
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 10,
    padding: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  disabledButton: {
    backgroundColor: "#a1a1a1",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EducationForm;
