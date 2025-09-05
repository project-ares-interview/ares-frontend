import { Button, Card, Input, Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useProfileStore } from "../../stores/profileStore";

const PatriotSection = () => {
  const { t } = useTranslation();
  const {
    patriot,
    fetchPatriot,
    createPatriot,
    updatePatriot,
    deletePatriot,
    loading,
  } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [patriotCode, setPatriotCode] = useState("");

  useEffect(() => {
    // Data is fetched in MyPage component
    // fetchPatriot();
  }, [fetchPatriot]);

  useEffect(() => {
    if (patriot) {
      setPatriotCode(patriot.patriot_code);
    } else {
      setPatriotCode("");
    }
  }, [patriot]);

  const handleSave = async () => {
    const data = { patriot_code: patriotCode };
    if (patriot) {
      await updatePatriot(patriot.id, data);
    } else {
      await createPatriot(data);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (patriot) {
      await deletePatriot(patriot.id);
    }
    setIsEditing(false);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <Card>
      <Card.Title>{t("profile.patriot.title")}</Card.Title>
      <Card.Divider />
      {isEditing ? (
        <View>
          <Input
            label={t("profile.patriot.patriot_code")}
            value={patriotCode}
            onChangeText={setPatriotCode}
          />
          <Button
            title={t("common.save")}
            onPress={handleSave}
            disabled={!patriotCode.trim()}
          />
          <Button
            title={t("common.cancel")}
            onPress={() => setIsEditing(false)}
            type="outline"
            containerStyle={{ marginTop: 8 }}
          />
        </View>
      ) : (
        <View>
          <Text>
            {patriot
              ? `${t("profile.patriot.patriot_code")}: ${patriot.patriot_code}`
              : t("profile.patriot.no_data")}
          </Text>
          <View style={styles.buttonGroup}>
            <Button
              title={patriot ? t("common.edit") : t("common.add")}
              onPress={() => setIsEditing(true)}
            />
            {patriot && (
              <Button
                title={t("common.delete")}
                onPress={handleDelete}
                color="error"
                containerStyle={{ marginLeft: 8 }}
              />
            )}
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
});

export default PatriotSection;
