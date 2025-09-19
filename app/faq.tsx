
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card, Button } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';

type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card containerStyle={styles.card}>
      <TouchableOpacity
        style={styles.questionContainer}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.question}>{question}</Text>
        <MaterialIcons
          name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      )}
    </Card>
  );
};

export default function Faq() {
  const { t } = useTranslation();

  const faqData = [
    {
      question: t('pages.faq.q1.question'),
      answer: t('pages.faq.q1.answer'),
    },
    {
      question: t('pages.faq.q2.question'),
      answer: t('pages.faq.q2.answer'),
    },
    {
      question: t('pages.faq.q3.question'),
      answer: t('pages.faq.q3.answer'),
    },
    {
      question: t('pages.faq.q4.question'),
      answer: t('pages.faq.q4.answer'),
    },
    {
        question: t('pages.faq.q5.question'),
        answer: t('pages.faq.q5.answer'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>{t('pages.faq.title')}</Text>
      {faqData.map((faq, index) => (
        <FaqItem key={index} question={faq.question} answer={faq.answer} />
      ))}
      <View style={styles.ctaContainer}>
        <Text style={styles.ctaTitle}>{t('pages.faq.cta.title')}</Text>
        <Text style={styles.ctaSubtitle}>{t('pages.faq.cta.subtitle')}</Text>
        <Button
          title={t('pages.faq.cta.button')}
          buttonStyle={styles.ctaButton}
          titleStyle={styles.ctaButtonText}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  answerContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  answer: {
    fontSize: 16,
  },
  ctaContainer: {
    backgroundColor: '#f8f8f8',
    padding: 30,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 30,
  },
  ctaButtonText: {
    color: 'white',
  },
});
