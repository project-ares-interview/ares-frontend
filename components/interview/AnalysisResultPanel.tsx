
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// As defined in the original HTML file
export type VoiceScores = {
  confidence_score: number;
  fluency_score: number;
  stability_score: number;
  clarity_score: number;
  overall_score: number;
};

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
  voiceScores: VoiceScores | null;
  videoAnalysis: VideoAnalysis | null;
};

export const AnalysisResultPanel = ({ voiceScores, videoAnalysis }: Props) => {
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

  const voiceData: [string, string | number][] = voiceScores
    ? [
        ['자신감', voiceScores.confidence_score || 'N/A'],
        ['유창성', voiceScores.fluency_score || 'N/A'],
        ['안정성', voiceScores.stability_score || 'N/A'],
        ['명료성', voiceScores.clarity_score || 'N/A'],
        ['종합점수', voiceScores.overall_score || 'N/A'],
      ]
    : [];

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

  return (
    <View style={styles.panel}>
      <Text style={styles.mainTitle}>최종 분석 결과</Text>
      {voiceScores ? (
        renderTable('음성 분석', voiceData)
      ) : (
        <Text>음성 분석 데이터가 없습니다.</Text>
      )}
      {videoAnalysis ? (
        renderTable('영상 분석', videoData)
      ) : (
        <Text>영상 분석 데이터가 없습니다.</Text>
      )}
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
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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


