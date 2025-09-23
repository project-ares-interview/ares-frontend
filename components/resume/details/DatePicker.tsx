import {
  getDayOptions,
  getMonthOptions,
  getYearOptions,
} from "@/utils/dateUtils";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface DatePickerProps {
  date: string | null | undefined;
  onDateChange: (date: string) => void;
  label: string;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onDateChange,
  label,
  required,
}) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    if (date) {
      const parts = date.split("-");
      setYear(parts[0] || "");
      setMonth(parts[1] || "");
      setDay(parts[2] || "");
    } else {
      setYear("");
      setMonth("");
      setDay("");
    }
  }, [date]);

  const yearOptions = getYearOptions();
  const monthOptions = getMonthOptions();
  const dayOptions = year && month ? getDayOptions(parseInt(year, 10), parseInt(month, 10)) : Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}일`, value: (i + 1).toString().padStart(2, "0") }));

  const handleDateChange = (newYear: string, newMonth: string, newDay: string) => {
    setYear(newYear);
    setMonth(newMonth);
    setDay(newDay);
    onDateChange(`${newYear}-${newMonth}-${newDay}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.requiredAsterisk}> *</Text>}
      </Text>
      <View style={styles.pickerRow}>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={year} onValueChange={(itemValue) => handleDateChange(itemValue, month, day)} style={styles.picker}>
            <Picker.Item label="년" value="" />
            {yearOptions.map((opt) => <Picker.Item key={opt.value} label={opt.label} value={opt.value} />)}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={month} onValueChange={(itemValue) => handleDateChange(year, itemValue, day)} style={styles.picker}>
            <Picker.Item label="월" value="" />
            {monthOptions.map((opt) => <Picker.Item key={opt.value} label={opt.label} value={opt.value} />)}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={day} onValueChange={(itemValue) => handleDateChange(year, month, itemValue)} style={styles.picker}>
            <Picker.Item label="일" value="" />
            {dayOptions.map((opt) => <Picker.Item key={opt.value} label={opt.label} value={opt.value} />)}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
    fontWeight: "500",
  },
  requiredAsterisk: {
    color: "#ff4d4f",
  },
  pickerRow: {
    flexDirection: "row",
    gap: 8,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        paddingVertical: 0, // iOS Picker has its own padding
      },
      android: {
        paddingVertical: 0, // Adjust as needed for Android
      },
    }),
  },
  picker: {
    ...Platform.select({
        ios: {
            height: 150, // Adjust height for iOS wheel picker
        },
        android: {
            height: 50, // Standard height for Android dropdown
        }
    })
  },
});

export default DatePicker;