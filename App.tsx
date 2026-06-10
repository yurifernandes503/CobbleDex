import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/routes/AppNavigator';
import { LocaleProvider } from './src/context/LocaleContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { TeamProvider } from './src/context/TeamContext';
import { palette } from './src/styles/colors';
import { isWeb, webShellStyles } from './src/utils/platformLayout';

export default function App() {
  const web = isWeb();

  return (
    <View style={[web && webShellStyles.outer, { flex: 1, backgroundColor: palette.background }]}>
      <View style={[{ flex: 1 }, web && webShellStyles.inner]}>
        <SafeAreaProvider>
          <LocaleProvider>
            <SettingsProvider>
              <FavoritesProvider>
                <TeamProvider>
                  <StatusBar style="light" />
                  <AppNavigator />
                </TeamProvider>
              </FavoritesProvider>
            </SettingsProvider>
          </LocaleProvider>
        </SafeAreaProvider>
      </View>
    </View>
  );
}
