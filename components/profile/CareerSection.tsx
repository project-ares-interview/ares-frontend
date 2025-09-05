import { Picker } from "@react-native-picker/picker";
import { Button, Card, CheckBox, Icon, Input, Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
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
      reason_for_leaving: (!isAttending && endDateString && reasonForLeaving) ? reasonForLeaving : undefined,
    });
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Input
        label={t("profile.career.company_name")}
        value={companyName}
        onChangeText={setCompanyName}
        containerStyle={styles.inputContainer}
      />
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
      <CheckBox
        title={t("profile.career.is_attending")}
        checked={isAttending}
        onPress={() => setIsAttending(!isAttending)}
        containerStyle={styles.inputContainer}
      />
      {/* 입사일 선택 */}
      <Text style={styles.pickerLabel}>
        {t("profile.career.start_date")}
      </Text>
      <View style={styles.datePickerContainer}>
        <Picker
          selectedValue={startYear}
          onValueChange={(itemValue) => setStartYear(itemValue)}
          style={styles.datePicker}
        >
          <Picker.Item label="년도 선택" value="" />
          {yearOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
        <Picker
          selectedValue={startMonth}
          onValueChange={(itemValue) => setStartMonth(itemValue)}
          style={styles.datePicker}
        >
          <Picker.Item label="월 선택" value="" />
          {monthOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
        <Picker
          selectedValue={startDay}
          onValueChange={(itemValue) => setStartDay(itemValue)}
          style={styles.datePicker}
        >
          <Picker.Item label="일 선택" value="" />
          {startDayOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      {/* 퇴사일 선택 (재직중이 아닌 경우에만) */}
      {!isAttending && (
        <>
          <Text style={styles.pickerLabel}>
            {t("profile.career.end_date")}
          </Text>
          <View style={styles.datePickerContainer}>
            <Picker
              selectedValue={endYear}
              onValueChange={(itemValue) => setEndYear(itemValue)}
              style={styles.datePicker}
            >
              <Picker.Item label="년도 선택" value="" />
              {yearOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
            <Picker
              selectedValue={endMonth}
              onValueChange={(itemValue) => setEndMonth(itemValue)}
              style={styles.datePicker}
            >
              <Picker.Item label="월 선택" value="" />
              {monthOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
            <Picker
              selectedValue={endDay}
              onValueChange={(itemValue) => setEndDay(itemValue)}
              style={styles.datePicker}
            >
              <Picker.Item label="일 선택" value="" />
              {endDayOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
        </>
      )}
      <Input
        label={t("profile.career.department")}
        value={department}
        onChangeText={setDepartment}
        containerStyle={styles.inputContainer}
      />
      <Input
        label={t("profile.career.responsibilities")}
        value={responsibilities}
        onChangeText={setResponsibilities}
        multiline
        containerStyle={styles.inputContainer}
      />
      {!isAttending && endYear && endMonth && endDay && (
        <Input
          label={t("profile.career.reason_for_leaving")}
          value={reasonForLeaving}
          onChangeText={setReasonForLeaving}
          multiline
          containerStyle={styles.inputContainer}
        />
      )}

      <View style={styles.formButtonGroup}>
        <Button
          title={t("common.save")}
          onPress={handleSave}
          disabled={!companyName.trim() || !startYear || !startMonth || !startDay}
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
    return <ActivityIndicator />;
  }

  return (
    <Card>
      <Card.Title>{t("profile.career.title")}</Card.Title>
      <Card.Divider />
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
              <Text style={styles.itemTextBold}>{c.company_name}</Text>
              <Text>{c.department}</Text>
              <Text>
                {getDisplayDate(c.start_date)} ~{" "}
                {c.is_attending
                  ? t("profile.career.is_attending_true")
                  : getDisplayDate(c.end_date || "")}
              </Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={() => setEditingCareerId(c.id)}>
                <Icon name="edit" type="material" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(c.id)}>
                <Icon name="delete" type="material" color="error" />
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
  datePickerContainer: {
    flexDirection: "row",
    marginVertical: 8,
    marginHorizontal: 10,
    gap: 8,
  },
  datePicker: {
    flex: 1,
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

export default CareerSection;
