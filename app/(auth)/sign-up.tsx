import { useSignUp } from "@/hooks/useSignUp";
import { useAuthStore } from "@/stores/authStore";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import {
  Button,
  ButtonGroup,
  CheckBox,
  Icon,
  Input,
  Text,
} from "@rneui/themed";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

function WebDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  const [year, setYear] = useState<string | undefined>(
    value ? value.split("-")[0] : undefined,
  );
  const [month, setMonth] = useState<string | undefined>(
    value ? value.split("-")[1] : undefined,
  );
  const [day, setDay] = useState<string | undefined>(
    value ? value.split("-")[2] : undefined,
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) =>
    (currentYear - i).toString(),
  );
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days =
    year && month
      ? Array.from(
          { length: getDaysInMonth(parseInt(year, 10), parseInt(month, 10)) },
          (_, i) => (i + 1).toString(),
        )
      : Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const handleDateChange = (part: "year" | "month" | "day", val: string) => {
    let newYear = year;
    let newMonth = month;
    let newDay = day;

    if (part === "year") {
      newYear = val;
      setYear(val);
    } else if (part === "month") {
      newMonth = val;
      setMonth(val);
    } else {
      newDay = val;
      setDay(val);
    }

    if (newYear && newMonth && newDay) {
      onChange(
        `${newYear}-${newMonth.padStart(2, "0")}-${newDay.padStart(2, "0")}`,
      );
    }
  };

  return (
    <View style={styles.webDatePickerContainer}>
      <Picker
        style={styles.picker}
        selectedValue={year}
        onValueChange={(itemValue) => handleDateChange("year", itemValue)}
      >
        <Picker.Item label={t("pages.sign_up.year")} value={undefined} />
        {years.map((y) => (
          <Picker.Item key={y} label={y} value={y} />
        ))}
      </Picker>
      <Picker
        style={styles.picker}
        selectedValue={month}
        onValueChange={(itemValue) => handleDateChange("month", itemValue)}
      >
        <Picker.Item label={t("pages.sign_up.month")} value={undefined} />
        {months.map((m) => (
          <Picker.Item key={m} label={m} value={m} />
        ))}
      </Picker>
      <Picker
        style={styles.picker}
        selectedValue={day}
        onValueChange={(itemValue) => handleDateChange("day", itemValue)}
      >
        <Picker.Item label={t("pages.sign_up.day")} value={undefined} />
        {days.map((d) => (
          <Picker.Item key={d} label={d} value={d} />
        ))}
      </Picker>
    </View>
  );
}

