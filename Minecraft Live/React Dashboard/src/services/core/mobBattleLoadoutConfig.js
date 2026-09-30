// ==========================================
// MOB BATTLE LOADOUT CONFIG
// ==========================================
//
// Responsibilities:
// - Auto-create mobBattleLoadouts.json
// - Load mob battle loadouts
// - Create loadouts
// - Update loadouts
// - Delete loadouts
// - Get enabled loadouts
// - Validate enchantments
// - Migrate legacy enchantments
//
// IMPORTANT:
// This file is completely separate from
// mobBattleConfig.js and the existing
// Mob Battle naming system.
// ==========================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
    validateMobBattleEnchantment,
    isMobBattleEnchantmentCompatible
} from './mobBattleEnchantment.js';

// --------------------------------------------------
// PATH SETUP
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE = path.join(
    __dirname,
    'mobBattleLoadouts.json'
);

// --------------------------------------------------
// DEFAULT CONFIG
// --------------------------------------------------

const defaultConfig = {
    loadouts: []
};

// --------------------------------------------------
// RUNTIME CONFIG
// --------------------------------------------------

let config = {
    ...defaultConfig,
    loadouts: []
};

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function createDefaultConfigFile() {
    if (!fs.existsSync(CONFIG_FILE)) {
        fs.writeFileSync(
            CONFIG_FILE,
            JSON.stringify(defaultConfig, null, 2),
            'utf8'
        );

        console.log(
            `Mob Battle Loadouts: Created ${CONFIG_FILE}`
        );
    }
}

function saveMobBattleLoadoutConfig() {
    fs.writeFileSync(
        CONFIG_FILE,
        JSON.stringify(config, null, 2),
        'utf8'
    );
}

// --------------------------------------------------
// LEGACY ENCHANTMENT MIGRATION
// --------------------------------------------------
//
// Old format:
// {
//     id: "minecraft:protection",
//     level: 4
// }
//
// New format:
// {
//     id: "minecraft:protection",
//     level: 4,
//     target: "full_armor"
// }
//
// We infer the target from the equipment currently
// assigned to the loadout.
//

function getLoadoutEquipmentForTarget(loadout, target) {
    if (target === 'helmet') {
        return loadout?.armor?.helmet || '';
    }

    if (target === 'chestplate') {
        return loadout?.armor?.chestplate || '';
    }

    if (target === 'leggings') {
        return loadout?.armor?.leggings || '';
    }

    if (target === 'boots') {
        return loadout?.armor?.boots || '';
    }

    if (target === 'main_hand') {
        return loadout?.weapon?.mainHand || '';
    }

    if (target === 'off_hand') {
        return loadout?.weapon?.offHand || '';
    }

    if (target === 'full_armor') {
        return [
            loadout?.armor?.helmet || '',
            loadout?.armor?.chestplate || '',
            loadout?.armor?.leggings || '',
            loadout?.armor?.boots || ''
        ];
    }

    return '';
}

function hasEquipmentForTarget(loadout, target) {
    const equipment =
        getLoadoutEquipmentForTarget(
            loadout,
            target
        );

    if (Array.isArray(equipment)) {
        return (
            equipment.length === 4 &&
            equipment.every(Boolean)
        );
    }

    return Boolean(equipment);
}

