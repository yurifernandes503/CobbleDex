import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { Biome, PokemonType } from '../data/pokemon';

export type RootStackParamList = {
  Splash: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  PokemonDetail: { id: number };
  TeamPicker: { slotIndex: number };
};

export type MainTabParamList = {
  Home: undefined;
  Pokedex: { search?: string; type?: PokemonType; biome?: Biome } | undefined;
  TeamBuilder: undefined;
  Favorites: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
