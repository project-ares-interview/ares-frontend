import { TextAnalysisReportData } from '@/schemas/analysis';
import { Card, Chip, Divider, ListItem, Text } from '@rneui/themed';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

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

const markdownStyle = StyleSheet.create({
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  heading1: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 5,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 3,
  },
  table: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
  },
  th: {
    fontWeight: 'bold',
    padding: 8,
    backgroundColor: '#f7f7f7',
  },
  td: {
    padding: 8,
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bullet_list_icon: {
    marginRight: 5,
    fontSize: 15,
    lineHeight: 22,
  },
  ordered_list_icon: {
    marginRight: 5,
    fontSize: 15,
    lineHeight: 22,
  },
});


export const TextAnalysisReport: React.FC<Props> = ({ report }) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <View style={styles.container}>

      <View style={styles.twoColumnReportContainer}>
        {/* Overall Summary */}
        <Card containerStyle={[styles.card, styles.reportColumnItem]}>
          <Card.Title style={styles.cardTitle}>총평</Card.Title>
          <Card.Divider />
          <Text style={styles.bodyText}>{report.overall_summary}</Text>
        </Card>

        {/* Interview Flow Rationale */}
        <Card containerStyle={[styles.card, styles.reportColumnItem]}>
          <Card.Title style={styles.cardTitle}>면접 진행 근거</Card.Title>
          <Card.Divider />
          <Text style={styles.bodyText}>{report.interview_flow_rationale}</Text>
        </Card>

        {/* Strengths Matrix */}
        {report.strengths_matrix?.length > 0 && (
          <Card containerStyle={[styles.card, styles.reportColumnItem]}>
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
          <Card containerStyle={[styles.card, styles.reportColumnItem]}>
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
          <Card containerStyle={[styles.card, styles.reportColumnItem]}>
            <Card.Title style={styles.cardTitle}>점수 집계</Card.Title>
            <Card.Divider />
            <Text style={styles.subHeader}>캘리브레이션</Text>
            <Text style={styles.bodyText}>{report.score_aggregation.calibration}</Text>
          </Card>
        )}

        {/* Missed Opportunities */}
        {report.missed_opportunities?.length > 0 && (
          <Card containerStyle={[styles.card, styles.reportColumnItem]}>
            <Card.Title style={styles.cardTitle}>놓친 기회</Card.Title>
            <Card.Divider />
            {report.missed_opportunities.map((op, i) => (
              <Text key={`missed-${i}`} style={styles.bodyText}>• {op}</Text>
            ))}
          </Card>
        )}

        {/* Potential Global Follow-ups */}
        {report.potential_followups_global?.length > 0 && (
          <Card containerStyle={[styles.card, styles.reportColumnItem]}>
            <Card.Title style={styles.cardTitle}>추가 팔로업 제안</Card.Title>
            <Card.Divider />
            {report.potential_followups_global.map((f, i) => (
              <Text key={`followup-${i}`} style={styles.bodyText}>• {f}</Text>
            ))}
          </Card>
        )}

        {/* Full Resume Analysis */}
        {report.full_resume_analysis && (
            <Card containerStyle={[styles.card, styles.reportColumnItem]}>
              <Card.Title style={styles.cardTitle}>이력서 종합 분석</Card.Title>
              <Card.Divider />
              <View style={styles.resumeSection}>
                  <Text style={styles.subHeader}>심층 분석</Text>
                  <Markdown style={markdownStyle}>{report.full_resume_analysis["심층분석"]}</Markdown>
              </View>
              <View style={styles.resumeSection}>
                  <Text style={styles.subHeader}>교차 분석</Text>
                  <Markdown style={markdownStyle}>{report.full_resume_analysis["교차분석"]}</Markdown>
              </View>
              <View style={styles.resumeSection}>
                  <Text style={styles.subHeader}>NCS 요약</Text>
                  <Markdown style={markdownStyle}>{report.full_resume_analysis["NCS요약"]}</Markdown>
              </View>
            </Card>
        )}

        {/* Hiring Recommendation */}
        {'hiring_recommendation' in report && (
          <Card containerStyle={[styles.card, styles.reportColumnItem]}>
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
          <Card containerStyle={[styles.card, styles.reportColumnItem]}>
            <Card.Title style={styles.cardTitle}>다음 액션</Card.Title>
            <Card.Divider />
            {report.next_actions.map((n, i) => (
              <Text key={`next-${i}`} style={styles.bodyText}>• {n}</Text>
            ))}
          </Card>
        )}
      </View>

      {/* Question by Question Feedback (single column) */}
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>질문별 상세 피드백</Card.Title>
        <Card.Divider />
        {report.question_by_question_feedback.map((q_item, index) => (
          <ListItem.Accordion
            key={index}
            content={
              <ListItem.Content>
                <ListItem.Title style={styles.questionTitle}>{`질문 그룹 ${index + 1}: ${q_item.thematic_summary}`}</ListItem.Title>
              </ListItem.Content>
            }
            isExpanded={expanded[index] || false}
            onPress={() => toggleExpand(index)}
            containerStyle={styles.accordionContainer}
          >
            {q_item.details.map((detail, detailIndex) => (
              <View key={detailIndex} style={styles.feedbackContainer}>
                  <Text style={styles.questionTitle}>{`Q${index + 1}.${detailIndex + 1}. ${detail.question}`}</Text>
                  <Divider style={styles.feedbackDivider}/>

                  <Text style={styles.feedbackLabel}>적용된 프레임워크: <Chip title={detail.evaluation.applied_framework || 'N/A'} size="sm" /></Text>

                  {detail.evaluation.evidence_quote ? (
                    <>
                      <Text style={styles.feedbackLabel}>근거 발췌:</Text>
                      <Text style={styles.answerText}>{detail.evaluation.evidence_quote}</Text>
                      <Divider style={styles.feedbackDivider}/>
                    </>
                  ) : null}

                  {!!detail.model_answer && (
                    <>
                      <Text style={styles.feedbackLabel}>모범 답안:</Text>
                      <Text style={styles.answerText}>{detail.model_answer}</Text>
                      <Divider style={styles.feedbackDivider}/>
                    </>
                  )}

                  <Text style={styles.feedbackLabel}>상세 피드백:</Text>
                  <Text style={styles.feedbackText}>{detail.evaluation.feedback}</Text>
              </View>
            ))}
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
  },
  // New styles for two-column layout
  twoColumnReportContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8, // Adjust padding to match container
  },
  reportColumnItem: {
    width: '48%', // Slightly less than 50% to allow for spacing
    marginBottom: 16, // Spacing between rows
  },
});