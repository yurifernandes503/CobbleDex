import {
  Biome,
  Evolution,
  Move,
  Pokemon,
  PokemonType,
  Rarity,
  SpawnTime,
} from './pokemon';
import { GEN1_ENTRIES } from './gen1Base';

const BIOMES: Biome[] = [
  'forest', 'plains', 'mountain', 'cave', 'ocean', 'river',
  'desert', 'swamp', 'tundra', 'volcanic', 'jungle', 'meadow',
];

const SPAWN_TIMES: SpawnTime[] = ['day', 'night', 'dawn', 'dusk', 'any'];

const MOVE_POOLS: Record<PokemonType, string[]> = {
  normal: ['Tackle', 'Quick Attack', 'Body Slam', 'Hyper Beam', 'Swift'],
  fire: ['Ember', 'Flamethrower', 'Fire Blast', 'Heat Wave', 'Flame Charge'],
  water: ['Water Gun', 'Surf', 'Hydro Pump', 'Aqua Jet', 'Bubble Beam'],
  grass: ['Vine Whip', 'Razor Leaf', 'Solar Beam', 'Leech Seed', 'Giga Drain'],
  electric: ['Thunder Shock', 'Thunderbolt', 'Thunder', 'Spark', 'Discharge'],
  ice: ['Ice Beam', 'Blizzard', 'Powder Snow', 'Icy Wind', 'Aurora Beam'],
  fighting: ['Karate Chop', 'Brick Break', 'Close Combat', 'Low Kick', 'Cross Chop'],
  poison: ['Poison Sting', 'Sludge Bomb', 'Toxic', 'Venoshock', 'Acid Spray'],
  ground: ['Earthquake', 'Dig', 'Mud Shot', 'Bulldoze', 'Magnitude'],
  flying: ['Gust', 'Wing Attack', 'Air Slash', 'Brave Bird', 'Aerial Ace'],
  psychic: ['Confusion', 'Psychic', 'Psybeam', 'Future Sight', 'Zen Headbutt'],
  bug: ['Bug Bite', 'X-Scissor', 'Signal Beam', 'Pin Missile', 'Struggle Bug'],
  rock: ['Rock Throw', 'Stone Edge', 'Rock Slide', 'Ancient Power', 'Power Gem'],
  ghost: ['Shadow Ball', 'Lick', 'Hex', 'Night Shade', 'Phantom Force'],
  dragon: ['Dragon Breath', 'Dragon Pulse', 'Outrage', 'Draco Meteor', 'Twister'],
  dark: ['Bite', 'Crunch', 'Dark Pulse', 'Foul Play', 'Night Slash'],
  steel: ['Iron Tail', 'Flash Cannon', 'Metal Claw', 'Bullet Punch', 'Steel Wing'],
  fairy: ['Fairy Wind', 'Moonblast', 'Dazzling Gleam', 'Play Rough', 'Draining Kiss'],
};

const DESCRIPTIONS: Record<PokemonType, string[]> = {
  normal: [
    'A versatile Cobblemon often found near villages and trails.',
    'Adapts quickly to new biomes and travels in small groups.',
  ],
  fire: [
    'Thrives near lava flows and warm volcanic biomes in the overworld.',
    'Its internal heat helps it survive harsh mountain nights.',
  ],
  water: [
    'Commonly spotted along rivers, beaches, and shallow ocean reefs.',
    'Uses currents to migrate between freshwater and coastal zones.',
  ],
  grass: [
    'Camouflages among tall grass and dense forest undergrowth.',
    'Draws nutrients from rich soil found in jungle and meadow biomes.',
  ],
  electric: [
    'Static builds during storms; more active when thunder rolls.',
    'Often nests near redstone-powered structures left by players.',
  ],
  ice: [
    'Prefers snowy peaks and frozen shores at high altitude.',
    'Slow metabolism lets it conserve energy in tundra biomes.',
  ],
  fighting: [
    'Trains in rocky arenas and spars with others of its line.',
    'Territorial near mountain passes and savanna outcrops.',
  ],
  poison: [
    'Favors swamp edges and caves with toxic flora.',
    'Marks territory with subtle spores detectable at night.',
  ],
  ground: [
    'Burrows through desert and badlands terrain with ease.',
    'Sensitive to vibrations; emerges after rainfall.',
  ],
  flying: [
    'Soars above plains at dawn, scanning for berries and prey.',
    'Roosts on cliffs and tall trees when storms approach.',
  ],
  psychic: [
    'Rarely seen; drawn to mystical ruins and strong moonlight.',
    'Exhibits curious behavior near ancient structures.',
  ],
  bug: [
    'Active in warm forests; attracted to flowering blocks.',
    'Completes metamorphosis cycles tied to seasonal weather.',
  ],
  rock: [
    'Camouflages as boulders in caves and mountain faces.',
    'Hardens its shell when sensing nearby predators.',
  ],
  ghost: [
    'Appears in abandoned mines and foggy nights.',
    'Phases through thin walls when startled.',
  ],
  dragon: [
    'Elusive apex species linked to deep ocean and sky biomes.',
    'Legends say it descends during rare celestial events.',
  ],
  dark: [
    'Nocturnal hunter with keen senses in dim light.',
    'Stalks forest edges when other Cobblemon sleep.',
  ],
  steel: [
    'Metallic hide reflects torchlight in deep caves.',
    'Often found near ore deposits and industrial ruins.',
  ],
  fairy: [
    'Drawn to flower forests and moonlit clearings.',
    'Gentle temperament unless its grove is threatened.',
  ],
};

