import { Biome, Pokemon, PokemonType } from '../data/pokemon';
import { biomeLabels } from '../styles/colors';
import type { Locale } from '../locales/messages';

export type MinecraftDimension = 'Overworld' | 'Nether' | 'The End';

export interface CobblemonWorldInfo {
  dimension: MinecraftDimension;
  preferredWeather: string;
  possibleDrops: string[];
  captureTip: string;
  spawnEnvironment: string;
}

function hashPick<T>(id: number, salt: number, options: T[]): T {
  const h = ((id * 9301 + salt * 49297) % 233280) / 233280;
  return options[Math.floor(h * options.length)]!;
}

export function getDimensionForPokemon(p: Pokemon): MinecraftDimension {
  const t = p.primaryType;
  if (t === 'fire' || t === 'dark' || t === 'poison') {
    return hashPick(p.id, 11, ['Overworld', 'Nether', 'Overworld']);
  }
  if (t === 'ghost' || t === 'psychic' || t === 'dragon') {
    return hashPick(p.id, 17, ['Overworld', 'The End', 'Overworld']);
  }
  if (t === 'ice' && p.spawnBiome === 'tundra') {
    return hashPick(p.id, 19, ['Overworld', 'The End']);
  }
  return 'Overworld';
}

const WEATHER_BY_TYPE: Partial<Record<PokemonType, string[]>> = {
  fire: ['Clear skies', 'Heat waves', 'Dry winds'],
  water: ['Rain', 'Drizzle', 'Humid air'],
  electric: ['Thunderstorms', 'Overcast', 'Charged air'],
  ice: ['Snow', 'Blizzards', 'Freezing fog'],
  grass: ['Light rain', 'Pollen breeze', 'Warm sun'],
  ground: ['Dust storms', 'Clear', 'Post-rain mud'],
  rock: ['Clear', 'Sandstorms', 'Windy ridges'],
  flying: ['Windy', 'Clear dawn', 'Migratory clouds'],
  ghost: ['Fog', 'New moon', 'Eerie calm'],
  dark: ['New moon', 'Overcast night', 'Pitch black'],
  dragon: ['Rare aurora', 'Storm fronts', 'Clear high altitude'],
  steel: ['Industrial smog', 'Clear cold', 'Light snow'],
  fairy: ['Flower breeze', 'Starlit calm', 'Light mist'],
  fighting: ['Clear training weather', 'Heat shimmer', 'Windy plains'],
  poison: ['Acid rain (rare)', 'Humid swamp air', 'Stagnant heat'],
  bug: ['Warm humidity', 'Light drizzle', 'Sunny meadows'],
  psychic: ['Still air', 'Strange halos', 'Calm night'],
  normal: ['Typical overworld', 'Seasonal shifts', 'Mild breeze'],
};

const DROP_POOLS: Record<PokemonType, string[]> = {
  normal: ['Leather scrap', 'Bone meal', 'Sweet berries'],
  fire: ['Blaze powder', 'Magma cream', 'Charcoal lump'],
  water: ['Prismarine shard', 'Ink sac', 'Tropical fish'],
  grass: ['Wheat seeds', 'Melon slice', 'Leaf block'],
  electric: ['Redstone dust', 'Glowstone dust', 'Copper ingot'],
  ice: ['Packed ice', 'Snowball', 'Blue ice shard'],
  fighting: ['Iron nugget', 'Leather', 'Quartz'],
  poison: ['Spider eye', 'Fermented spider eye', 'Slime ball'],
  ground: ['Sand', 'Clay ball', 'Flint'],
  flying: ['Feather', 'Phantom membrane', 'Paper'],
  psychic: ['Amethyst shard', 'Ender pearl (rare)', 'Lapis lazuli'],
  bug: ['String', 'Honeycomb', 'Cocoa beans'],
  rock: ['Cobblestone', 'Granite', 'Raw iron'],
  ghost: ['Soul sand', 'Ghast tear (rare)', 'Bone'],
  dragon: ['Dragon breath (rare)', 'Chorus fruit', 'End stone'],
  dark: ['Coal', 'Ink sac', 'Obsidian shard'],
  steel: ['Iron ingot', 'Raw iron', 'Flint and steel fuel'],
  fairy: ['Glow berries', 'Gold nugget', 'Allium'],
};

