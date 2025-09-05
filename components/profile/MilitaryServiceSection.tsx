import { Picker } from "@react-native-picker/picker";
import { Button, Card, Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
    MilitaryServiceStatus,
    Omit,
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
  const [selectedStatus, setSelectedStatus] =
    useState<MilitaryServiceStatus>("not_served");

  useEffect(() => {
    fetchMilitaryService();
  }, [fetchMilitaryService]);

  useEffect(() => {
    if (militaryService) {
      setSelectedStatus(militaryService.status);
    }
  }, [militaryService]);

  const handleSave = async () => {
    const data: Omit<MilitaryService, "id"> = { status: selectedStatus };
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
    {
      label: t("profile.military.status.served"),
      value: "served",
    },
    {
      label: t("profile.military.status.not_served"),
      value: "not_served",
    },
    {
      label: t("profile.military.status.exempted"),
      value: "exempted",
    },
    {
      label: t("profile.military.status.serving"),
      value: "serving",
    },
  ];

  const getStatusLabel = (value: MilitaryServiceStatus) => {
    return statusOptions.find((opt) => opt.value === value)?.label ?? value;
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <Card>
      <Card.Title>{t("profile.military.title")}</Card.Title>
      <Card.Divider />
      {isEditing ? (
        <View>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
          >
            {statusOptions.map((opt) => (
              <Picker.Item
                key={opt.value}
                label={opt.label}
                value={opt.value}
              />
            ))}
          </Picker>
          <Button title={t("common.save")} onPress={handleSave} />
          <Button
            title={t("common.cancel")}
            onPress={() => setIsEditing(false)}
            type="outline"
            containerStyle={styles.buttonContainer}
          />
        </View>
      ) : (
        <View>
          <Text>
            {militaryService
              ? getStatusLabel(militaryService.status)
              : t("profile.military.no_data")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <Button
              title={militaryService ? t("common.edit") : t("common.add")}
              onPress={() => setIsEditing(true)}
            />
            {militaryService && (
              <Button
                title={t("common.delete")}
                onPress={handleDelete}
                color="error"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
});

export default MilitaryServiceSection;
