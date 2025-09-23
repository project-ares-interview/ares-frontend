import { Picker } from "@react-native-picker/picker";
import { Button, Card, Icon, Input, Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  MilitaryService,
  MilitaryServiceStatus,
} from "../../services/profileService";
import { useProfileStore } from "../../stores/profileStore";

const MilitaryServiceSection = () => {
  const { t } = useTranslation();
  const {
    militaryService,
    fetchMilitaryService,
    createMilitaryService,
    updateMilitaryService,
    deleteMilitaryService,
    loading,
  } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<MilitaryServiceStatus>("not_served");
  const [branch, setBranch] = useState("");
  const [rank, setRank] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchMilitaryService();
  }, [fetchMilitaryService]);

  useEffect(() => {
    if (militaryService) {
      setStatus(militaryService.status);
      setBranch(militaryService.branch || "");
      setRank(militaryService.rank || "");
      setStartDate(militaryService.startDate || "");
      setEndDate(militaryService.endDate || "");
    }
  }, [militaryService]);

  const handleSave = async () => {
    const data: Omit<MilitaryService, "id"> = { status, branch, rank, startDate, endDate };
    if (militaryService) {
      await updateMilitaryService(militaryService.id, data);
    } else {
      await createMilitaryService(data);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (militaryService) {
      await deleteMilitaryService(militaryService.id);
    }
    setIsEditing(false);
  };

  const statusOptions: { label: string; value: MilitaryServiceStatus }[] = [
    { label: t("profile.military.status.not_served"), value: "not_served" },
    { label: t("profile.military.status.served"), value: "served" },
    { label: t("profile.military.status.serving"), value: "serving" },
    { label: t("profile.military.status.exempted"), value: "exempted" },
  ];

  const getStatusLabel = (value: MilitaryServiceStatus) => {
    return statusOptions.find((opt) => opt.value === value)?.label ?? value;
  };

  if (loading) {
    return <ActivityIndicator style={styles.activityIndicator} />;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t("profile.military.title")}</Text>
      {isEditing ? (
        <View style={styles.formContainer}>
          <View style={styles.formRow}>
            <View style={styles.pickerFieldContainer}>
              <Text style={styles.pickerLabel}>
                {t("profile.military.status.title")}
              </Text>
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
            <Input
              label={t("profile.military.branch")}
              value={branch}
              onChangeText={setBranch}
              placeholder={t("profile.military.branch_placeholder")}
              placeholderTextColor="#aaa"
              containerStyle={styles.inputFieldContainer}
              inputContainerStyle={styles.inputUnderline}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              label={t("profile.military.rank")}
              value={rank}
              onChangeText={setRank}
              placeholder={t("profile.military.rank_placeholder")}
              placeholderTextColor="#aaa"
              containerStyle={styles.inputFieldContainer}
              inputContainerStyle={styles.inputUnderline}
            />
            <Input
              label={t("profile.military.start_date")}
              value={startDate}
              onChangeText={setStartDate}
              placeholder={t("profile.military.start_date_placeholder")}
              placeholderTextColor="#aaa"
              containerStyle={styles.inputFieldContainer}
              inputContainerStyle={styles.inputUnderline}
            />
          </View>
          <View style={styles.formRow}>
            <Input
              label={t("profile.military.end_date")}
              value={endDate}
              onChangeText={setEndDate}
              placeholder={t("profile.military.end_date_placeholder")}
              placeholderTextColor="#aaa"
              containerStyle={styles.inputFieldContainer}
              inputContainerStyle={styles.inputUnderline}
            />
          </View>
          <View style={styles.formButtonGroup}>
            <Button
              title={t("common.save")}
              onPress={handleSave}
              containerStyle={styles.formButtonContainer}
              buttonStyle={styles.primaryButton}
              titleStyle={styles.primaryButtonTitle}
            />
            <Button
              title={t("common.cancel")}
              onPress={() => setIsEditing(false)}
              type="outline"
              containerStyle={styles.formButtonContainer}
              buttonStyle={styles.secondaryButton}
              titleStyle={styles.secondaryButtonTitle}
            />
          </View>
        </View>
      ) : (
        <View style={styles.itemContainer}>
          {militaryService ? (
            <View>
              <Text style={styles.itemLabel}>{t("profile.military.status.title")}</Text>
              <Text style={styles.itemValue}>{getStatusLabel(militaryService.status)}</Text>
              {militaryService.branch && (
                <>
                  <Text style={styles.itemLabel}>{t("profile.military.branch")}</Text>
                  <Text style={styles.itemValue}>{militaryService.branch}</Text>
                </>
              )}
              {militaryService.rank && (
                <>
                  <Text style={styles.itemLabel}>{t("profile.military.rank")}</Text>
                  <Text style={styles.itemValue}>{militaryService.rank}</Text>
                </>
              )}
              {militaryService.startDate && militaryService.endDate && (
                <>
                  <Text style={styles.itemLabel}>{t("profile.military.period")}</Text>
                  <Text style={styles.itemValue}>{militaryService.startDate} ~ {militaryService.endDate}</Text>
                </>
              )}
            </View>
          ) : (
            <Text style={styles.noDataText}>{t("profile.military.no_data")}</Text>
          )}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.iconButton}
            >
              <Icon name={militaryService ? "edit" : "add"} type="material" color="#4b5563" />
            </TouchableOpacity>
            {militaryService && (
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.iconButton}
              >
                <Icon name="delete" type="material" color="#dc2626" />
              </TouchableOpacity>
            )}
          </View>
        </View>
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
});

export default MilitaryServiceSection;
