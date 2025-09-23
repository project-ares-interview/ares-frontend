import { Picker } from "@react-native-picker/picker";
import { Button, Icon, Input, Text } from "@rneui/themed";
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
  DegreeType,
  Education,
  EducationStatus,
  SchoolType,
} from "../../services/profileService";
import { useProfileStore } from "../../stores/profileStore";
import {
  convertYearMonthToYearMonthDay,
  formatYearMonth,
  getMonthOptions,
  getYearOptions,
  parseYearMonthString,
} from "../../utils/dateUtils";

// 날짜 표시용 헬퍼 함수 (YYYY-MM 형태로 포맷된 값)
const getDisplayDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    // 이미 YYYY-MM 형태이면 그대로 반환
    if (/^\d{4}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // YYYY-MM-DD 형태라면 YYYY-MM으로 변환
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month] = dateString.split('-');
      return `${year}-${month}`;
    }
    // Date 객체로 변환 가능하면 포맷팅
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : formatYearMonth(date);
  } catch {
    return dateString;
  }
};

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
  const [degree, setDegree] = useState<DegreeType | "">(education?.degree ?? "");
  const [status, setStatus] = useState<EducationStatus>(
    education?.status ?? "attending",
  );

  // 입학일 년/월 상태
  const admissionDateParsed = education?.admission_date 
    ? parseYearMonthString(getDisplayDate(education.admission_date))
    : null;
  const [admissionYear, setAdmissionYear] = useState(admissionDateParsed?.year ?? "");
  const [admissionMonth, setAdmissionMonth] = useState(admissionDateParsed?.month ?? "");

  // 졸업일 년/월 상태
  const graduationDateParsed = education?.graduation_date 
    ? parseYearMonthString(getDisplayDate(education.graduation_date))
    : null;
  const [graduationYear, setGraduationYear] = useState(graduationDateParsed?.year ?? "");
  const [graduationMonth, setGraduationMonth] = useState(graduationDateParsed?.month ?? "");

  // 옵션 배열
  const yearOptions = getYearOptions();
  const monthOptions = getMonthOptions();

  useEffect(() => {
    if (["elementary_school", "middle_school", "high_school"].includes(schoolType)) {
      setMajor("");
      setDegree("");
    }
  }, [schoolType]);

  useEffect(() => {
    if (status === "attending") {
      setGraduationYear("");
      setGraduationMonth("");
    }
  }, [status]);

  const schoolTypeOptions: { label: string; value: SchoolType }[] = [
    {
      label: t("profile.education.school_type_options.elementary_school"),
      value: "elementary_school",
    },
    {
      label: t("profile.education.school_type_options.middle_school"),
      value: "middle_school",
    },
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
  ];

  const degreeOptions: { label: string; value: DegreeType }[] = [
    {
      label: t("profile.education.degree_options.associate"),
      value: "associate",
    },
    { label: t("profile.education.degree_options.bachelor"), value: "bachelor" },
    { label: t("profile.education.degree_options.master"), value: "master" },
    {
      label: t("profile.education.degree_options.doctorate"),
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
    // 필수 필드 검증
    if (!admissionYear || !admissionMonth) {
      alert(t("errors.date.required"));
      return;
    }

    if (status !== "attending" && (!graduationYear || !graduationMonth)) {
      alert(t("errors.date.required"));
      return;
    }

    // YYYY-MM 형식으로 조합
    const admissionDateString = `${admissionYear}-${admissionMonth}`;
    const graduationDateString = (status !== "attending" && graduationYear && graduationMonth) 
      ? `${graduationYear}-${graduationMonth}` 
      : null;

    // API 요청을 위해 YYYY-MM을 YYYY-MM-DD로 변환
    const admissionDateFormatted = convertYearMonthToYearMonthDay(admissionDateString);
    const graduationDateFormatted = graduationDateString 
      ? convertYearMonthToYearMonthDay(graduationDateString) 
      : null;

    onSave({
      school_type: schoolType,
      school_name: schoolName,
      major: ["elementary_school", "middle_school", "high_school"].includes(schoolType)
        ? undefined
        : major,
      degree: ["elementary_school", "middle_school", "high_school"].includes(
        schoolType,
      )
        ? undefined
        : degree || undefined,
      status,
      admission_date: admissionDateFormatted!,
      graduation_date: graduationDateFormatted || undefined,
    });
  };

  const showMajorAndDegree = ![
    "elementary_school",
    "middle_school",
    "high_school",
  ].includes(schoolType);

  return (
    <View style={styles.formContainer}>
      <View style={styles.formRow}>
        <View style={styles.pickerFieldContainer}>
          <Text style={styles.pickerLabel}>
            {t("profile.education.school_type")}
          </Text>
          <Picker
            selectedValue={schoolType}
            onValueChange={(itemValue) => setSchoolType(itemValue)}
            style={styles.picker}
          >
            {schoolTypeOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>
        <Input
          label={t("profile.education.school_name")}
          value={schoolName}
          onChangeText={setSchoolName}
          placeholder={t("profile.education.school_name_placeholder")}
          placeholderTextColor="#aaa"
          containerStyle={styles.inputFieldContainer}
          inputContainerStyle={styles.inputUnderline}
        />
      </View>
      {showMajorAndDegree && (
        <View style={styles.formRow}>
          <Input
            label={t("profile.education.major")}
            value={major}
            onChangeText={setMajor}
            placeholder={t("profile.education.major_placeholder")}
            placeholderTextColor="#aaa"
            containerStyle={styles.inputFieldContainer}
            inputContainerStyle={styles.inputUnderline}
          />
          <View style={styles.pickerFieldContainer}>
            <Text style={styles.pickerLabel}>
              {t("profile.education.degree")}
            </Text>
            <Picker
              selectedValue={degree}
              onValueChange={(itemValue) => setDegree(itemValue)}
              style={styles.picker}
            >
              <Picker.Item
                label={t("profile.education.degree_placeholder")}
                value=""
              />
              {degreeOptions.map((opt) => (
                <Picker.Item
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}

      <View style={styles.formRow}>
        <View style={styles.pickerFieldContainer}>
          <Text style={styles.pickerLabel}>{t("profile.education.status")}</Text>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            {statusOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>
        <View style={styles.datePickerRowContainer}>
          <Text style={styles.pickerLabel}>
            {t("profile.education.admission_date")}
          </Text>
          <View style={styles.datePickerContainer}>
            <Picker
              selectedValue={admissionYear}
              onValueChange={(itemValue) => setAdmissionYear(itemValue)}
              style={styles.datePicker}
            >
              <Picker.Item label={t("common.select_year")} value="" />
              {yearOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
            <Picker
              selectedValue={admissionMonth}
              onValueChange={(itemValue) => setAdmissionMonth(itemValue)}
              style={styles.datePicker}
            >
              <Picker.Item label={t("common.select_month")} value="" />
              {monthOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {status !== "attending" && (
        <View style={styles.formRow}>
          <View style={styles.datePickerRowContainer}>
            <Text style={styles.pickerLabel}>
              {t("profile.education.graduation_date")}
            </Text>
            <View style={styles.datePickerContainer}>
              <Picker
                selectedValue={graduationYear}
                onValueChange={(itemValue) => setGraduationYear(itemValue)}
                style={styles.datePicker}
              >
                <Picker.Item label={t("common.select_year")} value="" />
                {yearOptions.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
              <Picker
                selectedValue={graduationMonth}
                onValueChange={(itemValue) => setGraduationMonth(itemValue)}
                style={styles.datePicker}
              >
                <Picker.Item label={t("common.select_month")} value="" />
                {monthOptions.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      )}

      <View style={styles.formButtonGroup}>
        <Button
          title={t("common.save")}
          onPress={handleSave}
          disabled={!schoolName.trim() || !admissionYear || !admissionMonth}
          containerStyle={styles.formButtonContainer}
          buttonStyle={styles.primaryButton}
          titleStyle={styles.primaryButtonTitle}
        />
        <Button
          title={t("common.cancel")}
          onPress={onCancel}
          type="outline"
          containerStyle={styles.formButtonContainer}
          buttonStyle={styles.secondaryButton}
          titleStyle={styles.secondaryButtonTitle}
        />
      </View>
    </View>
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
    return <ActivityIndicator style={styles.activityIndicator} />;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t("profile.education.title")}</Text>
      {educations.length === 0 && !editingEducationId && (
        <Text style={styles.noDataText}>{t("profile.education.no_data")}</Text>
      )}
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
              <Text style={styles.itemValue}>{edu.school_name}</Text>
              {edu.major && (
                <Text style={styles.itemLabel}>
                  {edu.major} {edu.degree && `(${t(`profile.education.degree_options.${edu.degree}`)})`}
                </Text>
              )}
              <Text style={styles.itemLabel}>
                {getDisplayDate(edu.admission_date)} ~{" "}
                {edu.graduation_date ? getDisplayDate(edu.graduation_date) : t("profile.education.status_options.attending")}
              </Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={() => setEditingEducationId(edu.id)}
                style={styles.iconButton}
              >
                <Icon name="edit" type="material" color="#4b5563" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(edu.id)}
                style={styles.iconButton}
              >
                <Icon name="delete" type="material" color="#dc2626" />
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
          buttonStyle={styles.addButtonInner}
          titleStyle={styles.addButtonTitle}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 0, // Managed by parent gap
    width: '48%', // Will be constrained by parent flexWrap
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  activityIndicator: {
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  itemValue: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    padding: 8,
  },
  addButton: {
    marginTop: 16,
  },
  addButtonInner: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
  },
  addButtonTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  inputFieldContainer: {
    width: '48%',
    marginBottom: 8,
  },
  pickerFieldContainer: {
    width: '48%',
    marginBottom: 8,
  },
  inputUnderline: {
    borderBottomWidth: 0,
    backgroundColor: '#ffffff',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
    marginLeft: 10,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    height: 40,
  },
  formButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  formButtonContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
  },
  primaryButtonTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 10,
  },
  secondaryButtonTitle: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerRowContainer: {
    width: '48%',
    marginBottom: 8,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  datePicker: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    height: 40,
  },
});

export default EducationSection;
