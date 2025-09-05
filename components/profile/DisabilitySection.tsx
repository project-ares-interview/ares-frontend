import { Picker } from "@react-native-picker/picker";
import { Button, Card, Icon, Input, Text } from "@rneui/themed";
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
      <Input
        label={t("profile.disability.disability_type")}
        value={disabilityType}
        onChangeText={setDisabilityType}
        containerStyle={styles.inputContainer}
      />
      <Text style={styles.pickerLabel}>
        {t("profile.disability.severity.title")}
      </Text>
      <Picker
        selectedValue={severity}
        onValueChange={(itemValue) => setSeverity(itemValue)}
      >
        {severityOptions.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
      <View style={styles.formButtonGroup}>
        <Button
          title={t("common.save")}
          onPress={handleSave}
          disabled={!disabilityType.trim()}
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
    return <ActivityIndicator />;
  }

  return (
    <Card>
      <Card.Title>{t("profile.disability.title")}</Card.Title>
      <Card.Divider />
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
              <Text style={styles.itemText}>
                {`${t(
                  "profile.disability.disability_type",
                )}: ${disability.disability_type}`}
              </Text>
              <Text style={styles.itemText}>
                {`${t("profile.disability.severity.title")}: ${t(
                  `profile.disability.severity.${disability.severity}`,
                )}`}
              </Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={() => setEditingDisabilityId(disability.id)}>
                <Icon name="edit" type="material" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(disability.id)}>
                <Icon name="delete" type="material" color="error" />
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
    marginBottom: 8,
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
    marginTop: 16,
  },
  formButton: {
    flex: 1,
    marginHorizontal: 8,
  }
});

export default DisabilitySection;
