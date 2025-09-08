import {
    getMonthOptions,
    getYearOptions,
    parseYearMonthString,
} from "@/utils/dateUtils";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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

  const handleYearChange = (newYear: string) => {
    const updatedYear = newYear || "";
    setYear(updatedYear);
    onDateChange(`${updatedYear}-${month}`);
  };

  const handleMonthChange = (newMonth: string) => {
    const updatedMonth = newMonth || "";
    setMonth(updatedMonth);
    onDateChange(`${year}-${updatedMonth}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}>*</Text>}
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={year}
          onValueChange={handleYearChange}
          style={styles.picker}
        >
          <Picker.Item label="년" value="" />
          {yearOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
        <Picker
          selectedValue={month}
          onValueChange={handleMonthChange}
          style={styles.picker}
        >
          <Picker.Item label="월" value="" />
          {monthOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  asterisk: {
    color: "red",
    marginLeft: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    gap: 8,
  },
  picker: {
    flex: 1,
    padding: 10,
  },
});

export default YearMonthPicker;
