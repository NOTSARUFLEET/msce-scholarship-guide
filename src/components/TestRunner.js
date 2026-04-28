import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Katex from 'react-native-katex';
import { useLanguage } from '../context/LanguageContext';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

function getKatexExpression(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed.replace(/\$\$/g, '');
}

const QuestionGrid = memo(function QuestionGrid({
  questions,
  currentQuestionIndex,
  selectedOptions,
  onSelectQuestion,
}) {
  const gridButtons = useMemo(
    () =>
      questions.map((question, index) => {
        const isActive = index === currentQuestionIndex;
        const isAnswered = Boolean(selectedOptions[question.id]);

        return (
          <TouchableOpacity
            key={question.id}
            style={[
              styles.gridButton,
              isAnswered && styles.gridButtonAnswered,
              isActive && styles.gridButtonActive,
            ]}
            onPress={() => onSelectQuestion(index)}
          >
            <Text style={[styles.gridButtonText, isActive && styles.gridButtonTextActive]}>
              {index + 1}
            </Text>
          </TouchableOpacity>
        );
      }),
    [currentQuestionIndex, onSelectQuestion, questions, selectedOptions],
  );

  return <View style={styles.gridContainer}>{gridButtons}</View>;
});

export default function TestRunner({ test, onSubmit }) {
  const { language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  const questions = test?.questions ?? [];
  const currentQuestion = questions[currentQuestionIndex];
  const questionText = currentQuestion?.question?.[language] ?? '';
  const katexExpression = useMemo(() => getKatexExpression(questionText), [questionText]);

  const handleSelectQuestion = useCallback((index) => {
    setCurrentQuestionIndex(index);
  }, []);

  const handleSelectOption = useCallback((questionId, optionId) => {
    setSelectedOptions((current) => ({
      ...current,
      [questionId]: optionId,
    }));
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentQuestionIndex((current) => Math.max(0, current - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentQuestionIndex((current) => Math.min(questions.length - 1, current + 1));
  }, [questions.length]);

  const renderOptions = useCallback(() => {
    if (!currentQuestion?.options?.length) {
      return null;
    }

    return currentQuestion.options.map((option) => {
      const isSelected = selectedOptions[currentQuestion.id] === option.id;

      return (
        <TouchableOpacity
          key={option.id}
          style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
          onPress={() => handleSelectOption(currentQuestion.id, option.id)}
        >
          <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
            {option.id.toUpperCase()}. {option[language]}
          </Text>
        </TouchableOpacity>
      );
    });
  }, [currentQuestion, handleSelectOption, language, selectedOptions]);

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No questions available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Question Grid</Text>
          <QuestionGrid
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            selectedOptions={selectedOptions}
            onSelectQuestion={handleSelectQuestion}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.subjectLabel}>{currentQuestion.subject.toUpperCase()}</Text>
          <Text style={styles.questionText}>{questionText}</Text>

          <View style={styles.katexContainer}>
            {katexExpression ? (
              <Katex expression={katexExpression} displayMode />
            ) : (
              <Text style={styles.katexFallback}>No equation for this question.</Text>
            )}
          </View>

          <View style={styles.optionsWrap}>{renderOptions()}</View>
        </View>

        <View style={styles.footerRow}>
          <Pressable style={styles.footerButton} onPress={handlePrevious} disabled={currentQuestionIndex === 0}>
            <Text style={styles.footerButtonText}>Previous</Text>
          </Pressable>

          {currentQuestionIndex === questions.length - 1 ? (
            <Pressable style={styles.footerButtonPrimary} onPress={() => onSubmit?.(selectedOptions)}>
              <Text style={styles.footerButtonPrimaryText}>Submit</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.footerButtonPrimary} onPress={handleNext}>
              <Text style={styles.footerButtonPrimaryText}>Next</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E0EA',
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.subheading,
    fontWeight: '800',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E0EA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridButtonAnswered: {
    backgroundColor: '#EEF5FF',
    borderColor: '#AFC8EE',
  },
  gridButtonActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  gridButtonText: {
    color: COLORS.text,
    fontWeight: '700',
  },
  gridButtonTextActive: {
    color: '#FFFFFF',
  },
  subjectLabel: {
    color: COLORS.blue,
    fontWeight: '800',
    marginBottom: 8,
  },
  questionText: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
  },
  katexContainer: {
    minHeight: 84,
    marginTop: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D8E0EA',
    borderRadius: 14,
    backgroundColor: '#F8FBFF',
    justifyContent: 'center',
  },
  katexFallback: {
    color: COLORS.muted,
  },
  optionsWrap: {
    marginTop: 12,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#D8E0EA',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  optionButtonSelected: {
    backgroundColor: '#EEF5FF',
    borderColor: COLORS.blue,
  },
  optionText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: COLORS.blue,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  footerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D8E0EA',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  footerButtonText: {
    color: COLORS.text,
    fontWeight: '700',
  },
  footerButtonPrimary: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.blue,
  },
  footerButtonPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: COLORS.muted,
    fontSize: 16,
  },
});
