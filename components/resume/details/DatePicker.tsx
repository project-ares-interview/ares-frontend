import {
  getDayOptions,
  getMonthOptions,
  getYearOptions
} from "@/utils/dateUtils";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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
  const dayOptions =
    year && month
      ? getDayOptions(parseInt(year, 10), parseInt(month, 10))
      : Array.from({ length: 31 }, (_, i) => {
          const day = (i + 1).toString().padStart(2, "0");
          return { label: `${day}일`, value: day };
        });

  const handleYearChange = (newYear: string) => {
    const updatedYear = newYear || "";
    setYear(updatedYear);
    onDateChange(`${updatedYear}-${month}-${day}`);
  };

  const handleMonthChange = (newMonth: string) => {
    const updatedMonth = newMonth || "";
    setMonth(updatedMonth);
    onDateChange(`${year}-${updatedMonth}-${day}`);
  };

  const handleDayChange = (newDay: string) => {
    const updatedDay = newDay || "";
    setDay(updatedDay);
    onDateChange(`${year}-${month}-${updatedDay}`);
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
        <Picker
          selectedValue={day}
          onValueChange={handleDayChange}
          style={styles.picker}
        >
          <Picker.Item label="일" value="" />
          {dayOptions.map((opt) => (
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

export default DatePicker;
