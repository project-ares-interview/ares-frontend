
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

type Props = {
  isAnalyzing: boolean;
  onStart: () => void;
  onFinish: () => void;
  startDisabled: boolean;
};

export const InterviewControls = ({ isAnalyzing, onStart, onFinish, startDisabled }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Button
          title="분석 시작"
          onPress={onStart}
          disabled={startDisabled || isAnalyzing}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          title="분석 종료 및 결과 확인"
          onPress={onFinish}
          disabled={!isAnalyzing}
          color="#e53e3e"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  buttonWrapper: {
    marginHorizontal: 8,
  },
});


