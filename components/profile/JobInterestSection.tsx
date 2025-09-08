import { Button, Card, Icon, Input, Text } from "@rneui/themed";
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
      <Input
        label={t("profile.job_interest.job_title")}
        value={jobTitle}
        onChangeText={setJobTitle}
        placeholder={t("profile.job_interest.job_title_placeholder")}
        placeholderTextColor="#aaa"
        containerStyle={styles.inputContainer}
      />
      <View style={styles.formButtonGroup}>
        <Button
          title={t("common.save")}
          onPress={handleSave}
          disabled={!jobTitle.trim()}
          containerStyle={styles.formButton}
        />
        <Button
          title={t("common.cancel")}
          onPress={onCancel}
          type="outline"
          containerStyle={styles.formButton}
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
    return <ActivityIndicator />;
  }

  return (
    <Card>
      <Card.Title>{t("profile.job_interest.title")}</Card.Title>
      <Card.Divider />
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
            <Text style={styles.itemText}>{interest.job_title}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={() => setEditingInterestId(interest.id)}
              >
                <Icon name="edit" type="material" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(interest.id)}>
                <Icon name="delete" type="material" color="error" />
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
  itemText: {
    fontSize: 16,
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
  formButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  formButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default JobInterestSection;