function inferLegacyEnchantmentTarget(
    enchantment,
    loadout
) {
    const targets = [
        'full_armor',
        'helmet',
        'chestplate',
        'leggings',
        'boots',
        'main_hand',
        'off_hand'
    ];

    const compatibleTargets = [];

    for (const target of targets) {
        if (!hasEquipmentForTarget(loadout, target)) {
            continue;
        }

        const compatibility =
            isMobBattleEnchantmentCompatible(
                enchantment.id,
                loadout,
                target
            );

        if (compatibility.valid) {
            compatibleTargets.push(target);
        }
    }

    // --------------------------------------------------
    // Prefer full armor when the enchantment is valid
    // for every armor piece.
    // --------------------------------------------------

    if (
        compatibleTargets.includes(
            'full_armor'
        )
    ) {
        return 'full_armor';
    }

    // --------------------------------------------------
    // If only one target is possible, use it.
    // --------------------------------------------------

    if (compatibleTargets.length === 1) {
        return compatibleTargets[0];
    }

    // --------------------------------------------------
    // If multiple specific armor targets are possible,
    // choose the first deterministic target.
    //
    // This mainly handles legacy data where the old
    // system did not record the target.
    // --------------------------------------------------

    const armorTargets = [
        'helmet',
        'chestplate',
        'leggings',
        'boots'
    ];

    const compatibleArmorTargets =
        compatibleTargets.filter(
            target =>
                armorTargets.includes(target)
        );

    if (compatibleArmorTargets.length > 0) {
        return compatibleArmorTargets[0];
    }

    // --------------------------------------------------
    // Otherwise choose the first compatible equipment
    // target.
    // --------------------------------------------------

    if (compatibleTargets.length > 0) {
        return compatibleTargets[0];
    }

    return null;
}

function migrateLegacyLoadoutEnchantments(
    loadout
) {
    const enchantments =
        Array.isArray(loadout?.enchantments)
            ? loadout.enchantments
            : [];

    if (enchantments.length === 0) {
        return [];
    }

    let changed = false;

    const migrated =
        enchantments.map(
            enchantment => {
                if (
                    !enchantment ||
                    typeof enchantment !== 'object'
                ) {
                    return enchantment;
                }

                // Already using the new format.
                if (
                    enchantment.target
                ) {
                    return enchantment;
                }

                const target =
                    inferLegacyEnchantmentTarget(
                        enchantment,
                        loadout
                    );

                if (!target) {
                    throw new Error(
                        `Unable to determine target for legacy enchantment "${enchantment.id}".`
                    );
                }

                changed = true;

                console.log(
                    `Mob Battle Loadouts: Migrated ` +
                    `${enchantment.id} ` +
                    `-> ${target}`
                );

                return {
                    ...enchantment,
                    target
                };
            }
        );

    if (changed) {
        loadout.enchantments =
            migrated;
    }

    return migrated;
}

// --------------------------------------------------
// ENCHANTMENT VALIDATION
// --------------------------------------------------

function validateLoadoutEnchantments(
    loadout
) {
    const enchantments =
        Array.isArray(loadout.enchantments)
            ? loadout.enchantments
            : [];

    const validatedEnchantments = [];

    for (const enchantment of enchantments) {
        if (
            !enchantment ||
            typeof enchantment !== 'object'
        ) {
            throw new Error(
                'Invalid enchantment data.'
            );
        }

        if (!enchantment.id) {
            throw new Error(
                'Enchantment ID is required.'
            );
        }

        if (!enchantment.target) {
            throw new Error(
                `Enchantment "${enchantment.id}" is missing a target.`
            );
        }

  console.log(
    'Mob Battle Loadout: Validating enchantment:',
    JSON.stringify(enchantment)
);

const result =
    validateMobBattleEnchantment(
        enchantment,
        loadout,
        validatedEnchantments
    );

       const isIncompatibilityError =
    !result.valid &&
    typeof result.reason === 'string' &&
    /\bis incompatible with\b/i.test(result.reason);

if (
    !result.valid &&
    !(
        enchantment.allowIncompatible === true &&
        isIncompatibilityError
    )
) {
    throw new Error(
        result.reason
    );
}

 validatedEnchantments.push({
    id: String(
        enchantment.id
    ).trim(),

    level: Number(
        enchantment.level
    ),

    target: String(
        enchantment.target
    ).trim(),

    ...(enchantment.allowIncompatible === true
        ? { allowIncompatible: true }
        : {})
});
    }

    return validatedEnchantments;
}

// --------------------------------------------------
// LOAD CONFIG
// --------------------------------------------------

