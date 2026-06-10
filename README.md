# CobbleDex

A modern React Native companion app for **Cobblemon** players — mobile Pokédex and team builder with a dark gamer aesthetic.

## Tech stack

- React Native + Expo
- React Navigation (stack + tabs)
- Axios (optional PokeAPI enrichment)
- AsyncStorage (favorites, recent, teams)
- Reanimated animations
- TypeScript + clean `src/` architecture

## Features

- **Splash** — animated logo and Pokéball-inspired loader
- **Home** — search, shortcuts (Pokédex / Team / Favorites / Spawns), featured & rare rows, biome explorer, types, recently viewed
- **Web layout** — centered max-width column so the UI stays phone-sized in the browser (`src/utils/platformLayout.ts`, `App.tsx`)
- **Pokédex** — full Gen I list (151), filters (type, biome, rarity), favorites
- **Detail** — stats, Cobblemon-style spawn profile (dimension, weather, drops, blocks, capture tip), moves, evolutions, type matchups (tabbed)
- **Team Builder** — 6-slot teams, stacked-weakness map, type-stacking warnings, coach suggestions, persistence
- **Favorites** — offline via AsyncStorage
- **Home search** — jumps to Pokédex with query, type, or biome pre-applied
- **UI sounds** — optional SFX (toggle on Home); haptics on detail screen
- **Branded icon** — generated dark/cyan CobbleDex artwork (`tools/generate-icon.js`)

## Getting started

```bash
cd CobbleDex
npm install
npx expo start
```

Use Expo Go on your device or press `a` / `i` for Android / iOS emulator.

## Project structure

```
src/
├── assets/
├── components/     # UI, Pokémon cards, team slots
├── screens/
├── routes/
├── services/
├── data/           # Gen I database + type chart
├── hooks/
├── styles/
├── context/
└── utils/
```

- **Web layout** — centered column (`src/utils/platformLayout.ts`, wrapped in `App.tsx`) so the UI does not stretch on desktop browsers.

## Regenerate assets

```bash
node tools/generate-sounds.js
node tools/generate-icon.js
```

## Data

All 151 Generation I Cobblemon are included locally in `src/data/gen1Database.ts` with mock spawn/evolution/move data suitable for Cobblemon-style gameplay. Sprites load from the public PokeAPI sprites CDN (requires network for images; all text data works offline).

## License

Fan companion project — not affiliated with Nintendo, Mojang, or Cobblemon.
