import { Button, Icon, Input, Text } from "@rneui/themed";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { JobInterest } from "../../services/profileService";
import { useProfileStore } from "../../stores/profileStore";

const JobInterestForm = ({
  interest,
  onCancel,
  onSave,
}: {
  interest: Partial<JobInterest> | null;
  onCancel: () => void;
  onSave: (data: Omit<JobInterest, "id">) => void;
}) => {
  const { t } = useTranslation();
  const [jobTitle, setJobTitle] = useState(interest?.job_title ?? "");

  const handleSave = () => {
    onSave({ job_title: jobTitle });
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.formRow}>
        <Input
          label={t("profile.job_interest.job_title")}
          value={jobTitle}
          onChangeText={setJobTitle}
          placeholder={t("profile.job_interest.job_title_placeholder")}
          placeholderTextColor="#aaa"
          containerStyle={styles.inputFieldContainer}
          inputContainerStyle={styles.inputUnderline}
        />
      </View>
      <View style={styles.formButtonGroup}>
        <Button
          title={t("common.save")}
          onPress={handleSave}
          disabled={!jobTitle.trim()}
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

const JobInterestSection = () => {
  const { t } = useTranslation();
  const {
    jobInterests,
    createJobInterest,
    updateJobInterest,
    deleteJobInterest,
    loading,
  } = useProfileStore();

  const [editingInterestId, setEditingInterestId] = useState<
    number | "new" | null
  >(null);

  const handleSave = async (data: Omit<JobInterest, "id">) => {
    if (editingInterestId === "new") {
      await createJobInterest(data);
    } else if (editingInterestId) {
      await updateJobInterest(editingInterestId, data);
    }
    setEditingInterestId(null);
  };

  const handleDelete = async (id: number) => {
    await deleteJobInterest(id);
  };

  if (loading) {
    return <ActivityIndicator style={styles.activityIndicator} />;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t("profile.job_interest.title")}</Text>
      {jobInterests.length === 0 && !editingInterestId && (
        <Text style={styles.noDataText}>{t("profile.job_interest.no_data")}</Text>
      )}
      {jobInterests.map((interest) =>
        editingInterestId === interest.id ? (
          <JobInterestForm
            key={interest.id}
            interest={interest}
            onCancel={() => setEditingInterestId(null)}
            onSave={handleSave}
          />
        ) : (
          <View key={interest.id} style={styles.itemContainer}>
            <View>
              <Text style={styles.itemValue}>{interest.job_title}</Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={() => setEditingInterestId(interest.id)}
                style={styles.iconButton}
              >
                <Icon name="edit" type="material" color="#4b5563" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(interest.id)}
                style={styles.iconButton}
              >
                <Icon name="delete" type="material" color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        ),
      )}

      {editingInterestId === "new" ? (
        <JobInterestForm
          interest={null}
          onCancel={() => setEditingInterestId(null)}
          onSave={handleSave}
        />
      ) : (
        <Button
          title={t("profile.job_interest.add_button")}
          onPress={() => setEditingInterestId("new")}
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
});

export default JobInterestSection;
