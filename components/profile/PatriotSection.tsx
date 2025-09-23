import { Button, CheckBox, Icon, Input, Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
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
  const [isPatriot, setIsPatriot] = useState(false);
  const [relation, setRelation] = useState("");

  useEffect(() => {
    fetchPatriot();
  }, [fetchPatriot]);

  useEffect(() => {
    if (patriot) {
      setIsPatriot(patriot.isPatriot);
      setRelation(patriot.relation || "");
    }
  }, [patriot]);

  const handleSave = async () => {
    const data: Omit<Patriot, "id"> = { isPatriot, relation };
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
    return <ActivityIndicator style={styles.activityIndicator} />;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t("profile.patriot.title")}</Text>
      {isEditing ? (
        <View style={styles.formContainer}>
          <View style={styles.formRow}>
            <View style={styles.checkboxFieldContainer}>
              <CheckBox
                title={t("profile.patriot.is_patriot")}
                checked={isPatriot}
                onPress={() => setIsPatriot(!isPatriot)}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
              />
            </View>
            {isPatriot && (
              <Input
                label={t("profile.patriot.relation")}
                value={relation}
                onChangeText={setRelation}
                placeholder={t("profile.patriot.relation_placeholder")}
                placeholderTextColor="#aaa"
                containerStyle={styles.inputFieldContainer}
                inputContainerStyle={styles.inputUnderline}
              />
            )}
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
          {patriot ? (
            <View>
              <Text style={styles.itemLabel}>{t("profile.patriot.is_patriot")}</Text>
              <Text style={styles.itemValue}>{patriot.isPatriot ? t("common.yes") : t("common.no")}</Text>
              {patriot.isPatriot && patriot.relation && (
                <>
                  <Text style={styles.itemLabel}>{t("profile.patriot.relation")}</Text>
                  <Text style={styles.itemValue}>{patriot.relation}</Text>
                </>
              )}
            </View>
          ) : (
            <Text style={styles.noDataText}>{t("profile.patriot.no_data")}</Text>
          )}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.iconButton}
            >
              <Icon name={patriot ? "edit" : "add"} type="material" color="#4b5563" />
            </TouchableOpacity>
            {patriot && (
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

export default PatriotSection;
