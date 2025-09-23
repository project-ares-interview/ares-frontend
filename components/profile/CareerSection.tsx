import { Picker } from "@react-native-picker/picker";
import { Button, CheckBox, Icon, Input, Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Career, ExperienceType } from "../../services/profileService";
import { useProfileStore } from "../../stores/profileStore";
import {
  formatYearMonthDay,
  getDayOptions,
  getMonthOptions,
  getYearOptions,
  parseYearMonthDayString,
} from "../../utils/dateUtils";

// 날짜 표시용 헬퍼 함수 (YYYY-MM-DD 형태로 포맷된 값)
const getDisplayDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    // 이미 YYYY-MM-DD 형태이면 그대로 반환
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // Date 객체로 변환 가능하면 포맷팅
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : formatYearMonthDay(date);
  } catch {
    return dateString;
  }
};

const CareerForm = ({
  career,
  onCancel,
  onSave,
}: {
  career: Partial<Career> | null;
  onCancel: () => void;
  onSave: (data: Omit<Career, "id">) => void;
}) => {
  const { t } = useTranslation();
  const [companyName, setCompanyName] = useState(career?.company_name ?? "");
  const [experienceType, setExperienceType] = useState<ExperienceType>(
    career?.experience_type ?? "experienced",
  );
  const [isAttending, setIsAttending] = useState(career?.is_attending ?? false);
  // 입사일 년/월/일 상태
  const startDateParsed = career?.start_date 
    ? parseYearMonthDayString(getDisplayDate(career.start_date))
    : null;
  const [startYear, setStartYear] = useState(startDateParsed?.year ?? "");
  const [startMonth, setStartMonth] = useState(startDateParsed?.month ?? "");
  const [startDay, setStartDay] = useState(startDateParsed?.day ?? "");

  // 퇴사일 년/월/일 상태
  const endDateParsed = career?.end_date 
    ? parseYearMonthDayString(getDisplayDate(career.end_date))
    : null;
  const [endYear, setEndYear] = useState(endDateParsed?.year ?? "");
  const [endMonth, setEndMonth] = useState(endDateParsed?.month ?? "");
  const [endDay, setEndDay] = useState(endDateParsed?.day ?? "");

  // 옵션 배열
  const yearOptions = getYearOptions();
  const monthOptions = getMonthOptions();
  const startDayOptions = startYear && startMonth 
    ? getDayOptions(parseInt(startYear), parseInt(startMonth))
    : [];
  const endDayOptions = endYear && endMonth 
    ? getDayOptions(parseInt(endYear), parseInt(endMonth))
    : [];
  const [department, setDepartment] = useState(career?.department ?? "");
  const [responsibilities, setResponsibilities] = useState(
    career?.responsibilities ?? "",
  );
  const [task, setTask] = useState(career?.task ?? "");
  const [reasonForLeaving, setReasonForLeaving] = useState(
    career?.reason_for_leaving ?? "",
  );

  useEffect(() => {
    if (isAttending) {
      setEndYear("");
      setEndMonth("");
      setEndDay("");
      setReasonForLeaving("");
    }
  }, [isAttending]);

  useEffect(() => {
    if (!endYear || !endMonth || !endDay) {
      setReasonForLeaving("");
    }
  }, [endYear, endMonth, endDay]);

  const experienceTypeOptions: { label: string; value: ExperienceType }[] = [
    {
      label: t("profile.career.experience_type_options.newcomer"),
      value: "newcomer",
    },
    {
      label: t("profile.career.experience_type_options.experienced"),
      value: "experienced",
    },
  ];

  const handleSave = () => {
    // 필수 필드 검증
    if (!startYear || !startMonth || !startDay) {
      alert(t("errors.date.required"));
      return;
    }

    if (!isAttending && (!endYear || !endMonth || !endDay)) {
      alert(t("errors.date.required"));
      return;
    }

    // YYYY-MM-DD 형식으로 조합
    const startDateString = `${startYear}-${startMonth}-${startDay}`;
    const endDateString = (!isAttending && endYear && endMonth && endDay) 
      ? `${endYear}-${endMonth}-${endDay}` 
      : null;

    onSave({
      company_name: companyName,
      experience_type: experienceType,
      is_attending: isAttending,
      start_date: startDateString,
      end_date: endDateString || undefined,
      department: department || undefined,
      responsibilities: responsibilities || undefined,
      task: task || "",
      reason_for_leaving:
        !isAttending && endDateString && reasonForLeaving
          ? reasonForLeaving
          : undefined,
    });
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.formRow}>
        <Input
          label={t("profile.career.company_name")}
          value={companyName}
          onChangeText={setCompanyName}
          placeholder={t("profile.career.company_name_placeholder")}
          placeholderTextColor="#aaa"
          containerStyle={styles.inputFieldContainer}
          inputContainerStyle={styles.inputUnderline}
        />
        <View style={styles.pickerFieldContainer}>
          <Text style={styles.pickerLabel}>
            {t("profile.career.experience_type")}
          </Text>
          <Picker
            selectedValue={experienceType}
            onValueChange={(itemValue) => setExperienceType(itemValue)}
            style={styles.picker}
          >
            {experienceTypeOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.formRow}>
        <View style={styles.checkboxFieldContainer}>
          <CheckBox
            title={t("profile.career.is_attending")}
            checked={isAttending}
            onPress={() => setIsAttending(!isAttending)}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
        </View>
        <View style={styles.datePickerRowContainer}>
          <Text style={styles.pickerLabel}>
            {t("profile.career.start_date")}
          </Text>
          <View style={styles.datePickerContainer}>
            <Picker
              selectedValue={startYear}
              onValueChange={(itemValue) => setStartYear(itemValue)}
              style={styles.datePicker}
            >
              <Picker.Item label={t("common.select_year")} value="" />
              {yearOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
            <Picker
              selectedValue={startMonth}
              onValueChange={(itemValue) => setStartMonth(itemValue)}
              style={styles.datePicker}
            >
              <Picker.Item label={t("common.select_month")} value="" />
              {monthOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
            <Picker
              selectedValue={startDay}
              onValueChange={(itemValue) => setStartDay(itemValue)}
              style={styles.datePicker}
            >
              <Picker.Item label={t("common.select_day")} value="" />
              {startDayOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {!isAttending && (
        <View style={styles.formRow}>
          <View style={styles.datePickerRowContainer}>
            <Text style={styles.pickerLabel}>
              {t("profile.career.end_date")}
            </Text>
            <View style={styles.datePickerContainer}>
              <Picker
                selectedValue={endYear}
                onValueChange={(itemValue) => setEndYear(itemValue)}
                style={styles.datePicker}
              >
                <Picker.Item label={t("common.select_year")} value="" />
                {yearOptions.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
              <Picker
                selectedValue={endMonth}
                onValueChange={(itemValue) => setEndMonth(itemValue)}
                style={styles.datePicker}
              >
                <Picker.Item label={t("common.select_month")} value="" />
                {monthOptions.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
              <Picker
                selectedValue={endDay}
                onValueChange={(itemValue) => setEndDay(itemValue)}
                style={styles.datePicker}
              >
                <Picker.Item label={t("common.select_day")} value="" />
                {endDayOptions.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>
          </View>
          <Input
            label={t("profile.career.reason_for_leaving")}
            value={reasonForLeaving}
            onChangeText={setReasonForLeaving}
            placeholder={t("profile.career.reason_for_leaving_placeholder")}
            placeholderTextColor="#aaa"
            containerStyle={styles.inputFieldContainer}
            inputContainerStyle={styles.inputUnderline}
          />
        </View>
      )}
      <View style={styles.formRow}>
        <Input
          label={t("profile.career.department")}
          value={department}
          onChangeText={setDepartment}
          placeholder={t("profile.career.department_placeholder")}
          placeholderTextColor="#aaa"
          containerStyle={styles.inputFieldContainer}
          inputContainerStyle={styles.inputUnderline}
        />
        <Input
          label={t("profile.career.responsibilities")}
          value={responsibilities}
          onChangeText={setResponsibilities}
          placeholder={t("profile.career.responsibilities_placeholder")}
          placeholderTextColor="#aaa"
          containerStyle={styles.inputFieldContainer}
          inputContainerStyle={styles.inputUnderline}
        />
      </View>
      <Text style={styles.pickerLabel}>{t("profile.career.task")}</Text>
      <TextInput
        value={task}
        onChangeText={setTask}
        multiline
        placeholder={t("profile.career.task_placeholder")}
        placeholderTextColor="#aaa"
        style={[styles.input, styles.textArea]}
      />

      <View style={styles.formButtonGroup}>
        <Button
          title={t("common.save")}
          onPress={handleSave}
          disabled={!companyName.trim() || !startYear || !startMonth || !startDay}
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

const CareerSection = () => {
  const { t } = useTranslation();
  const { careers, createCareer, updateCareer, deleteCareer, loading } =
    useProfileStore();

  const [editingCareerId, setEditingCareerId] = useState<number | "new" | null>(
    null,
  );

  const handleSave = async (data: Omit<Career, "id">) => {
    if (editingCareerId === "new") {
      await createCareer(data);
    } else if (editingCareerId) {
      await updateCareer(editingCareerId, data);
    }
    setEditingCareerId(null);
  };

  const handleDelete = async (id: number) => {
    await deleteCareer(id);
  };

  if (loading) {
    return <ActivityIndicator style={styles.activityIndicator} />;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t("profile.career.title")}</Text>
      {careers.length === 0 && !editingCareerId && (
        <Text style={styles.noDataText}>{t("profile.career.no_data")}</Text>
      )}
      {careers.map((c) =>
        editingCareerId === c.id ? (
          <CareerForm
            key={c.id}
            career={c}
            onCancel={() => setEditingCareerId(null)}
            onSave={handleSave}
          />
        ) : (
          <View key={c.id} style={styles.itemContainer}>
            <View>
              <Text style={styles.itemValue}>{c.company_name}</Text>
              {c.department && c.responsibilities && (
                <Text style={styles.itemLabel}>
                  {c.department} / {c.responsibilities}
                </Text>
              )}
              {c.task && <Text style={styles.itemLabel}>{c.task}</Text>}
              <Text style={styles.itemLabel}>
                {getDisplayDate(c.start_date)} ~{" "}
                {c.is_attending
                  ? t("profile.career.is_attending_true")
                  : getDisplayDate(c.end_date || "")}
              </Text>
              {c.reason_for_leaving && !c.is_attending && (
                <Text style={styles.itemLabel}>
                  {t("profile.career.reason_for_leaving")}: {c.reason_for_leaving}
                </Text>
              )}
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={() => setEditingCareerId(c.id)}
                style={styles.iconButton}
              >
                <Icon name="edit" type="material" color="#4b5563" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(c.id)}
                style={styles.iconButton}
              >
                <Icon name="delete" type="material" color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        ),
      )}

      {editingCareerId === "new" ? (
        <CareerForm
          career={null}
          onCancel={() => setEditingCareerId(null)}
          onSave={handleSave}
        />
      ) : (
        <Button
          title={t("profile.career.add_button")}
          onPress={() => setEditingCareerId("new")}
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
  checkboxFieldContainer: {
    width: '48%',
    marginBottom: 8,
    justifyContent: 'center',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginLeft: 0,
  },
  checkboxText: {
    fontWeight: 'normal',
    color: '#111827',
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
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
    marginLeft: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});

export default CareerSection;
