// ==========================================
// MOB BATTLE CATALOG
// ==========================================
//
// Automatically creates the catalog JSON files
// needed by the Mob Battle Loadout system.
//
// IMPORTANT:
// Existing files are NEVER overwritten.
//
// Catalogs:
// - mobs
// - armor
// - weapons
// - tools
// - items
// - enchantments
// ==========================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ==========================================
// PATH SETUP
// ==========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// MOBS
// ==========================================

const mobs = [
  { id: 'minecraft:zombie', name: 'Zombie' },
  { id: 'minecraft:skeleton', name: 'Skeleton' },
  { id: 'minecraft:creeper', name: 'Creeper' },
  { id: 'minecraft:spider', name: 'Spider' },
  { id: 'minecraft:cave_spider', name: 'Cave Spider' },
  { id: 'minecraft:enderman', name: 'Enderman' },
  { id: 'minecraft:witch', name: 'Witch' },
  { id: 'minecraft:slime', name: 'Slime' },
  { id: 'minecraft:magma_cube', name: 'Magma Cube' },
  { id: 'minecraft:blaze', name: 'Blaze' },
  { id: 'minecraft:ghast', name: 'Ghast' },
  { id: 'minecraft:wither_skeleton', name: 'Wither Skeleton' },
  { id: 'minecraft:piglin', name: 'Piglin' },
  { id: 'minecraft:piglin_brute', name: 'Piglin Brute' },
  { id: 'minecraft:zombified_piglin', name: 'Zombified Piglin' },
  { id: 'minecraft:husk', name: 'Husk' },
  { id: 'minecraft:stray', name: 'Stray' },
  { id: 'minecraft:drowned', name: 'Drowned' },
  { id: 'minecraft:phantom', name: 'Phantom' },
  { id: 'minecraft:silverfish', name: 'Silverfish' },
  { id: 'minecraft:endermite', name: 'Endermite' },
  { id: 'minecraft:guardian', name: 'Guardian' },
  { id: 'minecraft:elder_guardian', name: 'Elder Guardian' },
  { id: 'minecraft:shulker', name: 'Shulker' },
  { id: 'minecraft:warden', name: 'Warden' },
  { id: 'minecraft:vindicator', name: 'Vindicator' },
  { id: 'minecraft:evoker', name: 'Evoker' },
  { id: 'minecraft:pillager', name: 'Pillager' },
  { id: 'minecraft:vex', name: 'Vex' },
  { id: 'minecraft:ravager', name: 'Ravager' },
  { id: 'minecraft:illusioner', name: 'Illusioner' },
  { id: 'minecraft:zoglin', name: 'Zoglin' },
  { id: 'minecraft:hoglin', name: 'Hoglin' },
  { id: 'minecraft:wither', name: 'Wither' },
  { id: 'minecraft:ender_dragon', name: 'Ender Dragon' },

  // Passive / neutral mobs
  { id: 'minecraft:iron_golem', name: 'Iron Golem' },
  { id: 'minecraft:snow_golem', name: 'Snow Golem' },
  { id: 'minecraft:wolf', name: 'Wolf' },
  { id: 'minecraft:polar_bear', name: 'Polar Bear' },
  { id: 'minecraft:bee', name: 'Bee' },
  { id: 'minecraft:goat', name: 'Goat' },
  { id: 'minecraft:llama', name: 'Llama' },
  { id: 'minecraft:trader_llama', name: 'Trader Llama' },
  { id: 'minecraft:horse', name: 'Horse' },
  { id: 'minecraft:donkey', name: 'Donkey' },
  { id: 'minecraft:mule', name: 'Mule' },
  { id: 'minecraft:camel', name: 'Camel' },
  { id: 'minecraft:fox', name: 'Fox' },
  { id: 'minecraft:ocelot', name: 'Ocelot' },
  { id: 'minecraft:cat', name: 'Cat' },
  { id: 'minecraft:panda', name: 'Panda' },
  { id: 'minecraft:parrot', name: 'Parrot' },
  { id: 'minecraft:rabbit', name: 'Rabbit' },
  { id: 'minecraft:polar_bear', name: 'Polar Bear' },
  { id: 'minecraft:goat', name: 'Goat' },
  { id: 'minecraft:axolotl', name: 'Axolotl' },
  { id: 'minecraft:turtle', name: 'Turtle' },
  { id: 'minecraft:frog', name: 'Frog' },
  { id: 'minecraft:tadpole', name: 'Tadpole' },

  // Aquatic
  { id: 'minecraft:cod', name: 'Cod' },
  { id: 'minecraft:salmon', name: 'Salmon' },
  { id: 'minecraft:pufferfish', name: 'Pufferfish' },
  { id: 'minecraft:tropical_fish', name: 'Tropical Fish' },
  { id: 'minecraft:dolphin', name: 'Dolphin' },
  { id: 'minecraft:squid', name: 'Squid' },
  { id: 'minecraft:glow_squid', name: 'Glow Squid' },

  // Farm animals
  { id: 'minecraft:pig', name: 'Pig' },
  { id: 'minecraft:cow', name: 'Cow' },
  { id: 'minecraft:mooshroom', name: 'Mooshroom' },
  { id: 'minecraft:sheep', name: 'Sheep' },
  { id: 'minecraft:chicken', name: 'Chicken' },

  // Villagers
  { id: 'minecraft:villager', name: 'Villager' },
  { id: 'minecraft:zombie_villager', name: 'Zombie Villager' },
  { id: 'minecraft:wandering_trader', name: 'Wandering Trader' },

  // Modded mobs currently used by the project
  { id: 'mutantmonsters:mutant_zombie', name: 'Mutant Zombie' },
  { id: 'mutantmonsters:mutant_skeleton', name: 'Mutant Skeleton' },
  { id: 'mutantmonsters:mutant_creeper', name: 'Mutant Creeper' },
  { id: 'mutantmonsters:mutant_enderman', name: 'Mutant Enderman' }
];

