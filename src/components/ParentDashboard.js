import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';
import { COLORS, SHADOW, TYPOGRAPHY } from '../constants/theme';

const STORAGE_KEY = 'scholarship_titan_parent_analytics_v1';

const COPY = {
  title: { en: 'Subject Mastery Dashboard', mr: 'विषय प्रभुत्व डॅशबोर्ड' },
  subtitle: {
    en: 'Academic progress, completion trends, and recent mock history',
    mr: 'शैक्षणिक प्रगती, पूर्णता प्रवाह आणि अलीकडील मॉक इतिहास',
  },
  math: { en: 'Math Completion', mr: 'गणित पूर्णता' },
  iq: { en: 'IQ Completion', mr: 'बुद्धिमत्ता पूर्णता' },
  marathi: { en: 'Marathi Completion', mr: 'मराठी पूर्णता' },
  english: { en: 'English Completion', mr: 'इंग्रजी पूर्णता' },
  time: { en: 'Avg Time Spent', mr: 'सरासरी वापरलेला वेळ' },
  weakest: { en: 'Weakest Topic Alert', mr: 'कमकुवत विषय अलर्ट' },
  attempts: { en: 'Total Attempts', mr: 'एकूण प्रयत्न' },
  history: { en: 'Mock Test History', mr: 'मॉक टेस्ट इतिहास' },
  date: { en: 'Date', mr: 'दिनांक' },
  score: { en: 'Score', mr: 'गुण' },
  duration: { en: 'Time Taken', mr: 'लागलेला वेळ' },
};

function average(values) {
  if (!values.length) {
    return 0;
  }
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function formatDate(value) {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  return date.toLocaleDateString('en-GB');
}

function ProgressBar({ label, value }) {
  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.progressValue}>{value}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(value, 100))}%` }]} />
      </View>
    </View>
  );
}

export default function ParentDashboard() {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      setRecords(JSON.parse(raw ?? '[]'));
    });
  }, []);

  const metrics = useMemo(() => {
    const mathAccuracy = average(records.map((item) => item.mathAccuracy ?? 0));
    const iqAccuracy = average(records.map((item) => item.iqAccuracy ?? 0));
    const marathiAccuracy = average(records.map((item) => item.marathiAccuracy ?? 0));
    const englishAccuracy = average(records.map((item) => item.englishAccuracy ?? 0));
    const avgTime = average(records.map((item) => item.timeSpentMinutes ?? 0));
    const weakestTopic = records.length ? records[records.length - 1].weakestTopic : 'N/A';
    const history = records.slice(-10).reverse();

    return {
      mathAccuracy,
      iqAccuracy,
      marathiAccuracy,
      englishAccuracy,
      avgTime,
      weakestTopic,
      history,
    };
  }, [records]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{t(COPY.title)}</Text>
          <Text style={styles.heroSubtitle}>{t(COPY.subtitle)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t(COPY.title)}</Text>
          <ProgressBar label={t(COPY.math)} value={metrics.mathAccuracy} />
          <ProgressBar label={t(COPY.iq)} value={metrics.iqAccuracy} />
          <ProgressBar label={t(COPY.marathi)} value={metrics.marathiAccuracy} />
          <ProgressBar label={t(COPY.english)} value={metrics.englishAccuracy} />
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.metricTile}>
            <Text style={styles.label}>{t(COPY.time)}</Text>
            <Text style={styles.metricValue}>{metrics.avgTime}m</Text>
          </View>
          <View style={styles.metricTile}>
            <Text style={styles.label}>{t(COPY.attempts)}</Text>
            <Text style={styles.metricValue}>{records.length}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t(COPY.weakest)}</Text>
          <Text style={styles.alertText}>{metrics.weakestTopic}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t(COPY.history)}</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDate]}>{t(COPY.date)}</Text>
            <Text style={[styles.tableHeaderText, styles.colScore]}>{t(COPY.score)}</Text>
            <Text style={[styles.tableHeaderText, styles.colTime]}>{t(COPY.duration)}</Text>
          </View>
          {metrics.history.map((item) => (
            <View key={`${item.id}-${item.completedAt}`} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDate]}>{formatDate(item.completedAt)}</Text>
              <Text style={[styles.tableCell, styles.colScore]}>
                {item.score}/{item.total}
              </Text>
              <Text style={[styles.tableCell, styles.colTime]}>{item.timeSpentMinutes}m</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 16,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D7DEE7',
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: COLORS.muted,
    lineHeight: 22,
    marginTop: 8,
  },
  label: {
    color: COLORS.muted,
    fontSize: TYPOGRAPHY.caption,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D7DEE7',
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.heading,
    fontWeight: '800',
    marginBottom: 10,
  },
  progressCard: {
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressValue: {
    color: COLORS.blue,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#EDF2F7',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.blue,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D7DEE7',
  },
  metricValue: {
    marginTop: 8,
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
  },
  alertText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 18,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D7DEE7',
  },
  tableHeaderText: {
    color: COLORS.muted,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '800',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  tableCell: {
    color: COLORS.text,
    fontWeight: '600',
  },
  colDate: {
    flex: 1.2,
  },
  colScore: {
    flex: 0.8,
  },
  colTime: {
    flex: 0.8,
  },
});
