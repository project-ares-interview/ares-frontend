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

        {/* Resume Comprehensive Analysis */}
        {report.full_resume_analysis && (
          <Card containerStyle={styles.card}>
            <Card.Title style={styles.cardTitle}>이력서 종합 분석</Card.Title>
            <Card.Divider />
            <Text style={styles.subHeader}>심층 분석</Text>
            <Markdown style={markdownStyle}>
              {report.full_resume_analysis["심층분석"]}
            </Markdown>
            <Text style={styles.subHeader}>교차 분석</Text>
            <Markdown style={markdownStyle}>
              {report.full_resume_analysis["교차분석"]}
            </Markdown>
            <Text style={styles.subHeader}>정합성 점검</Text>
            <Markdown style={markdownStyle}>
              {report.full_resume_analysis["정합성점검"]}
            </Markdown>
            <Text style={styles.subHeader}>NCS 요약</Text>
            <Markdown style={markdownStyle}>
              {report.full_resume_analysis["NCS요약"]}
            </Markdown>
          </Card>
        )}
      </View>

      
      {/* Question by Question Feedback (single column) */}
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>질문별 상세 피드백</Card.Title>
        <Card.Divider />
        {report.question_by_question_feedback?.length > 0 ? (
          report.question_by_question_feedback.map((qbqf, index) => (
            <View key={`qbqf-${index}`} style={styles.qbqfItem}>
              <ListItem.Accordion
                content={
                  <ListItem.Content>
                    <ListItem.Title style={styles.qbqfTitle}>
                      {qbqf.main_question_id}. {qbqf.thematic_summary}
                    </ListItem.Title>
                  </ListItem.Content>
                }
                isExpanded={expanded[index] || false}
                onPress={() => toggleExpand(index)}
                containerStyle={styles.qbqfAccordionContainer}
              >
                {qbqf.details.map((detail, detailIndex) => (
                  <ListItem key={`detail-${detailIndex}`} containerStyle={styles.qbqfDetailItem}>
                    <ListItem.Content>
                      <ListItem.Title style={styles.qbqfDetailQuestion}>질문: {detail.question}</ListItem.Title>
                      <ListItem.Subtitle style={styles.qbqfDetailFeedback}>피드백: {detail.evaluation.feedback}</ListItem.Subtitle>
                      {detail.evaluation.evidence_quote && (
                        <Text style={styles.qbqfDetailEvidence}>근거: {detail.evaluation.evidence_quote}</Text>
                      )}
                      <Text style={styles.qbqfDetailModelAnswer}>모범 답변: {detail.model_answer}</Text>
                      {detail.coaching && Object.keys(detail.coaching).length > 0 && (
                        <View style={styles.qbqfDetailCoaching}>
                          <Text style={styles.qbqfDetailCoachingTitle}>코칭:</Text>
                          {Object.entries(detail.coaching).map(([key, value], coachingIndex) => (
                            <Text key={`coaching-${coachingIndex}`} style={styles.qbqfDetailCoachingText}>
                              • {key}: {value}
                            </Text>
                          ))}
                        </View>
                      )}
                    </ListItem.Content>
                  </ListItem>
                ))}
              </ListItem.Accordion>
              {index < report.question_by_question_feedback.length - 1 && <Divider style={styles.itemDivider} />}
            </View>
          ))
        ) : (
          <Text style={styles.bodyText}>질문별 상세 피드백이 없습니다.</Text>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  twoColumnReportContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reportColumnItem: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  competencyItem: {
    marginBottom: 12,
  },
  competencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  competencyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  evidenceText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 8,
  },
  itemDivider: {
    marginVertical: 8,
  },
  qbqfItem: {
    marginBottom: 10,
  },
  qbqfTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  qbqfAccordionContainer: {
    padding: 0,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 5,
  },
  qbqfDetailItem: {
    paddingLeft: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  qbqfDetailQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  qbqfDetailFeedback: {
    fontSize: 14,
    marginBottom: 3,
  },
  qbqfDetailEvidence: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 3,
  },
  qbqfDetailModelAnswer: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 5,
  },
  qbqfDetailCoaching: {
    marginTop: 5,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderColor: '#ddd',
  },
  qbqfDetailCoachingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  qbqfDetailCoachingText: {
    fontSize: 13,
    color: '#666',
  },
});