// ==========================================
// ARMOR
// ==========================================

const armor = [
  { id: 'minecraft:leather_helmet', name: 'Leather Helmet', slot: 'helmet' },
  { id: 'minecraft:leather_chestplate', name: 'Leather Chestplate', slot: 'chestplate' },
  { id: 'minecraft:leather_leggings', name: 'Leather Leggings', slot: 'leggings' },
  { id: 'minecraft:leather_boots', name: 'Leather Boots', slot: 'boots' },

  { id: 'minecraft:chainmail_helmet', name: 'Chainmail Helmet', slot: 'helmet' },
  { id: 'minecraft:chainmail_chestplate', name: 'Chainmail Chestplate', slot: 'chestplate' },
  { id: 'minecraft:chainmail_leggings', name: 'Chainmail Leggings', slot: 'leggings' },
  { id: 'minecraft:chainmail_boots', name: 'Chainmail Boots', slot: 'boots' },

  { id: 'minecraft:iron_helmet', name: 'Iron Helmet', slot: 'helmet' },
  { id: 'minecraft:iron_chestplate', name: 'Iron Chestplate', slot: 'chestplate' },
  { id: 'minecraft:iron_leggings', name: 'Iron Leggings', slot: 'leggings' },
  { id: 'minecraft:iron_boots', name: 'Iron Boots', slot: 'boots' },

  { id: 'minecraft:golden_helmet', name: 'Golden Helmet', slot: 'helmet' },
  { id: 'minecraft:golden_chestplate', name: 'Golden Chestplate', slot: 'chestplate' },
  { id: 'minecraft:golden_leggings', name: 'Golden Leggings', slot: 'leggings' },
  { id: 'minecraft:golden_boots', name: 'Golden Boots', slot: 'boots' },

  { id: 'minecraft:diamond_helmet', name: 'Diamond Helmet', slot: 'helmet' },
  { id: 'minecraft:diamond_chestplate', name: 'Diamond Chestplate', slot: 'chestplate' },
  { id: 'minecraft:diamond_leggings', name: 'Diamond Leggings', slot: 'leggings' },
  { id: 'minecraft:diamond_boots', name: 'Diamond Boots', slot: 'boots' },

  { id: 'minecraft:netherite_helmet', name: 'Netherite Helmet', slot: 'helmet' },
  { id: 'minecraft:netherite_chestplate', name: 'Netherite Chestplate', slot: 'chestplate' },
  { id: 'minecraft:netherite_leggings', name: 'Netherite Leggings', slot: 'leggings' },
  { id: 'minecraft:netherite_boots', name: 'Netherite Boots', slot: 'boots' },

  { id: 'minecraft:turtle_helmet', name: 'Turtle Shell', slot: 'helmet' }
];

