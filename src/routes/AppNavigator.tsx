import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View, Platform } from 'react-native';
import { SplashScreen } from '../screens/SplashScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PokedexScreen } from '../screens/PokedexScreen';
import { TeamBuilderScreen } from '../screens/TeamBuilderScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { PokemonDetailScreen } from '../screens/PokemonDetailScreen';
import { TeamPickerScreen } from '../screens/TeamPickerScreen';
import { RootStackParamList, MainTabParamList } from './types';
import { palette } from '../styles/colors';
import { playSound, isSoundEnabled } from '../services/soundService';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: palette.accent,
    background: palette.background,
    card: palette.backgroundElevated,
    text: palette.text,
    border: palette.border,
    notification: palette.accentSecondary,
  },
};

function TabBarGlyph({ glyph, focused }: { glyph: string; focused: boolean }) {
  return (
    <View style={[styles.glyphWrap, focused && styles.glyphWrapActive]}>
      <Text style={[styles.glyph, focused && styles.glyphActive]}>{glyph}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
      screenListeners={{
        tabPress: () => {
          if (isSoundEnabled()) playSound('tap');
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabBarGlyph glyph="⌂" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Pokedex"
        component={PokedexScreen}
        options={{
          tabBarLabel: 'Pokédex',
          tabBarIcon: ({ focused }) => <TabBarGlyph glyph="◈" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="TeamBuilder"
        component={TeamBuilderScreen}
        options={{
          tabBarLabel: 'Team',
          tabBarIcon: ({ focused }) => <TabBarGlyph glyph="⚔" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ focused }) => <TabBarGlyph glyph="★" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.background },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="PokemonDetail"
          component={PokemonDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="TeamPicker"
          component={TeamPickerScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(9, 13, 22, 0.94)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 229, 255, 0.22)',
    minHeight: Platform.OS === 'ios' ? 84 : 72,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 10,
    elevation: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#00e5ff',
        shadowOpacity: 0.18,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -6 },
      },
      android: {},
      default: {},
    }),
  },
  tabLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  tabItem: { paddingTop: 4 },
  glyphWrap: {
    minWidth: 44,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  glyphWrapActive: {
    borderColor: 'rgba(0, 229, 255, 0.55)',
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    shadowColor: '#00e5ff',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  glyph: { fontSize: 18, color: palette.textMuted },
  glyphActive: { color: palette.accent },
});