export default function SignUp() {
  const { t } = useTranslation();
  const { control, errors, submit, isValid, socialSignUpData } = useSignUp();
  const [isTermsLinkHovered, setTermsLinkHovered] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const clearSocialSignUpData = useAuthStore(
    (state) => state.setSocialSignUpData,
  );

  useEffect(() => {
    // Clear social sign up data if not coming from social login flow
    if (params.social !== "true") {
      clearSocialSignUpData(null);
    }
  }, [params.social, clearSocialSignUpData]);

  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text h2 style={styles.title}>
        {t("pages.sign_up.title")}
      </Text>

      {socialSignUpData && (
        <Text style={styles.socialInfoText}>
          {`Continue with your ${
            socialSignUpData.provider.charAt(0).toUpperCase() +
            socialSignUpData.provider.slice(1)
          } account.`}
        </Text>
      )}

      {socialSignUpData ? (
        <Input
          label={t("pages.sign_up.email")}
          value={socialSignUpData.email}
          disabled
          leftIcon={<Icon name="email" type="material-community" />}
        />
      ) : (
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("pages.sign_up.email")}
              leftIcon={<Icon name="email" type="material-community" />}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              errorMessage={errors.email && t(errors.email.message as any)}
            />
          )}
        />
      )}

      {!socialSignUpData && (
        <>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t("pages.sign_up.password")}
                leftIcon={<Icon name="lock" type="material-community" />}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry
                errorMessage={
                  errors.password && t(errors.password.message as any)
                }
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t("pages.sign_up.confirm_password")}
                leftIcon={<Icon name="lock-check" type="material-community" />}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry
                errorMessage={
                  errors.confirmPassword &&
                  t(errors.confirmPassword.message as any)
                }
              />
            )}
          />
        </>
      )}

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder={t("pages.sign_up.name")}
            leftIcon={<Icon name="account" type="material-community" />}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            errorMessage={errors.name && t(errors.name.message as any)}
          />
        )}
      />

      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t("pages.sign_up.gender")}</Text>
            <ButtonGroup
              buttons={[
                t("pages.sign_up.gender_male"),
                t("pages.sign_up.gender_female"),
              ]}
              selectedIndex={value === "male" ? 0 : value === "female" ? 1 : -1}
              onPress={(index) => {
                onChange(index === 0 ? "male" : "female");
              }}
              containerStyle={styles.buttonGroup}
            />
            {errors.gender && (
              <Text style={styles.errorText}>
                {t(errors.gender.message as any)}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="birth"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t("pages.sign_up.birth")}</Text>
            {Platform.OS === "web" ? (
              <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <WebDatePicker value={value} onChange={onChange} />
              </View>
            ) : (
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={styles.dateInputPressable}
              >
                <View pointerEvents="none">
                  <Input
                    placeholder={t("pages.sign_up.birth")}
                    leftIcon={
                      <Icon name="calendar" type="material-community" />
                    }
                    value={value}
                    onBlur={onBlur}
                    editable={false}
                    errorMessage={
                      errors.birth && t(errors.birth.message as any)
                    }
                  />
                </View>
              </Pressable>
            )}
            {showDatePicker && Platform.OS !== "web" && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display="default"
                onChange={(event: DateTimePickerEvent, date?: Date) => {
                  setShowDatePicker(false);
                  if (date) {
                    onChange(date.toISOString().split("T")[0]);
                  }
                }}
              />
            )}
            {errors.birth && Platform.OS === "web" && (
              <Text style={styles.errorText}>
                {t(errors.birth.message as any)}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder={t("pages.sign_up.phone_number")}
            leftIcon={<Icon name="phone" type="material-community" />}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="phone-pad"
            errorMessage={
              errors.phoneNumber && t(errors.phoneNumber.message as any)
            }
          />
        )}
      />

      <Controller
        control={control}
        name="terms"
        render={({ field: { onChange, value } }) => (
          <View>
            <CheckBox
              checked={value}
              onPress={() => onChange(!value)}
              title={
                <View style={styles.termsContainer}>
                  <Text style={styles.termsLabel}>
                    {t("pages.sign_up.terms_agreement")}
                  </Text>
                  <Pressable
                    onPress={() => {
                      const path = "/terms";
                      if (Platform.OS === "web") {
                        window.open(path, "_blank");
                      } else {
                        router.push(path as Href);
                      }
                    }}
                    onHoverIn={() => setTermsLinkHovered(true)}
                    onHoverOut={() => setTermsLinkHovered(false)}
                    accessibilityRole="link"
                  >
                    <Text
                      style={[
                        styles.linkText,
                        isTermsLinkHovered && styles.linkTextHover,
                      ]}
                    >
                      {t("pages.sign_up.terms_of_service")}
                    </Text>
                  </Pressable>
                </View>
              }
              containerStyle={styles.checkboxContainer}
            />
            {errors.terms && (
              <Text style={styles.errorText}>
                {t(errors.terms.message as any)}
              </Text>
            )}
          </View>
        )}
      />

      <Button
        title={t("pages.sign_up.sign_up_button")}
        onPress={submit}
        containerStyle={styles.buttonContainer}
        disabled={!isValid}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
    justifyContent: "center",
  },
  dateInputPressable: {
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  fieldContainer: {
    // paddingLeft: 10,
    // paddingRight: 10,
    marginBottom: 16,
  },
  label: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonGroup: {
    borderRadius: 8,
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginLeft: 0,
    paddingLeft: 0,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  termsLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  linkText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
  },
  linkTextHover: {
    textDecorationLine: "underline",
  },
  buttonContainer: {
    marginTop: 16,
  },
  errorText: {
    color: "red",
    marginLeft: 10,
    marginTop: 4,
  },
  webDatePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    height: 50,
    marginHorizontal: 2,
  },
  socialInfoText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
    color: "#6E6E72",
  },
});
