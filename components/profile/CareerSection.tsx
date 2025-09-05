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
  const [startDate, setStartDate] = useState(career?.start_date ?? "");
  const [endDate, setEndDate] = useState(career?.end_date ?? "");
  const [department, setDepartment] = useState(career?.department ?? "");
  const [responsibilities, setResponsibilities] = useState(
    career?.responsibilities ?? "",
  );
  const [reasonForLeaving, setReasonForLeaving] = useState(
    career?.reason_for_leaving ?? "",
  );

  useEffect(() => {
    if (isAttending) {
      setEndDate("");
      setReasonForLeaving("");
    }
  }, [isAttending]);

  useEffect(() => {
    if (endDate.trim() === "") {
      setReasonForLeaving("");
    }
  }, [endDate]);

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
    onSave({
      company_name: companyName,
      experience_type: experienceType,
      is_attending: isAttending,
      start_date: startDate,
      end_date: isAttending ? undefined : endDate,
      department,
      responsibilities,
      reason_for_leaving: reasonForLeaving,
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
      <Input
        label={t("profile.career.start_date")}
        placeholder="YYYY-MM-DD"
        value={startDate}
        onChangeText={setStartDate}
        containerStyle={styles.inputContainer}
      />
      {!isAttending && (
        <Input
          label={t("profile.career.end_date")}
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChangeText={setEndDate}
          containerStyle={styles.inputContainer}
        />
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
      {!isAttending && endDate.trim() !== "" && (
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
          disabled={!companyName.trim() || !startDate.trim()}
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
                {c.start_date} ~{" "}
                {c.is_attending
                  ? t("profile.career.is_attending_true")
                  : c.end_date}
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
