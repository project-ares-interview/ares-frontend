import { Card, Text } from '@rneui/themed';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const TextAnalysisLoading = () => {
  return (
    <Card containerStyle={styles.card}>
      <Card.Title style={styles.cardTitle}>종합 분석 리포트</Card.Title>
      <Card.Divider />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>
          텍스트 분석 리포트를 생성 중입니다. 잠시만 기다려주세요...
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
