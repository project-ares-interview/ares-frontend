import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  advice: string | null;
  isLoading: boolean;
};

export const AIAdvicePanel = ({ advice, isLoading }: Props) => {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>🤖 AI 종합 조언</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c5282" />
          <Text style={styles.loadingText}>AI 종합 조언을 생성 중입니다. 잠시만 기다려주세요...</Text>
        </View>
      ) : (
        <Text style={styles.adviceText}>{advice || "조언을 받아오지 못했습니다."}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#f7fafc",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2d3748",
    textAlign: "center",
  },
  adviceText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4a5568",
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4a5568',
  },});
