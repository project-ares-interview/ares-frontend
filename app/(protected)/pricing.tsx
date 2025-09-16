import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Pricing() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pricing</Text>
      <Text style={styles.content}>This is the pricing page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
  },
});