const BLOCK_HINTS: Record<Biome, string[]> = {
  forest: ['Tall grass patches', 'Oak / dark oak leaf canopies', 'Moss blocks near water'],
  plains: ['Short grass layers', 'Sunflower fields', 'Hay bale farms'],
  mountain: ['Stone peaks', 'Goat horn cliffs', 'Powder snow ledges'],
  cave: ['Deepslate layers', 'Glow lichen', 'Amethyst geodes nearby'],
  ocean: ['Warm ocean coral', 'Kelp forests', 'Seagrass floors'],
  river: ['Clay banks', 'Sugar cane lines', 'Dripstone cavern mouths'],
  desert: ['Sand layers', 'Dead bushes', 'Desert wells'],
  swamp: ['Lily pads', 'Mud / rooted dirt', 'Huge mushrooms'],
  tundra: ['Snow layers', 'Spruce groves', 'Ice spikes (rare)'],
  volcanic: ['Basalt deltas', 'Blackstone fields', 'Lava lakes'],
  jungle: ['Vines', 'Bamboo clusters', 'Melon patches'],
  meadow: ['Bee nests', 'Flower forests', 'Cherry groves'],
};

const WEATHER_BY_TYPE_PT: Partial<Record<PokemonType, string[]>> = {
  fire: ['Céu limpo', 'Ondas de calor', 'Ventos secos'],
  water: ['Chuva', 'Garoa', 'Ar úmido'],
  electric: ['Tempestades', 'Nublado', 'Ar carregado'],
  ice: ['Neve', 'Nevasca', 'Neblina gelada'],
  grass: ['Chuva leve', 'Brisa com pólen', 'Sol morno'],
  ground: ['Tempestades de poeira', 'Claro', 'Lama pós-chuva'],
  rock: ['Claro', 'Tempestades de areia', 'Cristas ventosas'],
  flying: ['Ventania', 'Amanhecer claro', 'Nuvens migratórias'],
  ghost: ['Neblina', 'Lua nova', 'Calma estranha'],
  dark: ['Lua nova', 'Noite nublada', 'Escuridão total'],
  dragon: ['Aurora rara', 'Frentes de tempestade', 'Altitude clara'],
  steel: ['Neblina industrial', 'Frio claro', 'Neve leve'],
  fairy: ['Brisa floral', 'Calma ao luar', 'Névoa leve'],
  fighting: ['Claro para treino', 'Calor tremido', 'Planícies ventosas'],
  poison: ['Chuva ácida (raro)', 'Ar úmido de pântano', 'Calor parado'],
  bug: ['Úmido morno', 'Garoa leve', 'Prados ensolarados'],
  psychic: ['Ar parado', 'Halo estranho', 'Noite calma'],
  normal: ['Overworld típico', 'Mudanças de estação', 'Brisa suave'],
};

const BLOCK_HINTS_PT: Record<Biome, string[]> = {
  forest: ['Manchas de grama alta', 'Dosséis de carvalho / carvalho escuro', 'Musgo perto da água'],
  plains: ['Camadas de grama baixa', 'Campos de girassol', 'Fazendas de feno'],
  mountain: ['Picos de pedra', 'Penhascos de bode', 'Ledges de pó de neve'],
  cave: ['Camadas de deep slate', 'Líquen brilhante', 'Geodos de ametista por perto'],
  ocean: ['Coral de oceanos mornos', 'Florestas de kelp', 'Fundos de algas'],
  river: ['Margens de argila', 'Linhas de cana', 'Bocas de caverna de dripstone'],
  desert: ['Camadas de areia', 'Arbustos secos', 'Poços do deserto'],
  swamp: ['Vitórias-régias', 'Lama / terra enraizada', 'Cogumelos gigantes'],
  tundra: ['Camadas de neve', 'Bosques de spruce', 'Espinhos de gelo (raro)'],
  volcanic: ['Deltas de basalto', 'Campos de blackstone', 'Lagos de lava'],
  jungle: ['Cipós', 'Clusters de bambu', 'Manchas de melancia'],
  meadow: ['Colmeias', 'Florestas de flores', 'Cerejeiras'],
};

