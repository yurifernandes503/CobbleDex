import { Platform, StyleSheet, ViewStyle } from 'react-native';

/** Central column width on web — reads like a centered phone / companion app */
export const WEB_MAX_CONTENT_WIDTH = 500;

export function isWeb(): boolean {
  return Platform.OS === 'web';
}

export const webShellStyles = StyleSheet.create({
  outer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#050810',
  } as ViewStyle,
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: WEB_MAX_CONTENT_WIDTH,
    overflow: 'hidden',
    backgroundColor: '#0a0e17',
  } as ViewStyle,
});