// ==========================================
// WEAPONS
// ==========================================

const weapons = [
  { id: 'minecraft:wooden_sword', name: 'Wooden Sword', type: 'sword' },
  { id: 'minecraft:stone_sword', name: 'Stone Sword', type: 'sword' },
  { id: 'minecraft:iron_sword', name: 'Iron Sword', type: 'sword' },
  { id: 'minecraft:golden_sword', name: 'Golden Sword', type: 'sword' },
  { id: 'minecraft:diamond_sword', name: 'Diamond Sword', type: 'sword' },
  { id: 'minecraft:netherite_sword', name: 'Netherite Sword', type: 'sword' },

  { id: 'minecraft:bow', name: 'Bow', type: 'ranged' },
  { id: 'minecraft:crossbow', name: 'Crossbow', type: 'ranged' },
  { id: 'minecraft:trident', name: 'Trident', type: 'ranged' },
  { id: 'minecraft:shield', name: 'Shield', type: 'offhand' }
];

// ==========================================
// TOOLS
// ==========================================

const tools = [
  { id: 'minecraft:wooden_pickaxe', name: 'Wooden Pickaxe', type: 'pickaxe' },
  { id: 'minecraft:stone_pickaxe', name: 'Stone Pickaxe', type: 'pickaxe' },
  { id: 'minecraft:iron_pickaxe', name: 'Iron Pickaxe', type: 'pickaxe' },
  { id: 'minecraft:golden_pickaxe', name: 'Golden Pickaxe', type: 'pickaxe' },
  { id: 'minecraft:diamond_pickaxe', name: 'Diamond Pickaxe', type: 'pickaxe' },
  { id: 'minecraft:netherite_pickaxe', name: 'Netherite Pickaxe', type: 'pickaxe' },

  { id: 'minecraft:wooden_axe', name: 'Wooden Axe', type: 'axe' },
  { id: 'minecraft:stone_axe', name: 'Stone Axe', type: 'axe' },
  { id: 'minecraft:iron_axe', name: 'Iron Axe', type: 'axe' },
  { id: 'minecraft:golden_axe', name: 'Golden Axe', type: 'axe' },
  { id: 'minecraft:diamond_axe', name: 'Diamond Axe', type: 'axe' },
  { id: 'minecraft:netherite_axe', name: 'Netherite Axe', type: 'axe' },

  { id: 'minecraft:wooden_shovel', name: 'Wooden Shovel', type: 'shovel' },
  { id: 'minecraft:stone_shovel', name: 'Stone Shovel', type: 'shovel' },
  { id: 'minecraft:iron_shovel', name: 'Iron Shovel', type: 'shovel' },
  { id: 'minecraft:golden_shovel', name: 'Golden Shovel', type: 'shovel' },
  { id: 'minecraft:diamond_shovel', name: 'Diamond Shovel', type: 'shovel' },
  { id: 'minecraft:netherite_shovel', name: 'Netherite Shovel', type: 'shovel' },

  { id: 'minecraft:wooden_hoe', name: 'Wooden Hoe', type: 'hoe' },
  { id: 'minecraft:stone_hoe', name: 'Stone Hoe', type: 'hoe' },
  { id: 'minecraft:iron_hoe', name: 'Iron Hoe', type: 'hoe' },
  { id: 'minecraft:golden_hoe', name: 'Golden Hoe', type: 'hoe' },
  { id: 'minecraft:diamond_hoe', name: 'Diamond Hoe', type: 'hoe' },
  { id: 'minecraft:netherite_hoe', name: 'Netherite Hoe', type: 'hoe' }
];

// ==========================================
// GENERAL ITEMS
// ==========================================

