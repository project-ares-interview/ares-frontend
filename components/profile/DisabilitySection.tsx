import { Picker } from "@react-native-picker/picker";
import { Button, Icon, Input, Text } from "@rneui/themed";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Disability,
    DisabilitySeverity,
} from "../../services/profileService";
import { useProfileStore } from "../../stores/profileStore";

const DisabilityForm = ({
  disability,
  onCancel,
  onSave,
}: {
  disability: Partial<Disability> | null;
  onCancel: () => void;
  onSave: (data: Omit<Disability, "id">) => void;
}) => {
  const { t } = useTranslation();
  const [disabilityType, setDisabilityType] = useState(
    disability?.disability_type ?? "",
  );
  const [severity, setSeverity] = useState<DisabilitySeverity>(
    disability?.severity ?? "mild",
  );

  const severityOptions: { label: string; value: DisabilitySeverity }[] = [
    { label: t("profile.disability.severity.mild"), value: "mild" },
    { label: t("profile.disability.severity.severe"), value: "severe" },
  ];

  const handleSave = () => {
    onSave({ disability_type: disabilityType, severity });
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.formRow}>
        <Input
          label={t("profile.disability.disability_type")}
          value={disabilityType}
          onChangeText={setDisabilityType}
          placeholder={t("profile.disability.disability_type_placeholder")}
          placeholderTextColor="#aaa"
          containerStyle={styles.inputFieldContainer}
          inputContainerStyle={styles.inputUnderline}
        />
        <View style={styles.pickerFieldContainer}>
          <Text style={styles.pickerLabel}>
            {t("profile.disability.severity.title")}
          </Text>
          <Picker
            selectedValue={severity}
            onValueChange={(itemValue) => setSeverity(itemValue)}
            style={styles.picker}
          >
            {severityOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.formButtonGroup}>
        <Button
          title={t("common.save")}
          onPress={handleSave}
          disabled={!disabilityType.trim()}
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

const DisabilitySection = () => {
  const { t } = useTranslation();
  const {
    disabilities,
    createDisability,
    updateDisability,
    deleteDisability,
    loading,
  } = useProfileStore();

  const [editingDisabilityId, setEditingDisabilityId] = useState<number | "new" | null>(null);

  const handleSave = async (data: Omit<Disability, "id">) => {
    if (editingDisabilityId === "new") {
      await createDisability(data);
    } else if (editingDisabilityId) {
      await updateDisability(editingDisabilityId, data);
    }
    setEditingDisabilityId(null);
  };

  const handleDelete = async (id: number) => {
    await deleteDisability(id);
  };

  if (loading) {
    return <ActivityIndicator style={styles.activityIndicator} />;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t("profile.disability.title")}</Text>
      {disabilities.length === 0 && !editingDisabilityId && (
        <Text style={styles.noDataText}>{t("profile.disability.no_data")}</Text>
      )}
      {disabilities.map((disability) =>
        editingDisabilityId === disability.id ? (
          <DisabilityForm
            key={disability.id}
            disability={disability}
            onCancel={() => setEditingDisabilityId(null)}
            onSave={handleSave}
          />
        ) : (
          <View key={disability.id} style={styles.itemContainer}>
            <View>
              <Text style={styles.itemLabel}>
                {t("profile.disability.disability_type")}
              </Text>
              <Text style={styles.itemValue}>
                {disability.disability_type}
              </Text>
              <Text style={styles.itemLabel}>
                {t("profile.disability.severity.title")}
              </Text>
              <Text style={styles.itemValue}>
                {t(`profile.disability.severity.${disability.severity}`)}
              </Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={() => setEditingDisabilityId(disability.id)}
                style={styles.iconButton}
              >
                <Icon name="edit" type="material" color="#4b5563" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(disability.id)}
                style={styles.iconButton}
              >
                <Icon name="delete" type="material" color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        ),
      )}

      {editingDisabilityId === 'new' ? (
        <DisabilityForm 
          disability={null} 
          onCancel={() => setEditingDisabilityId(null)}
          onSave={handleSave}
        />
      ) : (
        <Button
          title={t("profile.disability.add_button")}
          onPress={() => setEditingDisabilityId("new")}
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
    marginBottom: 0, // Adjust as needed
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
    height: 40, // Adjust height for consistency
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

export default DisabilitySection;
