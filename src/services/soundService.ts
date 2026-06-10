import { Audio } from 'expo-av';

export type SoundName = 'tap' | 'select' | 'favorite' | 'success';

const SOUND_FILES: Record<SoundName, number> = {
  tap: require('../../assets/sounds/tap.wav'),
  select: require('../../assets/sounds/select.wav'),
  favorite: require('../../assets/sounds/favorite.wav'),
  success: require('../../assets/sounds/success.wav'),
};

let initialized = false;
let globalEnabled = true;

export async function initSoundService(): Promise<void> {
  if (initialized) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
    initialized = true;
  } catch {
    // Audio unavailable on some environments
  }
}

export function setSoundEnabled(enabled: boolean): void {
  globalEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return globalEnabled;
}

export async function playSound(name: SoundName): Promise<void> {
  if (!globalEnabled) return;
  if (!initialized) await initSoundService();

  try {
    const { sound } = await Audio.Sound.createAsync(SOUND_FILES[name], {
      shouldPlay: true,
      volume: 0.65,
    });
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch {
    // Ignore playback errors
  }
}
