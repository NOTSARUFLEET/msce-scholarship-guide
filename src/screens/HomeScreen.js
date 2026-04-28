import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { ScreenBannerAd } from '../ads/AdProvider';
import { COLORS, SHADOW, TYPOGRAPHY } from '../constants/theme';

const COPY = {
  title: { en: 'MSCE SCHOLARSHIP GUIDE', mr: 'एमएससीई शिष्यवृत्ती मार्गदर्शक' },
  subtitle: {
    en: 'Teacher-recommended bilingual preparation for Std 4th and Std 7th.',
    mr: 'इयत्ता ४ थी आणि ७ वी साठी शिक्षक-शिफारस केलेली द्विभाषिक तयारी.',
  },
  quickStart: { en: 'Quick Start', mr: 'जलद सुरुवात' },
  std4: { en: 'Open Std 4 Mock Tests', mr: 'इयत्ता ४ थी मॉक टेस्ट उघडा' },
  std7: { en: 'Open Std 7 Mock Tests', mr: 'इयत्ता ७ वी मॉक टेस्ट उघडा' },
  features: { en: 'Why Teachers Recommend It', mr: 'शिक्षक का शिफारस करतात' },
  bullet1: {
    en: 'Full 90-minute paper simulation for both Paper 1 and Paper 2.',
    mr: 'पेपर १ आणि पेपर २ साठी पूर्ण ९० मिनिटांची सराव परीक्षा.',
  },
  bullet2: {
    en: 'Instant English-Marathi switching without losing progress.',
    mr: 'प्रगती न गमावता त्वरित इंग्रजी-मराठी बदल.',
  },
  bullet3: {
    en: 'Subject mastery and weak-topic tracking for parents.',
    mr: 'पालकांसाठी विषय प्रभुत्व आणि कमकुवत विषय विश्लेषण.',
  },
};

function LanguageFab() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Pressable style={styles.fab} onPress={toggleLanguage}>
      <Text style={styles.fabText}>{language === 'en' ? 'EN' : 'MR'}</Text>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const marathiText = language === 'mr';

  return (
    <SafeAreaView style={styles.safeArea}>
      <LanguageFab />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 110 + insets.bottom }]}>
        <View style={styles.heroCard}>
          <Text style={[styles.heroTitle, marathiText && styles.heroTitleMr]}>{t(COPY.title)}</Text>
          <Text style={[styles.heroSubtitle, marathiText && styles.heroSubtitleMr]}>{t(COPY.subtitle)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t(COPY.quickStart)}</Text>
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('Mock Tests', { screen: 'Mock Tests', params: { initialGrade: 4 } })}
          >
            <Text style={styles.actionButtonText}>{t(COPY.std4)}</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('Mock Tests', { screen: 'Mock Tests', params: { initialGrade: 7 } })}
          >
            <Text style={styles.actionButtonText}>{t(COPY.std7)}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t(COPY.features)}</Text>
          <Text style={[styles.bulletText, marathiText && styles.bulletTextMr]}>• {t(COPY.bullet1)}</Text>
          <Text style={[styles.bulletText, marathiText && styles.bulletTextMr]}>• {t(COPY.bullet2)}</Text>
          <Text style={[styles.bulletText, marathiText && styles.bulletTextMr]}>• {t(COPY.bullet3)}</Text>
        </View>
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
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    ...SHADOW,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  heroTitle: {
    color: COLORS.blue,
    fontSize: 28,
    fontWeight: '800',
  },
  heroTitleMr: {
    fontSize: 30,
    lineHeight: 40,
  },
  heroSubtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  heroSubtitleMr: {
    fontSize: 17,
    lineHeight: 26,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...SHADOW,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.heading,
    fontWeight: '800',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  bulletText: {
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 6,
  },
  bulletTextMr: {
    fontSize: 16,
    lineHeight: 26,
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
