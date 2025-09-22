import { TextAnalysisReportData } from '@/schemas/analysis';
import { Card, Text, Divider, ListItem, Chip } from '@rneui/themed';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  report: TextAnalysisReportData;
}

const assessmentChip = (assessment: string) => {
    let color = '#E0E0E0'; // default grey
    if (assessment.includes('상') || assessment.includes('우수')) color = '#4CAF50'; // green
    if (assessment.includes('중')) color = '#FFC107'; // amber
    if (assessment.includes('하') || assessment.includes('미흡')) color = '#F44336'; // red

    return <Chip title={assessment} buttonStyle={{ backgroundColor: color }} />;
}

export const TextAnalysisReport: React.FC<Props> = ({ report }) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.mainTitle}>종합 분석 리포트</Text>

      <View style={styles.twoColumnCardsContainer}>
        {/* Overall Summary */}
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>총평</Card.Title>
          <Card.Divider />
          <Text style={styles.bodyText}>{report.overall_summary}</Text>
        </Card>

        {/* Core Competencies */}
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>핵심 역량 분석</Card.Title>
          <Card.Divider />
          {report.core_competency_analysis.map((item, index) => (
            <View key={index} style={styles.competencyItem}>
              <View style={styles.competencyHeader}>
                  <Text style={styles.competencyTitle}>{item.competency}</Text>
                  {assessmentChip(item.assessment)}
              </View>
              <Text style={styles.evidenceText}>└ 근거: {item.evidence}</Text>
              {index < report.core_competency_analysis.length - 1 && <Divider style={styles.itemDivider} />}
            </View>
          ))}
        </Card>

        {/* Growth Potential */}
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>성장 가능성</Card.Title>
          <Card.Divider />
          <Text style={styles.bodyText}>{report.growth_potential}</Text>
        </Card>

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
      </View>

      {/* Question by Question Feedback */}
      <Card containerStyle={[styles.card, styles.fullWidthCard]}> {/* Apply both styles */}
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
                <Text style={styles.feedbackLabel}>내 답변:</Text>
                {console.log('Debug: item.answer for Q', index + 1, ':', item.answer)}
                <Text style={styles.answerText}>{item.answer || '답변 내용 없음'}</Text>
                
                <Divider style={styles.feedbackDivider}/>

                <Text style={styles.feedbackLabel}>적용된 프레임워크: <Chip title={item.evaluation.applied_framework} size="small" /></Text>
                
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
    backgroundColor: "#f7fafc", // Light gray background
    borderRadius: 12,
    padding: 20, // Increased padding
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20, // Add margin to separate from next element
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    width: '48%', // Two cards per row with some margin
    marginHorizontal: '1%', // 1% margin on each side
    marginBottom: 10, // Add some vertical spacing between rows
  },
  fullWidthCard: {
    width: '100%',
    marginHorizontal: 0, // Remove horizontal margins
    marginBottom: 10, // Keep vertical spacing
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
  twoColumnCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribute cards evenly
    marginBottom: 10, // Space before the next single column card
  },
});
