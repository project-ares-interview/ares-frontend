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
    <ScrollView style={styles.formContainer}>
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

      <Input
        label={t("profile.education.school_name")}
        value={schoolName}
        onChangeText={setSchoolName}
        placeholder={t("profile.education.school_name_placeholder")}
        placeholderTextColor="#aaa"
        containerStyle={styles.inputContainer}
      />
      {showMajorAndDegree && (
        <>
          <Input
            label={t("profile.education.major")}
            value={major}
            onChangeText={setMajor}
            placeholder={t("profile.education.major_placeholder")}
            placeholderTextColor="#aaa"
            containerStyle={styles.inputContainer}
          />
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
        </>
      )}

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

      {/* 입학일 선택 */}
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

      {/* 졸업일 선택 (재학중이 아닌 경우에만) */}
      {status !== "attending" && (
        <>
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
        </>
      )}

      <View style={styles.formButtonGroup}>
        <Button
          title={t("common.save")}
          onPress={handleSave}
          disabled={!schoolName.trim() || !admissionYear || !admissionMonth}
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
              <Text>
                {edu.major} {edu.degree && `(${t(`profile.education.degree_options.${edu.degree}`)})`}
              </Text>
              <Text>
                {getDisplayDate(edu.admission_date)} ~{" "}
                {edu.graduation_date ? getDisplayDate(edu.graduation_date) : ""}
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
  picker: {
    marginVertical: 8,
    marginHorizontal: 10,
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
  datePickerContainer: {
    flexDirection: "row",
    marginVertical: 8,
    marginHorizontal: 10,
    gap: 8,
  },
  datePicker: {
    flex: 1,
  },
});

export default EducationSection;