const items = [
  { id: 'minecraft:arrow', name: 'Arrow' },
  { id: 'minecraft:spectral_arrow', name: 'Spectral Arrow' },
  { id: 'minecraft:firework_rocket', name: 'Firework Rocket' },

  { id: 'minecraft:golden_apple', name: 'Golden Apple' },
  { id: 'minecraft:enchanted_golden_apple', name: 'Enchanted Golden Apple' },

  { id: 'minecraft:bread', name: 'Bread' },
  { id: 'minecraft:cooked_beef', name: 'Cooked Beef' },
  { id: 'minecraft:cooked_porkchop', name: 'Cooked Porkchop' },
  { id: 'minecraft:cooked_chicken', name: 'Cooked Chicken' },
  { id: 'minecraft:cooked_mutton', name: 'Cooked Mutton' },
  { id: 'minecraft:cooked_rabbit', name: 'Cooked Rabbit' },

  { id: 'minecraft:apple', name: 'Apple' },
  { id: 'minecraft:carrot', name: 'Carrot' },
  { id: 'minecraft:golden_carrot', name: 'Golden Carrot' },

  { id: 'minecraft:ender_pearl', name: 'Ender Pearl' },
  { id: 'minecraft:ender_eye', name: 'Eye of Ender' },
  { id: 'minecraft:blaze_rod', name: 'Blaze Rod' },

  { id: 'minecraft:totem_of_undying', name: 'Totem of Undying' },
  { id: 'minecraft:water_bucket', name: 'Water Bucket' },
  { id: 'minecraft:lava_bucket', name: 'Lava Bucket' },
  { id: 'minecraft:milk_bucket', name: 'Milk Bucket' },

  { id: 'minecraft:snowball', name: 'Snowball' },
  { id: 'minecraft:egg', name: 'Egg' },

  { id: 'minecraft:tnt', name: 'TNT' },
  { id: 'minecraft:flint_and_steel', name: 'Flint and Steel' },

  { id: 'minecraft:lead', name: 'Lead' },
  { id: 'minecraft:name_tag', name: 'Name Tag' }
  
];

// ==========================================
// EFFECTS
// ==========================================

const effects = [
  {
    id: 'minecraft:speed',
    name: 'Speed',
    maxLevel: 10
  },
  {
    id: 'minecraft:slowness',
    name: 'Slowness',
    maxLevel: 10
  },
  {
    id: 'minecraft:haste',
    name: 'Haste',
    maxLevel: 10
  },
  {
    id: 'minecraft:mining_fatigue',
    name: 'Mining Fatigue',
    maxLevel: 10
  },
  {
    id: 'minecraft:strength',
    name: 'Strength',
    maxLevel: 10
  },
  {
    id: 'minecraft:instant_health',
    name: 'Instant Health',
    maxLevel: 10
  },
  {
    id: 'minecraft:instant_damage',
    name: 'Instant Damage',
    maxLevel: 10
  },
  {
    id: 'minecraft:jump_boost',
    name: 'Jump Boost',
    maxLevel: 10
  },
  {
    id: 'minecraft:nausea',
    name: 'Nausea',
    maxLevel: 10
  },
  {
    id: 'minecraft:regeneration',
    name: 'Regeneration',
    maxLevel: 10
  },
  {
    id: 'minecraft:resistance',
    name: 'Resistance',
    maxLevel: 10
  },
  {
    id: 'minecraft:fire_resistance',
    name: 'Fire Resistance',
    maxLevel: 10
  },
  {
    id: 'minecraft:water_breathing',
    name: 'Water Breathing',
    maxLevel: 10
  },
  {
    id: 'minecraft:invisibility',
    name: 'Invisibility',
    maxLevel: 10
  },
  {
    id: 'minecraft:blindness',
    name: 'Blindness',
    maxLevel: 10
  },
  {
    id: 'minecraft:night_vision',
    name: 'Night Vision',
    maxLevel: 10
  },
  {
    id: 'minecraft:hunger',
    name: 'Hunger',
    maxLevel: 10
  },
  {
    id: 'minecraft:weakness',
    name: 'Weakness',
    maxLevel: 10
  },
  {
    id: 'minecraft:poison',
    name: 'Poison',
    maxLevel: 10
  },
  {
    id: 'minecraft:wither',
    name: 'Wither',
    maxLevel: 10
  },
  {
    id: 'minecraft:health_boost',
    name: 'Health Boost',
    maxLevel: 10
  },
  {
    id: 'minecraft:absorption',
    name: 'Absorption',
    maxLevel: 10
  },
  {
    id: 'minecraft:saturation',
    name: 'Saturation',
    maxLevel: 10
  },
  {
    id: 'minecraft:glowing',
    name: 'Glowing',
    maxLevel: 10
  },
  {
    id: 'minecraft:levitation',
    name: 'Levitation',
    maxLevel: 10
  },
  {
    id: 'minecraft:luck',
    name: 'Luck',
    maxLevel: 10
  },
  {
    id: 'minecraft:unluck',
    name: 'Bad Luck',
    maxLevel: 10
  },
  {
    id: 'minecraft:slow_falling',
    name: 'Slow Falling',
    maxLevel: 10
  },
  {
    id: 'minecraft:conduit_power',
    name: 'Conduit Power',
    maxLevel: 10
  },
  {
    id: 'minecraft:dolphins_grace',
    name: "Dolphin's Grace",
    maxLevel: 10
  },
  {
    id: 'minecraft:hero_of_the_village',
    name: 'Hero of the Village',
    maxLevel: 10
  },
  {
    id: 'minecraft:darkness',
    name: 'Darkness',
    maxLevel: 10
  }
];