function dropsFor(p: Pokemon): string[] {
  const primary = DROP_POOLS[p.primaryType];
  const secondary = p.secondaryType ? DROP_POOLS[p.secondaryType] : [];
  const merged = [...new Set([...primary, ...secondary])];
  if (merged.length === 0) return ['Cobblemon scrap'];
  const start = p.id % Math.max(1, merged.length - 2);
  return merged.slice(start, Math.min(merged.length, start + 4));
}

const BIOME_PT: Record<Biome, string> = {
  forest: 'floresta',
  plains: 'planícies',
  mountain: 'montanha',
  cave: 'caverna',
  ocean: 'oceano',
  river: 'rio',
  desert: 'deserto',
  swamp: 'pântano',
  tundra: 'tundra',
  volcanic: 'área vulcânica',
  jungle: 'selva',
  meadow: 'prado',
};

function weatherFor(p: Pokemon, locale: Locale): string {
  const enPool =
    WEATHER_BY_TYPE[p.primaryType] ??
    WEATHER_BY_TYPE[p.secondaryType ?? 'normal'] ??
    ['Variable overworld weather'];
  const ptPool =
    WEATHER_BY_TYPE_PT[p.primaryType] ??
    WEATHER_BY_TYPE_PT[p.secondaryType ?? 'normal'] ??
    ['Clima típico do overworld'];
  const pool = locale === 'pt-BR' ? ptPool : enPool;
  return hashPick(p.id, 3, pool);
}

