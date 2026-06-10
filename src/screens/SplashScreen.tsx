import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../components/ui/AppText';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { palette } from '../styles/colors';
import { theme } from '../styles/theme';
import { RootStackScreenProps } from '../routes/types';
import { playSound, initSoundService } from '../services/soundService';

const { width } = Dimensions.get('window');

export function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const ballRotation = useSharedValue(0);
  const ballScale = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    initSoundService();
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSequence(
      withTiming(1.08, { duration: 500, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 200 })
    );
    ballScale.value = withDelay(300, withTiming(1, { duration: 500 }));
    ballRotation.value = withDelay(
      400,
      withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1)
    );
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    const timer = setTimeout(() => {
      playSound('success');
      navigation.replace('Main');
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigation]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const ballStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ballScale.value }, { rotate: `${ballRotation.value}deg` }],
    opacity: ballScale.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + shimmer.value * 0.5,
  }));

  return (
    <LinearGradient colors={['#050810', '#0a0e17', '#12182a']} style={styles.container}>
      <Animated.View style={[styles.glowOrb, shimmerStyle]} />
      <Animated.View style={ballStyle}>
        <View style={styles.pokeball}>
          <View style={styles.ballTop} />
          <View style={styles.ballBottom} />
          <View style={styles.ballCenter}>
            <View style={styles.ballButton} />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <AppText variant="hero" color={palette.accent} style={styles.logo}>
          Cobble
        </AppText>
        <AppText variant="hero" color={palette.white} style={styles.logoDex}>
          Dex
        </AppText>
        <AppText variant="caption" muted style={styles.tagline}>
          Cobblemon Companion
        </AppText>
      </Animated.View>
      <View style={styles.loader}>
        <LoadingSpinner size={40} color={palette.accent} />
        <AppText variant="caption" muted style={styles.loadingText}>
          Loading database...
        </AppText>
      </View>
      <View style={styles.pixelBorder} />
    </LinearGradient>
  );
}

const BALL = Math.min(width * 0.35, 140);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOrb: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: palette.accent,
    opacity: 0.15,
    top: '25%',
  },
  pokeball: {
    width: BALL,
    height: BALL,
    borderRadius: BALL / 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
    borderWidth: 4,
    borderColor: palette.white,
    ...theme.shadows.glow(palette.danger),
  },
  ballTop: {
    flex: 1,
    backgroundColor: palette.danger,
  },
  ballBottom: {
    flex: 1,
    backgroundColor: palette.white,
  },
  ballCenter: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 8,
    marginTop: -4,
    backgroundColor: palette.background,
  },
  ballButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 36,
    height: 36,
    marginLeft: -18,
    marginTop: -18,
    borderRadius: 18,
    backgroundColor: palette.white,
    borderWidth: 4,
    borderColor: palette.background,
  },
  logoWrap: { alignItems: 'center' },
  logo: { letterSpacing: 4 },
  logoDex: { marginTop: -8, letterSpacing: 6 },
  tagline: { marginTop: theme.spacing.sm, letterSpacing: 2 },
  loader: { position: 'absolute', bottom: 80, alignItems: 'center', gap: theme.spacing.md },
  loadingText: { letterSpacing: 1 },
  pixelBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: palette.accent,
    opacity: 0.6,
  },
});