export function loadMobBattleLoadoutConfig() {
    try {
        createDefaultConfigFile();

        const raw =
            fs.readFileSync(
                CONFIG_FILE,
                'utf8'
            );

        const parsed =
            JSON.parse(raw);

            console.log(
    'Mob Battle Loadouts: Reading file:',
    CONFIG_FILE
);

console.log(
    'Mob Battle Loadouts: Raw JSON:',
    raw
);

console.log(
    'Mob Battle Loadouts: Parsed loadouts:',
    parsed.loadouts
);

        if (
            !parsed ||
            typeof parsed !== 'object'
        ) {
            throw new Error(
                'Invalid loadout config root.'
            );
        }

        config = {
            ...defaultConfig,
            ...parsed,

            loadouts:
                Array.isArray(
                    parsed.loadouts
                )
                    ? parsed.loadouts
                    : []
        };

        // --------------------------------------------------
        // Migrate old enchantment format.
        // --------------------------------------------------

        let migrationOccurred = false;

      config.loadouts =
    config.loadouts.map(
        loadout => {
            if (
                !loadout ||
                typeof loadout !== 'object' ||
                Array.isArray(loadout)
            ) {
                return loadout;
            }

            const original =
                JSON.stringify(
                    loadout.enchantments || []
                );

            const migratedLoadout = {
                ...loadout,

                armor: {
                    helmet:
                        loadout.armor?.helmet || '',

                    chestplate:
                        loadout.armor?.chestplate || '',

                    leggings:
                        loadout.armor?.leggings || '',

                    boots:
                        loadout.armor?.boots || ''
                },

          weapon: {
    mainHand:
        loadout.weapon?.mainHand || '',

    offHand:
        loadout.weapon?.offHand || ''
},

effects:
    Array.isArray(
        loadout.effects
    )
        ? [
            ...loadout.effects
        ]
        : [],

enchantments:
    Array.isArray(
        loadout.enchantments
    )
        ? [
            ...loadout.enchantments
        ]
        : []
            };

            const migratedEnchantments =
                migrateLegacyLoadoutEnchantments(
                    migratedLoadout
                );

            migratedLoadout.enchantments =
                migratedEnchantments;

            const after =
                JSON.stringify(
                    migratedEnchantments
                );

            if (original !== after) {
                migrationOccurred = true;
            }

            return migratedLoadout;
        }
    );

        if (migrationOccurred) {
            saveMobBattleLoadoutConfig();

            console.log(
                'Mob Battle Loadouts: Legacy enchantments migrated and saved.'
            );
        }

        console.log(
            `Mob Battle Loadouts: Loaded ${config.loadouts.length} loadout(s).`
        );

        return config;

 } catch (error) {
    console.error(
        'Mob Battle Loadouts: Failed to load config:',
        error
    );

    // IMPORTANT:
    // Do not overwrite the existing JSON when loading fails.
    // Preserve the last saved file so a temporary validation,
    // migration, or parsing problem cannot erase loadouts.

    config = {
        ...defaultConfig,
        loadouts: []
    };

    return config;
}
}

// --------------------------------------------------
// GET ALL LOADOUTS
// --------------------------------------------------

export function getMobBattleLoadouts() {
    return config.loadouts;
}

// --------------------------------------------------
// GET SINGLE LOADOUT
// --------------------------------------------------

export function getMobBattleLoadout(id) {
    return config.loadouts.find(
        loadout =>
            Number(loadout.id) ===
            Number(id)
    ) || null;
}

// --------------------------------------------------
// CREATE LOADOUT
// --------------------------------------------------

