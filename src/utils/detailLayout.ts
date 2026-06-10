import { Dimensions, Platform } from 'react-native';

export function getDetailSpriteMetrics(windowWidth: number) {
  const web = Platform.OS === 'web';
  if (web) {
    const imageWidth = Math.min(240, Math.max(160, windowWidth - 56));
    const imageHeight = Math.min(220, Math.round(imageWidth * 0.92));
    return {
      imageWidth,
      imageHeight,
      glowDiameter: Math.min(280, imageWidth * 1.15),
      wrapMinHeight: imageHeight + 28,
    };
  }
  const imageWidth = Math.min(windowWidth * 0.56, 300);
  const imageHeight = Math.min(windowWidth * 0.42, 280);
  return {
    imageWidth,
    imageHeight,
    glowDiameter: Math.min(windowWidth * 0.62, imageWidth * 1.1),
    wrapMinHeight: imageHeight + 36,
  };
}

export function getWindowWidth(): number {
  return Dimensions.get('window').width;
}
