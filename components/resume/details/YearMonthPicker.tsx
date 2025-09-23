import {
  getMonthOptions,
  getYearOptions,
  parseYearMonthString,
} from "@/utils/dateUtils";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface YearMonthPickerProps {
  date: string | null | undefined;
  onDateChange: (date: string) => void;
  label: string;
  required?: boolean;
}

const YearMonthPicker: React.FC<YearMonthPickerProps> = ({
  date,
  onDateChange,
  label,
  required,
}) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    if (date) {
      const parsedDate = parseYearMonthString(date);
      setYear(parsedDate?.year || "");
      setMonth(parsedDate?.month || "");
    } else {
      setYear("");
      setMonth("");
    }
  }, [date]);

  const yearOptions = getYearOptions();
  const monthOptions = getMonthOptions();

  const handleDateChange = (newYear: string, newMonth: string) => {
    setYear(newYear);
    setMonth(newMonth);
    onDateChange(`${newYear}-${newMonth}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.requiredAsterisk}> *</Text>}
      </Text>
      <View style={styles.pickerRow}>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={year} onValueChange={(itemValue) => handleDateChange(itemValue, month)} style={styles.picker}>
            <Picker.Item label="년" value="" />
            {yearOptions.map((opt) => <Picker.Item key={opt.value} label={opt.label} value={opt.value} />)}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={month} onValueChange={(itemValue) => handleDateChange(year, itemValue)} style={styles.picker}>
            <Picker.Item label="월" value="" />
            {monthOptions.map((opt) => <Picker.Item key={opt.value} label={opt.label} value={opt.value} />)}
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
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
  picker: {
    ...Platform.select({
        ios: {
            height: 150,
        },
        android: {
            height: 50,
        }
    })
  },
});

export default YearMonthPicker;