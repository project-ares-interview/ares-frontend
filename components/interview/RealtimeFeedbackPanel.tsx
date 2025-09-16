
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type RealtimeFeedbackData = {
  posture_sway: string;
  nod_count: number;
  total_smile_time: number;
};

type Props = {
  feedback: RealtimeFeedbackData | null;
};

export const RealtimeFeedbackPanel = ({ feedback }: Props) => {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>실시간 피드백</Text>
      <View style={styles.feedbackItem}>
        <Text style={styles.feedbackLabel}>자세 움직임</Text>
        <Text style={styles.feedbackValue}>{feedback?.posture_sway ?? '대기 중...'}</Text>
      </View>
      <View style={styles.feedbackItem}>
        <Text style={styles.feedbackLabel}>머리 움직임</Text>
        <Text style={styles.feedbackValue}>{feedback?.nod_count ?? '대기 중...'}</Text>
      </View>
      <View style={styles.feedbackItem}>
        <Text style={styles.feedbackLabel}>미소 시간</Text>
        <Text style={styles.feedbackValue}>{feedback?.total_smile_time ?? '대기 중...'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  feedbackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  feedbackLabel: {
    color: '#718096',
  },
  feedbackValue: {
    fontWeight: '600',
  },
});


