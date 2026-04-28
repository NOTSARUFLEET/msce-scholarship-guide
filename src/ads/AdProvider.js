import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import mobileAds, {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  MaxAdContentRating,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

export const ADMOB = {
  appId: 'ca-app-pub-3690626884597677~5724718559',
  publisherId: 'pub-3690626884597677',
  bannerId: 'ca-app-pub-3690626884597677/7233241340',
  interstitialId: 'ca-app-pub-3690626884597677/4478852971',
  rewardedId: 'ca-app-pub-3690626884597677/8614057037',
};

const AdContext = createContext(null);

const interstitial = InterstitialAd.createForAdRequest(ADMOB.interstitialId, {
  requestNonPersonalizedAdsOnly: true,
});

const rewarded = RewardedAd.createForAdRequest(ADMOB.rewardedId, {
  requestNonPersonalizedAdsOnly: true,
});

export function AdProvider({ children }) {
  const rewardResolverRef = useRef(null);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);

  useEffect(() => {
    mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
      testDeviceIdentifiers: [],
    });

    mobileAds().initialize();

    const unsubInterstitialLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialLoaded(true);
    });

    const unsubInterstitialClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialLoaded(false);
      interstitial.load();
    });

    const unsubInterstitialError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
      setInterstitialLoaded(false);
      interstitial.load();
    });

    const unsubRewardLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setRewardedLoaded(true);
    });

    const unsubRewardEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      if (rewardResolverRef.current) {
        rewardResolverRef.current(true);
        rewardResolverRef.current = null;
      }
    });

    const unsubRewardClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setRewardedLoaded(false);
      rewarded.load();
    });

    const unsubRewardError = rewarded.addAdEventListener(AdEventType.ERROR, () => {
      if (rewardResolverRef.current) {
        rewardResolverRef.current(false);
        rewardResolverRef.current = null;
      }
      setRewardedLoaded(false);
      rewarded.load();
    });

    interstitial.load();
    rewarded.load();

    return () => {
      unsubInterstitialLoaded();
      unsubInterstitialClosed();
      unsubInterstitialError();
      unsubRewardLoaded();
      unsubRewardEarned();
      unsubRewardClosed();
      unsubRewardError();
    };
  }, []);

  const value = useMemo(
    () => ({
      interstitialLoaded,
      rewardedLoaded,
      async showInterstitialAfterSubmission() {
        if (!interstitialLoaded) {
          interstitial.load();
          return false;
        }
        await interstitial.show();
        return true;
      },
      async unlockRewardedSolution() {
        if (!rewardedLoaded) {
          rewarded.load();
          return false;
        }

        return new Promise(async (resolve) => {
          rewardResolverRef.current = resolve;
          try {
            await rewarded.show();
          } catch (error) {
            rewardResolverRef.current = null;
            resolve(false);
            rewarded.load();
          }
        });
      },
    }),
    [interstitialLoaded, rewardedLoaded],
  );

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}

export function useAds() {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used inside AdProvider');
  }
  return context;
}

export function ScreenBannerAd() {
  return <BannerAd unitId={ADMOB.bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />;
}