function hash(n: number, salt: number): number {
  return ((n * 9301 + 49297 + salt) % 233280) / 233280;
}

function stat(id: number, base: number, spread: number): number {
  const h = hash(id, base);
  return Math.min(255, Math.max(20, Math.round(base + h * spread)));
}

function pick<T>(arr: T[], id: number, salt: number): T {
  return arr[Math.floor(hash(id, salt) * arr.length)]!;
}

function getRarity(id: number): Rarity {
  if (id >= 144) return 'legendary';
  if (id >= 131 && id <= 143) return 'epic';
  if (id % 23 === 0 || id % 19 === 0) return 'rare';
  if (id % 7 === 0) return 'uncommon';
  return 'common';
}

function buildMoves(types: PokemonType[], id: number): Move[] {
  const primary = types[0];
  const secondary = types[1];
  const pool = [
    ...MOVE_POOLS[primary],
    ...(secondary ? MOVE_POOLS[secondary] : []),
  ];
  const unique = [...new Set(pool)].slice(0, 8);
  return unique.slice(0, 5 + (id % 3)).map((name, i) => ({
    name,
    type: i % 2 === 0 ? primary : (secondary ?? primary),
    power: 40 + ((id * 7 + i * 13) % 80),
    accuracy: 85 + ((id + i * 3) % 16),
    level: 1 + i * (4 + (id % 3)),
  }));
}

function buildEvolutions(id: number): Evolution[] {
  const chain: Evolution[] = [];
  const idx = id - 1;
  const current = GEN1_ENTRIES[idx];
  const next = GEN1_ENTRIES[idx + 1];

  if (id === 133) {
    chain.push(
      { id: 134, name: 'Vaporeon', level: undefined, item: 'Water Stone' },
      { id: 135, name: 'Jolteon', level: undefined, item: 'Thunder Stone' },
      { id: 136, name: 'Flareon', level: undefined, item: 'Fire Stone' },
    );
    return chain;
  }

  if (current && next && id < 151) {
    const sharesLine =
      next[1] === current[1] ||
      (current[2] && next[2] === current[2]) ||
      (id >= 147 && id <= 149);
    if (sharesLine) {
      chain.push({
        id: id + 1,
        name: next[0],
        level: id % 7 === 0 ? undefined : 16 + (id % 4) * 6,
        item: id % 11 === 0 ? 'Evolution Stone' : undefined,
        condition: id % 13 === 0 ? 'High friendship' : undefined,
      });
    }
  }

  return chain;
}

function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function buildGen1Pokemon(): Pokemon[] {
  return GEN1_ENTRIES.map(([name, primary, secondary], index) => {
    const id = index + 1;
    const types = [primary, secondary].filter(Boolean) as PokemonType[];
    const biome = pick(BIOMES, id, 1);
    const spawnTime = pick(SPAWN_TIMES, id, 2);
    const rarity = getRarity(id);
    const descList = DESCRIPTIONS[primary];

    return {
      id,
      name,
      image: spriteUrl(id),
      primaryType: primary,
      secondaryType: secondary,
      hp: stat(id, 45, 80),
      attack: stat(id, 50, 90),
      defense: stat(id, 48, 85),
      speed: stat(id, 40, 95),
      spawnBiome: biome,
      spawnTime,
      rarity,
      evolutions: buildEvolutions(id),
      moves: buildMoves(types, id),
      description: descList[id % descList.length]!,
    };
  });
}

export const POKEMON_DATABASE: Pokemon[] = buildGen1Pokemon();