// ==========================================
// ENCHANTMENTS
// ==========================================
const enchantments = [
  { id: 'minecraft:protection', name: 'Protection', maxLevel: 4 },
  { id: 'minecraft:fire_protection', name: 'Fire Protection', maxLevel: 4 },
  { id: 'minecraft:feather_falling', name: 'Feather Falling', maxLevel: 4 },
  { id: 'minecraft:blast_protection', name: 'Blast Protection', maxLevel: 4 },
  { id: 'minecraft:projectile_protection', name: 'Projectile Protection', maxLevel: 4 },
  { id: 'minecraft:respiration', name: 'Respiration', maxLevel: 3 },
  { id: 'minecraft:aqua_affinity', name: 'Aqua Affinity', maxLevel: 1 },
  { id: 'minecraft:thorns', name: 'Thorns', maxLevel: 3 },
  { id: 'minecraft:depth_strider', name: 'Depth Strider', maxLevel: 3 },
  { id: 'minecraft:frost_walker', name: 'Frost Walker', maxLevel: 2 },
  { id: 'minecraft:binding_curse', name: 'Curse of Binding', maxLevel: 1 },
  { id: 'minecraft:soul_speed', name: 'Soul Speed', maxLevel: 3 },
  { id: 'minecraft:swift_sneak', name: 'Swift Sneak', maxLevel: 3 },

  { id: 'minecraft:sharpness', name: 'Sharpness', maxLevel: 5 },
  { id: 'minecraft:smite', name: 'Smite', maxLevel: 5 },
  { id: 'minecraft:bane_of_arthropods', name: 'Bane of Arthropods', maxLevel: 5 },
  { id: 'minecraft:knockback', name: 'Knockback', maxLevel: 2 },
  { id: 'minecraft:fire_aspect', name: 'Fire Aspect', maxLevel: 2 },
  { id: 'minecraft:looting', name: 'Looting', maxLevel: 3 },
  { id: 'minecraft:sweeping', name: 'Sweeping Edge', maxLevel: 3 },

  { id: 'minecraft:efficiency', name: 'Efficiency', maxLevel: 5 },
  { id: 'minecraft:silk_touch', name: 'Silk Touch', maxLevel: 1 },
  { id: 'minecraft:fortune', name: 'Fortune', maxLevel: 3 },

  // ==========================================
  // BOW ENCHANTMENTS
  // ==========================================

  {
    id: 'minecraft:power',
    name: 'Power',
    maxLevel: 5,
    appliesTo: ['bow']
  },
  {
    id: 'minecraft:punch',
    name: 'Punch',
    maxLevel: 2,
    appliesTo: ['bow']
  },
  {
    id: 'minecraft:flame',
    name: 'Flame',
    maxLevel: 1,
    appliesTo: ['bow']
  },
  {
    id: 'minecraft:infinity',
    name: 'Infinity',
    maxLevel: 1,
    appliesTo: ['bow']
  },

  // ==========================================
  // CROSSBOW ENCHANTMENTS
  // ==========================================

  {
    id: 'minecraft:multishot',
    name: 'Multishot',
    maxLevel: 1,
    appliesTo: ['crossbow']
  },
  {
    id: 'minecraft:quick_charge',
    name: 'Quick Charge',
    maxLevel: 3,
    appliesTo: ['crossbow']
  },
  {
    id: 'minecraft:piercing',
    name: 'Piercing',
    maxLevel: 4,
    appliesTo: ['crossbow']
  },

  // ==========================================
  // COMMON RANGED ENCHANTMENTS
  // ==========================================

  {
    id: 'minecraft:unbreaking',
    name: 'Unbreaking',
    maxLevel: 3,
    appliesTo: ['bow', 'crossbow']
  },
  {
    id: 'minecraft:mending',
    name: 'Mending',
    maxLevel: 1,
    appliesTo: ['bow', 'crossbow']
  },
  {
    id: 'minecraft:vanishing_curse',
    name: 'Curse of Vanishing',
    maxLevel: 1,
    appliesTo: ['bow', 'crossbow']
  },

  // ==========================================
  // TRIDENT ENCHANTMENTS
  // ==========================================

  {
    id: 'minecraft:impaling',
    name: 'Impaling',
    maxLevel: 5,
    appliesTo: ['trident']
  },
  {
    id: 'minecraft:riptide',
    name: 'Riptide',
    maxLevel: 3,
    appliesTo: ['trident']
  },
  {
    id: 'minecraft:loyalty',
    name: 'Loyalty',
    maxLevel: 3,
    appliesTo: ['trident']
  },
  {
    id: 'minecraft:channeling',
    name: 'Channeling',
    maxLevel: 1,
    appliesTo: ['trident']
  }
];