export function createMobBattleLoadout(
    data = {}
) {
    const name =
        String(
            data.name || ''
        ).trim();

    const mobId =
        String(
            data.mobId || ''
        ).trim();

    const amount =
        Number(data.amount);

    if (!name) {
        throw new Error(
            'Loadout name is required.'
        );
    }

    if (!mobId) {
        throw new Error(
            'Mob type is required.'
        );
    }

    if (
        !Number.isInteger(amount) ||
        amount < 1
    ) {
        throw new Error(
            'Amount must be a whole number greater than 0.'
        );
    }

    const nextId =
        config.loadouts.length > 0
            ? Math.max(
                ...config.loadouts.map(
                    loadout =>
                        Number(loadout.id) ||
                        0
                )
            ) + 1
            : 1;

    const loadout = {
        id: nextId,

        name,

        mobId,

        amount,

        armor: {
            helmet:
                String(
                    data.armor?.helmet || ''
                ),

            chestplate:
                String(
                    data.armor?.chestplate || ''
                ),

            leggings:
                String(
                    data.armor?.leggings || ''
                ),

            boots:
                String(
                    data.armor?.boots || ''
                )
        },

        weapon: {
            mainHand:
                String(
                    data.weapon?.mainHand || ''
                ),

            offHand:
                String(
                    data.weapon?.offHand || ''
                )
        },

       enchantments:
    Array.isArray(
        data.enchantments
    )
        ? data.enchantments
        : [],

effects:
    Array.isArray(
        data.effects
    )
        ? data.effects
        : [],

enabled:
    data.enabled !== false
    };

    // --------------------------------------------------
    // Validate enchantments BEFORE saving.
    // --------------------------------------------------

    loadout.enchantments =
        validateLoadoutEnchantments(
            loadout
        );

    config.loadouts.push(
        loadout
    );

    saveMobBattleLoadoutConfig();

    return loadout;
}

// --------------------------------------------------
// UPDATE LOADOUT
// --------------------------------------------------

export function updateMobBattleLoadout(
    id,
    data = {}
) {
    const index =
        config.loadouts.findIndex(
            loadout =>
                Number(loadout.id) ===
                Number(id)
        );

    if (index === -1) {
        throw new Error(
            'Loadout not found.'
        );
    }

    const current =
        config.loadouts[index];

    const updated = {
        ...current,

        ...(data.name !== undefined && {
            name:
                String(
                    data.name
                ).trim()
        }),

        ...(data.mobId !== undefined && {
            mobId:
                String(
                    data.mobId
                ).trim()
        }),

        ...(data.amount !== undefined && {
            amount:
                Number(
                    data.amount
                )
        }),

        ...(data.armor !== undefined && {
            armor: {
                ...current.armor,
                ...data.armor
            }
        }),

        ...(data.weapon !== undefined && {
            weapon: {
                ...current.weapon,
                ...data.weapon
            }
        }),

     ...(data.enchantments !== undefined && {
    enchantments:
        Array.isArray(
            data.enchantments
        )
            ? data.enchantments
            : current.enchantments
}),

...(data.effects !== undefined && {
    effects:
        Array.isArray(
            data.effects
        )
            ? data.effects
            : current.effects
}),
        ...(data.enabled !== undefined && {
            enabled:
                Boolean(
                    data.enabled
                )
        })
    };

    // --------------------------------------------------
    // Make sure legacy enchantments are migrated
    // before validation.
    // --------------------------------------------------

    migrateLegacyLoadoutEnchantments(
        updated
    );

    if (!updated.name) {
        throw new Error(
            'Loadout name is required.'
        );
    }

    if (!updated.mobId) {
        throw new Error(
            'Mob type is required.'
        );
    }

    if (
        !Number.isInteger(
            updated.amount
        ) ||
        updated.amount < 1
    ) {
        throw new Error(
            'Amount must be a whole number greater than 0.'
        );
    }

    // --------------------------------------------------
    // Validate the COMPLETE updated loadout.
    // --------------------------------------------------

    updated.enchantments =
        validateLoadoutEnchantments(
            updated
        );

    config.loadouts[index] =
        updated;

    saveMobBattleLoadoutConfig();

    return updated;
}

// --------------------------------------------------
// DELETE LOADOUT
// --------------------------------------------------

export function deleteMobBattleLoadout(id) {
    const index =
        config.loadouts.findIndex(
            loadout =>
                Number(loadout.id) ===
                Number(id)
        );

    if (index === -1) {
        throw new Error(
            'Loadout not found.'
        );
    }

    const [deleted] =
        config.loadouts.splice(
            index,
            1
        );

    saveMobBattleLoadoutConfig();

    return deleted;
}

// --------------------------------------------------
// GET ENABLED LOADOUTS
// --------------------------------------------------

export function getEnabledMobBattleLoadouts() {
    return config.loadouts.filter(
        loadout =>
            loadout.enabled !== false
    );
}

// --------------------------------------------------
// INITIAL LOAD
// --------------------------------------------------

loadMobBattleLoadoutConfig();