function captureTipFor(p: Pokemon, locale: Locale): string {
  const biome = locale === 'pt-BR' ? BIOME_PT[p.spawnBiome] : biomeLabels[p.spawnBiome];
  const tipsEn: Record<PokemonType, string> = {
    fire: 'Use water-type bait near lava — approach from upwind so it does not flee.',
    water: 'Fish during rain in river/ocean chunks; lower light increases surface spawns.',
    grass: 'Bonemeal grass in ' + biome + ' — clear a 9×9 patch for clearer spawn rolls.',
    electric: 'Wait for thunderstorms; copper blocks nearby slightly boost electric spawns.',
    ice: 'Night spawns spike on packed ice — bring fire resist and slow falling.',
    fighting: 'Do not sprint; circle-strafe to reduce aggro range before throwing your ball.',
    poison: 'Wear a respirator (turtle shell + honey) in swamps to avoid poison procs.',
    ground: 'Sneak on sand — vibrations from sprinting scare burrowing Cobblemon away.',
    flying: 'Build a small pillar; aerial Cobblemon lock onto vertical silhouettes.',
    psychic: 'Empty your hotbar slots — some psychics react to held items in your hand.',
    bug: 'Place lanterns low; moths gather under warm light during dusk.',
    rock: 'Use a pickaxe sound (mine nearby stone) to lure rock-types out of walls.',
    ghost: 'Reduce local light to 7 or below for 30s — then ring a bell to reset chunks.',
    dragon: 'Rare spawns: full moon + high altitude — bring ender pearls to keep pace.',
    dark: 'Spawn rates rise without sky light — use tinted glass farms, not torches.',
    steel: 'Near deepslate iron ore veins — metallic steps echo and attract steel lines.',
    fairy: 'Plant azalea + flowers in a 5-block ring; fairies pathfind to color clusters.',
    normal: 'Classic wheat bait in ' + biome + ' — patience beats chasing across chunks.',
  };
  const tipsPt: Record<PokemonType, string> = {
    fire: 'Use isca de água perto de lava — chegue contra o vento para não assustar.',
    water: 'Pesque na chuva em rios/oceanos; menos luz aumenta spawns na superfície.',
    grass: 'Bone meal na grama em ' + biome + ' — abra um espaço 9×9 para rolagem mais limpa.',
    electric: 'Espere tempestades; cobre perto ajuda um pouco spawns elétricos.',
    ice: 'Noite valoriza gelo compacto — leve resistência a fogo e queda lenta.',
    fighting: 'Não corra; flanqueie para reduzir aggro antes da Pokébola.',
    poison: 'Em pântanos, evite poison — use shell tartaruga + mel se quiser roleplay.',
    ground: 'Agache na areia — sprint vibra e espanta Cobblemon que cavam.',
    flying: 'Faça um pilar baixo; voadores miram silhuetas verticais.',
    psychic: 'Esvazie a hotbar — alguns psíquicos reagem ao item na mão.',
    bug: 'Lanternas baixas atraem mariposas no crepúsculo.',
    rock: 'Mine pedra perto para “chamar” linhas pedra das paredes.',
    ghost: 'Reduza luz local para 7 ou menos por 30s — depois toque sino para resetar chunk.',
    dragon: 'Raro: lua cheia + altitude — leve pérolas do end para acompanhar.',
    dark: 'Sem luz do céu sobe taxa — fazendas de vidro fumê, não tochas.',
    steel: 'Perto de veios de ferro deep slate — passos metálicos atraem linhas aço.',
    fairy: 'Anel de 5 blocos com azaleia e flores — fadas pathfindam para cores.',
    normal: 'Isca clássica de trigo em ' + biome + ' — paciência vence perseguir chunk.',
  };
  const tips = locale === 'pt-BR' ? tipsPt : tipsEn;
  return tips[p.primaryType] ?? tips.normal;
}

function spawnEnvironmentFor(p: Pokemon, locale: Locale): string {
  const blocksEn = BLOCK_HINTS[p.spawnBiome] ?? BLOCK_HINTS.forest;
  const blocksPt = BLOCK_HINTS_PT[p.spawnBiome] ?? BLOCK_HINTS_PT.forest;
  const blocks = locale === 'pt-BR' ? blocksPt : blocksEn;
  const line = hashPick(p.id, 31, blocks);
  const structureEn =
    p.rarity === 'legendary'
      ? 'Near rare structures (ruined portal / fossil chamber).'
      : p.rarity === 'epic' || p.rarity === 'rare'
        ? 'Chunk borders and micro-biome seams improve roll quality.'
        : 'Common route grass — frequent but lower IV variance.';
  const structurePt =
    p.rarity === 'legendary'
      ? 'Perto de estruturas raras (portal arruinado / câmara fóssil).'
      : p.rarity === 'epic' || p.rarity === 'rare'
        ? 'Bordas de chunk e micro-biomas melhoram a qualidade do roll.'
        : 'Grama de rota comum — frequente, porém IV mais “comum”.';
  const structure = locale === 'pt-BR' ? structurePt : structureEn;
  return `${line} ${structure}`;
}

export function buildCobblemonWorldInfo(pokemon: Pokemon, locale: Locale = 'en'): CobblemonWorldInfo {
  return {
    dimension: getDimensionForPokemon(pokemon),
    preferredWeather: weatherFor(pokemon, locale),
    possibleDrops: dropsFor(pokemon),
    captureTip: captureTipFor(pokemon, locale),
    spawnEnvironment: spawnEnvironmentFor(pokemon, locale),
  };
}

export function formatSpawnBiomeLabel(biome: Biome, locale: Locale): string {
  if (locale === 'pt-BR') {
    const s = BIOME_PT[biome];
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  return biomeLabels[biome];
}