// ==========================================
// CATALOG FILES
// ==========================================

const catalogFiles = {
  mobs: {
    file: path.join(__dirname, 'mobBattleMobs.json'),
    defaultData: mobs
  },

  armor: {
    file: path.join(__dirname, 'mobBattleArmor.json'),
    defaultData: armor
  },

  weapons: {
    file: path.join(__dirname, 'mobBattleWeapons.json'),
    defaultData: weapons
  },

  tools: {
    file: path.join(__dirname, 'mobBattleTools.json'),
    defaultData: tools
  },

  items: {
    file: path.join(__dirname, 'mobBattleItems.json'),
    defaultData: items
  },

  enchantments: {
    file: path.join(__dirname, 'mobBattleEnchantments.json'),
    defaultData: enchantments
  },

  effects: {
    file: path.join(__dirname, 'mobBattleEffects.json'),
    defaultData: effects
  }
};

// ==========================================
// CREATE ONE CATALOG IF MISSING
// ==========================================

function createCatalogFile(name, catalog) {
  if (fs.existsSync(catalog.file)) {
    return;
  }

  fs.writeFileSync(
    catalog.file,
    JSON.stringify(catalog.defaultData, null, 2),
    'utf8'
  );

  console.log(
    `Mob Battle Catalog: Created ${name}.json`
  );
}

// ==========================================
// CREATE ALL CATALOG FILES
// ==========================================

export function ensureMobBattleCatalogs() {
  for (const [name, catalog] of Object.entries(catalogFiles)) {
    createCatalogFile(name, catalog);
  }
}

// ==========================================
// READ CATALOG
// ==========================================

export function getMobBattleCatalog(name) {
  const catalog = catalogFiles[name];

  if (!catalog) {
    throw new Error(
      `Unknown Mob Battle catalog: ${name}`
    );
  }

  if (!fs.existsSync(catalog.file)) {
    createCatalogFile(name, catalog);
  }

  try {
    const raw = fs.readFileSync(
      catalog.file,
      'utf8'
    );

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error(
        `${name} catalog must contain an array.`
      );
    }

    return parsed;
  } catch (error) {
    console.error(
      `Mob Battle Catalog: Failed to read ${name}:`,
      error
    );

    return [];
  }
}

// ==========================================
// SAVE CATALOG
// ==========================================

