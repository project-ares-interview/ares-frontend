import { TextAnalysisReportData } from '@/schemas/analysis';
import { Card, Chip, Divider, ListItem, Text } from '@rneui/themed';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  report: TextAnalysisReportData;
}

const severityChip = (severity: string) => {
  let color = '#E0E0E0';
  if (severity === 'high') color = '#F44336';
  else if (severity === 'medium') color = '#FFC107';
  else if (severity === 'low') color = '#4CAF50';
  return <Chip title={`심각도: ${severity}`} buttonStyle={{ backgroundColor: color }} />;
};

export const TextAnalysisReport: React.FC<Props> = ({ report }) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.mainTitle}>종합 분석 리포트</Text>

      {/* Overall Summary */}
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>총평</Card.Title>
        <Card.Divider />
        <Text style={styles.bodyText}>{report.overall_summary}</Text>
      </Card>

      {/* Interview Flow Rationale */}
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>면접 진행 근거</Card.Title>
        <Card.Divider />
        <Text style={styles.bodyText}>{report.interview_flow_rationale}</Text>
      </Card>

      {/* Strengths Matrix */}
      {report.strengths_matrix?.length > 0 && (
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>강점 매트릭스</Card.Title>
          <Card.Divider />
          {report.strengths_matrix.map((item, index) => (
            <View key={`strength-${index}`} style={styles.competencyItem}>
              <Text style={styles.competencyTitle}>{item.theme}</Text>
              <Text style={styles.evidenceText}>
                └ 근거: {item.evidence.join(', ')}
              </Text>
              {index < report.strengths_matrix.length - 1 && <Divider style={styles.itemDivider} />}
            </View>
          ))}
        </Card>
      )}

      {/* Weaknesses Matrix */}
      {report.weaknesses_matrix?.length > 0 && (
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>약점 매트릭스</Card.Title>
          <Card.Divider />
          {report.weaknesses_matrix.map((item, index) => (
            <View key={`weakness-${index}`} style={styles.competencyItem}>
              <View style={styles.competencyHeader}>
                <Text style={styles.competencyTitle}>{item.theme}</Text>
                {severityChip(item.severity)}
              </View>
              <Text style={styles.evidenceText}>
                └ 근거: {item.evidence.join(', ')}
              </Text>
              {index < report.weaknesses_matrix.length - 1 && <Divider style={styles.itemDivider} />}
            </View>
          ))}
        </Card>
      )}

      {/* Score Aggregation */}
      {report.score_aggregation && (
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>점수 집계</Card.Title>
          <Card.Divider />
          <Text style={styles.subHeader}>캘리브레이션</Text>
          <Text style={styles.bodyText}>{report.score_aggregation.calibration}</Text>
        </Card>
      )}

      {/* Missed Opportunities */}
      {report.missed_opportunities?.length > 0 && (
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>놓친 기회</Card.Title>
          <Card.Divider />
          {report.missed_opportunities.map((op, i) => (
            <Text key={`missed-${i}`} style={styles.bodyText}>• {op}</Text>
          ))}
        </Card>
      )}

      {/* Potential Global Follow-ups */}
      {report.potential_followups_global?.length > 0 && (
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>추가 팔로업 제안</Card.Title>
          <Card.Divider />
          {report.potential_followups_global.map((f, i) => (
            <Text key={`followup-${i}`} style={styles.bodyText}>• {f}</Text>
          ))}
        </Card>
      )}

      {/* Resume Feedback */}
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>이력서 기반 피드백</Card.Title>
        <Card.Divider />
        <View style={styles.resumeSection}>
            <Text style={styles.subHeader}>직무 적합도</Text>
            <Text style={styles.bodyText}>{report.resume_feedback.job_fit_assessment}</Text>
        </View>
        <View style={styles.resumeSection}>
            <Text style={styles.subHeader}>강점 및 기회</Text>
            <Text style={styles.bodyText}>{report.resume_feedback.strengths_and_opportunities}</Text>
        </View>
        <View style={styles.resumeSection}>
            <Text style={styles.subHeader}>약점 및 개선점</Text>
            <Text style={styles.bodyText}>{report.resume_feedback.gaps_and_improvements}</Text>
        </View>
      </Card>

      {/* Hiring Recommendation */}
      {'hiring_recommendation' in report && (
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>채용 추천</Card.Title>
          <Card.Divider />
          <Chip
            title={report.hiring_recommendation === 'hire' ? '채용 추천' : '채용 비추천'}
            buttonStyle={{ backgroundColor: report.hiring_recommendation === 'hire' ? '#4CAF50' : '#F44336' }}
          />
        </Card>
      )}

      {/* Next Actions */}
      {report.next_actions?.length > 0 && (
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>다음 액션</Card.Title>
          <Card.Divider />
          {report.next_actions.map((n, i) => (
            <Text key={`next-${i}`} style={styles.bodyText}>• {n}</Text>
          ))}
        </Card>
      )}

      {/* Question by Question Feedback */}
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>질문별 상세 피드백</Card.Title>
        <Card.Divider />
        {report.question_by_question_feedback.map((item, index) => (
          <ListItem.Accordion
            key={index}
            content={
              <ListItem.Content>
                <ListItem.Title style={styles.questionTitle}>{`Q${index + 1}. ${item.question}`}</ListItem.Title>
              </ListItem.Content>
            }
            isExpanded={expanded[index] || false}
            onPress={() => toggleExpand(index)}
            containerStyle={styles.accordionContainer}
          >
            <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackLabel}>적용된 프레임워크: <Chip title={item.evaluation.applied_framework || 'N/A'} size="sm" /></Text>

                {item.evaluation.evidence_quote ? (
                  <>
                    <Text style={styles.feedbackLabel}>근거 발췌:</Text>
                    <Text style={styles.answerText}>{item.evaluation.evidence_quote}</Text>
                    <Divider style={styles.feedbackDivider}/>
                  </>
                ) : null}

                {!!item.model_answer && (
                  <>
                    <Text style={styles.feedbackLabel}>모범 답안:</Text>
                    <Text style={styles.answerText}>{item.model_answer}</Text>
                    <Divider style={styles.feedbackDivider}/>
                  </>
                )}

                <Text style={styles.feedbackLabel}>상세 피드백:</Text>
                <Text style={styles.feedbackText}>{item.evaluation.feedback}</Text>
            </View>
          </ListItem.Accordion>
        ))}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  competencyItem: {
    marginBottom: 12,
  },
  competencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  competencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  evidenceText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  itemDivider: {
      marginTop: 12,
  },
  resumeSection: {
      marginBottom: 12,
  },
  subHeader: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
  },
  accordionContainer: {
    paddingVertical: 8,
  },
  questionTitle: {
    fontWeight: 'bold',
  },
  feedbackContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  feedbackLabel: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 6,
      marginTop: 8,
  },
  answerText: {
      fontSize: 14,
      lineHeight: 20,
      backgroundColor: '#FFF',
      padding: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#EEE',
  },
  feedbackDivider: {
      marginVertical: 12,
  },
  feedbackText: {
      fontSize: 14,
      lineHeight: 20,
  }
});