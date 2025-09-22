import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// As defined in the original HTML file
export type VoiceScores = {
  confidence_score: number;
  fluency_score: number;
  stability_score: number;
  clarity_score: number;
  overall_score: number;
};

type Props = {
  voiceScores: VoiceScores | null;
};

export const VoiceAnalysisPanel = ({ voiceScores }: Props) => {
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
        ['자신감', `${voiceScores.confidence_score.toFixed(1)} 점`],
        ['유창성', `${voiceScores.fluency_score.toFixed(1)} 점`],
        ['안정성', `${voiceScores.stability_score.toFixed(1)} 점`],
        ['명료성', `${voiceScores.clarity_score.toFixed(1)} 점`],
        ['종합점수', `${voiceScores.overall_score.toFixed(1)} 점`],
      ]
    : [];

  if (!voiceScores) {
    return <Text>음성 분석 데이터가 없습니다.</Text>;
  }

  return renderTable('음성 분석', voiceData);
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