export function saveMobBattleCatalog(name, data) {
  const catalog = catalogFiles[name];

  if (!catalog) {
    throw new Error(
      `Unknown Mob Battle catalog: ${name}`
    );
  }

  if (!Array.isArray(data)) {
    throw new Error(
      `${name} catalog must contain an array.`
    );
  }

  fs.writeFileSync(
    catalog.file,
    JSON.stringify(data, null, 2),
    'utf8'
  );

  return data;
}


// ==========================================
// ADD CATALOG ITEM
// ==========================================

export function addMobBattleCatalogItem(name, item) {
    const catalog = catalogFiles[name];

    if (!catalog) {
        throw new Error(
            `Unknown Mob Battle catalog: ${name}`
        );
    }

    if (!item || typeof item !== 'object') {
        throw new Error(
            'Catalog item must be an object.'
        );
    }

    const id = String(item.id || '').trim();
    const displayName = String(item.name || '').trim();

    if (!id) {
        throw new Error(
            'Catalog item ID is required.'
        );
    }

    if (!displayName) {
        throw new Error(
            'Catalog item name is required.'
        );
    }

    const currentCatalog =
        getMobBattleCatalog(name);

    const duplicate =
        currentCatalog.some(
            existing =>
                String(existing.id).toLowerCase() ===
                id.toLowerCase()
        );

    if (duplicate) {
        throw new Error(
            `Catalog item ID already exists: ${id}`
        );
    }

    const newItem = {
        ...item,
        id,
        name: displayName
    };

    currentCatalog.push(newItem);

    saveMobBattleCatalog(
        name,
        currentCatalog
    );

    return newItem;
}


// ==========================================
// UPDATE CATALOG ITEM
// ==========================================

export function updateMobBattleCatalogItem(
    name,
    originalId,
    item
) {
    const catalog = catalogFiles[name];

    if (!catalog) {
        throw new Error(
            `Unknown Mob Battle catalog: ${name}`
        );
    }

    const oldId =
        String(originalId || '').trim();

    const newId =
        String(item?.id || '').trim();

    const displayName =
        String(item?.name || '').trim();

    if (!oldId) {
        throw new Error(
            'Original catalog item ID is required.'
        );
    }

    if (!newId) {
        throw new Error(
            'Catalog item ID is required.'
        );
    }

    if (!displayName) {
        throw new Error(
            'Catalog item name is required.'
        );
    }

    const currentCatalog =
        getMobBattleCatalog(name);

    const index =
        currentCatalog.findIndex(
            existing =>
                String(existing.id).toLowerCase() ===
                oldId.toLowerCase()
        );

    if (index === -1) {
        throw new Error(
            `Catalog item not found: ${oldId}`
        );
    }

    const duplicate =
        currentCatalog.some(
            (existing, existingIndex) =>
                existingIndex !== index &&
                String(existing.id).toLowerCase() ===
                newId.toLowerCase()
        );

    if (duplicate) {
        throw new Error(
            `Catalog item ID already exists: ${newId}`
        );
    }

    const updatedItem = {
        ...currentCatalog[index],
        ...item,
        id: newId,
        name: displayName
    };

    currentCatalog[index] =
        updatedItem;

    saveMobBattleCatalog(
        name,
        currentCatalog
    );

    return updatedItem;
}


// ==========================================
// DELETE CATALOG ITEM
// ==========================================

export function deleteMobBattleCatalogItem(
    name,
    id
) {
    const catalog = catalogFiles[name];

    if (!catalog) {
        throw new Error(
            `Unknown Mob Battle catalog: ${name}`
        );
    }

    const targetId =
        String(id || '').trim();

    if (!targetId) {
        throw new Error(
            'Catalog item ID is required.'
        );
    }

    const currentCatalog =
        getMobBattleCatalog(name);

    const index =
        currentCatalog.findIndex(
            existing =>
                String(existing.id).toLowerCase() ===
                targetId.toLowerCase()
        );

    if (index === -1) {
        throw new Error(
            `Catalog item not found: ${targetId}`
        );
    }

    const deletedItem =
        currentCatalog[index];

    currentCatalog.splice(
        index,
        1
    );

    saveMobBattleCatalog(
        name,
        currentCatalog
    );

    return deletedItem;
}

// ==========================================
// INITIALIZE
// ==========================================

ensureMobBattleCatalogs();

console.log('Mob Battle Catalog: Ready.');