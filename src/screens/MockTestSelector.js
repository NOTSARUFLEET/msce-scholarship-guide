import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { ScreenBannerAd } from '../ads/AdProvider';
import { getMockTestCatalogForGrade } from '../data/QuestionBank';
import { COLORS, SHADOW, TYPOGRAPHY } from '../constants/theme';

const COPY = {
  title: { en: 'Mock Tests', mr: 'मॉक टेस्ट' },
  subtitle: {
    en: 'Select grade and launch full-length scholarship papers.',
    mr: 'इयत्ता निवडा आणि पूर्ण शिष्यवृत्ती पेपर सुरू करा.',
  },
  std4: { en: 'Std 4th', mr: 'इयत्ता ४ थी' },
  std7: { en: 'Std 7th', mr: 'इयत्ता ७ वी' },
};

function LanguageFab() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Pressable style={styles.fab} onPress={toggleLanguage}>
      <Text style={styles.fabText}>{language === 'en' ? 'EN' : 'MR'}</Text>
    </Pressable>
  );
}

function TestCard({ item, onOpen, language }) {
  const marathiText = language === 'mr';

  return (
    <View style={styles.testCard}>
      <Text style={[styles.testTitle, marathiText && styles.testTitleMr]}>{item.title[language]}</Text>
      <Text style={[styles.testMeta, marathiText && styles.testMetaMr]}>{item.paperMeta[language]}</Text>
      <Pressable style={styles.openButton} onPress={() => onOpen(item)}>
        <Text style={styles.openButtonText}>{language === 'en' ? 'Open Test' : 'टेस्ट उघडा'}</Text>
      </Pressable>
    </View>
  );
}

export default function MockTestSelector({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();
  const [grade, setGrade] = useState(route.params?.initialGrade ?? 4);
  const catalog = useMemo(() => getMockTestCatalogForGrade(grade), [grade]);

  const openTest = (item) => {
    navigation.navigate('TestRunner', {
      grade,
      paper: item.paper,
      testIndex: item.testIndex,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LanguageFab />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 110 + insets.bottom }]}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>{t(COPY.title)}</Text>
          <Text style={[styles.headerSubtitle, language === 'mr' && styles.headerSubtitleMr]}>{t(COPY.subtitle)}</Text>
        </View>

        <View style={styles.gradeRow}>
          <Pressable
            style={[styles.gradeButton, grade === 4 && styles.gradeButtonActive]}
            onPress={() => setGrade(4)}
          >
            <Text style={[styles.gradeButtonText, grade === 4 && styles.gradeButtonTextActive]}>{t(COPY.std4)}</Text>
          </Pressable>
          <Pressable
            style={[styles.gradeButton, grade === 7 && styles.gradeButtonActive]}
            onPress={() => setGrade(7)}
          >
            <Text style={[styles.gradeButtonText, grade === 7 && styles.gradeButtonTextActive]}>{t(COPY.std7)}</Text>
          </Pressable>
        </View>

        {catalog.map((item) => (
          <TestCard key={item.id} item={item} onOpen={openTest} language={language} />
        ))}
      </ScrollView>

      <View style={[styles.bannerDock, { paddingBottom: insets.bottom }]}>
        <ScreenBannerAd />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    ...SHADOW,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  headerTitle: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.heading,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: COLORS.muted,
    marginTop: 8,
    lineHeight: 22,
  },
  headerSubtitleMr: {
    fontSize: 16,
    lineHeight: 26,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gradeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  gradeButtonActive: {
    borderColor: COLORS.blue,
    backgroundColor: '#EEF5FF',
  },
  gradeButtonText: {
    color: COLORS.text,
    fontWeight: '700',
  },
  gradeButtonTextActive: {
    color: COLORS.blue,
  },
  testCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...SHADOW,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  testTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 16,
  },
  testTitleMr: {
    fontSize: 18,
    lineHeight: 28,
  },
  testMeta: {
    color: COLORS.muted,
    marginTop: 6,
    marginBottom: 12,
  },
  testMetaMr: {
    fontSize: 16,
    lineHeight: 24,
  },
  openButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  openButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  bannerDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 92,
    zIndex: 10,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
    shadowOpacity: 0.14,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
