import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type VideoAnalysis = {
  behavioral_metrics: {
    posture: { stability_score: number };
    head_movements: { head_stability_score: number };
    facial_expressions: { smile_percentage: number };
    eye_contact: { blink_rate_per_minute: number };
    hand_gestures: { gesture_frequency_per_minute: number };
  };
};

type Props = {
  videoAnalysis: VideoAnalysis | null;
};

export const VideoAnalysisPanel = ({ videoAnalysis }: Props) => {
  const renderTable = (title: string, data: [string, string | number][]) => (
    <View style={styles.tableContainer}>
      <Text style={styles.title}>{title}</Text>
      {data.map(([key, value]) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{key}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      ))}
    </View>
  );

  const videoData: [string, string | number][] = videoAnalysis?.behavioral_metrics
    ? [
        [
          '자세 안정성',
          `${videoAnalysis.behavioral_metrics.posture.stability_score.toFixed(1)} 점`,
        ],
        [
          '머리 안정성',
          `${videoAnalysis.behavioral_metrics.head_movements.head_stability_score.toFixed(1)} 점`,
        ],
        [
          '미소 비율',
          `${videoAnalysis.behavioral_metrics.facial_expressions.smile_percentage.toFixed(1)} %`,
        ],
        [
          '분당 눈깜빡임',
          `${videoAnalysis.behavioral_metrics.eye_contact.blink_rate_per_minute.toFixed(1)} 회`,
        ],
        [
          '분당 손 제스쳐',
          `${videoAnalysis.behavioral_metrics.hand_gestures.gesture_frequency_per_minute.toFixed(1)} 회`,
        ],
      ]
    : [];

  if (!videoAnalysis) {
    return <Text>영상 분석 데이터가 없습니다.</Text>;
  }

  return renderTable('영상 분석', videoData);
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  tableContainer: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  label: {
    color: '#2d3748',
    fontSize: 16,
  },
  value: {
    fontWeight: '600',
    fontSize: 16,
  },
});
