// ==========================================
// MOB BATTLE LOADOUT SPAWN ENGINE
// ==========================================
//
// Complete Mob Battle Loadout spawning system.
//
// IMPORTANT:
// This is separate from:
// - TikTok spawning
// - teams.js
// - Zombie Apocalypse
//
// Supports:
// - Quantity
// - Formation
// - Armor
// - Main hand
// - Off hand
// - Enchantments
// - Effects
// - Existing Mob Battle naming
// - Optional Mob Battle combat teams
// - Battlefield spawning
// ==========================================

import {
    getMobBattleLoadout
} from './mobBattleLoadoutConfig.js';

import {
    getMobBattleSpawnName
} from './mobBattleConfig.js';

import {
    sendCommand,
    isMinecraftConnected
} from '../minecraft/lcon.js';

import {
    validateMobBattleEnchantment
} from './mobBattleEnchantment.js';

import {
    ensureMobBattleLoadoutTeams,
    assignMobBattleLoadoutTeam
} from './mobBattleLoadoutTeams.js';


// ==========================================
// SPAWN COUNTER
// ==========================================

let spawnCounter = 0;

// ==========================================
// AUTO FREEZE MOB BATTLE MOBS
// ==========================================

function freezeMobBattleMobs(tags) {

    if (!Array.isArray(tags) || tags.length === 0) {
        return;
    }

    for (const tag of tags) {

        const freezeSent =
            sendCommand(
                `timeclock freeze add @e[tag=${tag}]`
            );

        if (!freezeSent) {

            console.warn(
                `Failed to freeze Mob Battle mob: ${tag}`
            );

            continue;
        }

        console.log(
            `Mob Battle Freeze Applied | Tag: ${tag}`
        );
    }
}

// ==========================================
// SAFETY LIMITS
// ==========================================

const MAX_SPAWN_AMOUNT = 100;

const MAX_BATTLEFIELD_TOTAL_SPAWN = 500;

const FORMATION_COLUMNS = 7;

const FORMATION_SPACING = 2;

const MIN_BATTLEFIELD_SIZE = 1;

const MAX_BATTLEFIELD_SIZE = 500;


// ==========================================
// VALID TEAM VALUES
// ==========================================

const VALID_TEAMS = [
    'A',
    'B'
];


// ==========================================
// NORMALIZE MINECRAFT ID
// ==========================================

function normalizeMinecraftId(id) {

    if (
        !id ||
        typeof id !== 'string'
    ) {
        return null;
    }

    return id.includes(':')
        ? id
        : `minecraft:${id}`;
}


// ==========================================
// ESCAPE JSON STRING
// ==========================================

function escapeJsonText(value) {

    return String(value || '')
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
}


// ==========================================
// ESCAPE NBT STRING
// ==========================================

function escapeNbtString(value) {

    return String(value || '')
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
}


// ==========================================
// VALIDATE ITEM ID
// ==========================================

function validateItemId(
    itemId,
    fieldName
) {

    if (
        itemId === null ||
        itemId === undefined ||
        itemId === ''
    ) {
        return null;
    }

    if (typeof itemId !== 'string') {

        throw new Error(
            `${fieldName} must be a valid item ID.`
        );
    }

    return normalizeMinecraftId(itemId);
}


// ==========================================
// GET ARMOR ITEM
// ==========================================

function getArmorItem(
    armor,
    slot
) {

    if (!armor) {
        return null;
    }

    return validateItemId(
        armor[slot],
        `Armor ${slot}`
    );
}


// ==========================================
// GET WEAPON ITEM
// ==========================================

function getWeaponItem(
    weapon,
    slot
) {

    if (!weapon) {
        return null;
    }

    return validateItemId(
        weapon[slot],
        `Weapon ${slot}`
    );
}


// ==========================================
// GET ENCHANTMENTS FOR TARGET
// ==========================================

function getEnchantmentsForTarget(
    enchantments,
    target
) {

    if (!Array.isArray(enchantments)) {
        return [];
    }

    return enchantments.filter(
        enchantment =>
            enchantment &&
            (
                enchantment.target === target ||
                enchantment.target === 'full_armor'
            )
    );
}

// ==========================================
// BUILD ENCHANTMENT COMPONENTS
// Minecraft 1.21.1
// ==========================================

function buildEnchantmentsComponent(
    enchantments
) {

    if (
        !Array.isArray(enchantments) ||
        enchantments.length === 0
    ) {
        return '';
    }

    const entries =
        enchantments
            .map(enchantment => {

                const id =
                    normalizeMinecraftId(
                        enchantment.id
                    );

                const level =
                    Number(enchantment.level);

                if (
                    !id ||
                    !Number.isInteger(level) ||
                    level < 1
                ) {
                    return null;
                }

                return `"${escapeNbtString(id)}":${level}`;
            })
            .filter(Boolean);

    if (entries.length === 0) {
        return '';
    }

    return (
        `,components:{` +
        `"minecraft:enchantments":{` +
        `levels:{${entries.join(',')}}` +
        `}` +
        `}`
    );
}


// ==========================================
// BUILD ITEM NBT
// Minecraft 1.21.1 ITEM STACK FORMAT
// ==========================================

function buildItemNbt(
    itemId,
    enchantments = []
) {

    if (!itemId) {
        return '{}';
    }

    const enchantmentsComponent =
        buildEnchantmentsComponent(
            enchantments
        );

    return (
        `{` +
        `id:"${escapeNbtString(itemId)}",` +
        `count:1` +
        `${enchantmentsComponent}` +
        `}`
    );
}




// ==========================================
// BUILD ARMOR ITEMS NBT
// ==========================================
//
// Minecraft ArmorItems order:
// [boots, leggings, chestplate, helmet]
// ==========================================

function buildArmorItemsNbt(
    armor,
    enchantments
) {

    const boots =
        getArmorItem(
            armor,
            'boots'
        );

    const leggings =
        getArmorItem(
            armor,
            'leggings'
        );

    const chestplate =
        getArmorItem(
            armor,
            'chestplate'
        );

    const helmet =
        getArmorItem(
            armor,
            'helmet'
        );


    const bootsEnchantments =
        getEnchantmentsForTarget(
            enchantments,
            'boots'
        );

    const leggingsEnchantments =
        getEnchantmentsForTarget(
            enchantments,
            'leggings'
        );

    const chestplateEnchantments =
        getEnchantmentsForTarget(
            enchantments,
            'chestplate'
        );

    const helmetEnchantments =
        getEnchantmentsForTarget(
            enchantments,
            'helmet'
        );


    return (
        '[' +
        buildItemNbt(
            boots,
            bootsEnchantments
        ) +
        ',' +
        buildItemNbt(
            leggings,
            leggingsEnchantments
        ) +
        ',' +
        buildItemNbt(
            chestplate,
            chestplateEnchantments
        ) +
        ',' +
        buildItemNbt(
            helmet,
            helmetEnchantments
        ) +
        ']'
    );
}


// ==========================================
// APPLY MOB EFFECTS
// ==========================================
//
// Effects are stored using Minecraft effect IDs.
// Duration is stored in ticks.
// Amplifier is zero-based:
// 0 = Level I
// 1 = Level II
// 2 = Level III
// ==========================================

function applyMobEffects(
    tag,
    effects
) {

    if (
        !Array.isArray(effects) ||
        effects.length === 0
    ) {
        return;
    }

    for (
        const effect of effects
    ) {

        if (
            !effect ||
            typeof effect !== 'object'
        ) {
            continue;
        }

        const effectId =
            normalizeMinecraftId(
                effect.id
            );

        const amplifier =
            Number(effect.amplifier);

        const durationTicks =
            Number(effect.duration);

        if (
            !effectId ||
            !Number.isInteger(amplifier) ||
            amplifier < 0 ||
            !Number.isInteger(durationTicks) ||
            durationTicks <= 0
        ) {
            console.warn(
                'Skipping invalid Mob Battle effect:',
                effect
            );

            continue;
        }

        const durationSeconds =
            Math.max(
                1,
                Math.ceil(
                    durationTicks / 20
                )
            );

const effectSent = sendCommand(
    `effect give ` +
    `@e[tag=${tag},limit=1] ` +
    `${effectId} ` +
    `${durationSeconds} ` +
    `${amplifier} ` +
    `true`
);

// ==========================================
// FREEZE MOB IMMEDIATELY AFTER SPAWN
// ==========================================

freezeMobBattleMobs([tag]);

if (!effectSent) {
    throw new Error(
        `Failed to send effect command for ${effectId} to ${tag}.`
    );
}

console.log(
    `Mob Battle Effect Applied | ` +
    `Tag: ${tag} | ` +
    `Effect: ${effectId} | ` +
    `Duration: ${durationSeconds}s | ` +
    `Amplifier: ${amplifier}`
);
    }
}


// ==========================================
// BUILD HAND ITEMS NBT
// ==========================================
//
// Minecraft HandItems order:
// [main hand, off hand]
// ==========================================

function buildHandItemsNbt(
    weapon,
    enchantments
) {

    const mainHand =
        getWeaponItem(
            weapon,
            'mainHand'
        );

    const offHand =
        getWeaponItem(
            weapon,
            'offHand'
        );


    const mainHandEnchantments =
        getEnchantmentsForTarget(
            enchantments,
            'main_hand'
        );

    const offHandEnchantments =
        getEnchantmentsForTarget(
            enchantments,
            'off_hand'
        );


    return (
        '[' +
        buildItemNbt(
            mainHand,
            mainHandEnchantments
        ) +
        ',' +
        buildItemNbt(
            offHand,
            offHandEnchantments
        ) +
        ']'
    );
}


// ==========================================
// BUILD COMPLETE MOB NBT
// ==========================================

function buildMobNbt(
   loadout,
   tag,
   displayName,
   facingYaw = null
) {

    const armor =
        loadout.armor || {};

    const weapon =
        loadout.weapon || {};

    const enchantments =
        Array.isArray(loadout.enchantments)
            ? loadout.enchantments
            : [];


    const armorItems =
        buildArmorItemsNbt(
            armor,
            enchantments
        );

    const handItems =
        buildHandItemsNbt(
            weapon,
            enchantments
        );

        const rotationNbt =
    Number.isFinite(
        Number(facingYaw)
    )
        ? `,Rotation:[${Number(facingYaw)}f,0f]`
        : '';

return (
    `{` +
    `Tags:["${escapeNbtString(tag)}"],` +
    `CustomName:'{"text":"${escapeJsonText(displayName)}"}',` +
    `CustomNameVisible:1b,` +
    `ArmorItems:${armorItems},` +
    `HandItems:${handItems}` +
    rotationNbt +
    `}`
);
}


// ==========================================
// VALIDATE ENCHANTMENTS
// ==========================================

function validateEnchantments(
    enchantments,
    loadout
) {
    if (
        enchantments === undefined ||
        enchantments === null
    ) {
        return;
    }

    if (!Array.isArray(enchantments)) {
        throw new Error(
            'Loadout enchantments must be an array.'
        );
    }

    const validatedEnchantments = [];

    for (
        const enchantment of enchantments
    ) {
        if (
            !enchantment ||
            typeof enchantment !== 'object'
        ) {
            throw new Error(
                'Invalid enchantment entry.'
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

        const result =
            validateMobBattleEnchantment(
                enchantment,
                loadout,
                validatedEnchantments
            );

        if (!result.valid) {
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
            ).trim()
        });
    }

    return validatedEnchantments;
}

// ==========================================
// VALIDATE EFFECTS
// ==========================================

function validateEffects(
    effects
) {

    if (
        effects === undefined ||
        effects === null
    ) {
        return;
    }

    if (!Array.isArray(effects)) {

        throw new Error(
            'Loadout effects must be an array.'
        );
    }


    for (
        const effect of effects
    ) {

        if (
            !effect ||
            typeof effect !== 'object'
        ) {

            throw new Error(
                'Invalid effect entry.'
            );
        }


        if (
            !effect.id ||
            typeof effect.id !== 'string'
        ) {

            throw new Error(
                'Effect is missing a valid ID.'
            );
        }


        const amplifier =
            Number(effect.amplifier);


        if (
            !Number.isInteger(amplifier) ||
            amplifier < 0
        ) {

            throw new Error(
                `Invalid effect amplifier: ${effect.id}`
            );
        }


        const duration =
            Number(effect.duration);


        if (
            !Number.isInteger(duration) ||
            duration <= 0
        ) {

            throw new Error(
                `Invalid effect duration: ${effect.id}`
            );
        }
    }
}


// ==========================================
// VALIDATE LOADOUT
// ==========================================

function validateLoadout(
    loadout
) {

    if (!loadout) {

        throw new Error(
            'Loadout not found.'
        );
    }


    if (loadout.enabled === false) {

        throw new Error(
            `Loadout is disabled: ${loadout.name}`
        );
    }


    if (
        !loadout.mobId ||
        typeof loadout.mobId !== 'string'
    ) {

        throw new Error(
            `Loadout has no valid mobId: ${loadout.name}`
        );
    }


    const amount =
        Number(loadout.amount);


    if (
        !Number.isInteger(amount) ||
        amount < 1
    ) {

        throw new Error(
            `Loadout has invalid amount: ${loadout.name}`
        );
    }


    if (
        amount > MAX_SPAWN_AMOUNT
    ) {

        throw new Error(
            `Loadout amount cannot exceed ${MAX_SPAWN_AMOUNT}: ${loadout.name}`
        );
    }


    validateItemId(
        loadout.armor?.helmet,
        'Armor helmet'
    );

    validateItemId(
        loadout.armor?.chestplate,
        'Armor chestplate'
    );

    validateItemId(
        loadout.armor?.leggings,
        'Armor leggings'
    );

    validateItemId(
        loadout.armor?.boots,
        'Armor boots'
    );

    validateItemId(
        loadout.weapon?.mainHand,
        'Weapon main hand'
    );

    validateItemId(
        loadout.weapon?.offHand,
        'Weapon off hand'
    );


 validateEnchantments(
    loadout.enchantments,
    loadout
);

    validateEffects(
        loadout.effects
    );


    return amount;
}


// ==========================================
// GET FORMATION POSITION
// ==========================================

function getFormationPosition(
    index,
    amount
) {

    const totalRows =
        Math.ceil(
            amount /
            FORMATION_COLUMNS
        );


    const column =
        index %
        FORMATION_COLUMNS;

    const row =
        Math.floor(
            index /
            FORMATION_COLUMNS
        );


    const offsetX =
        column *
        FORMATION_SPACING -
        6;


    const offsetZ =
        row *
        FORMATION_SPACING -
        (
            (
                totalRows - 1
            ) *
            FORMATION_SPACING
        ) /
        2;


    return {
        x: offsetX,
        y: 0,
        z: offsetZ
    };
}

// ==========================================
// GET BATTLEFIELD FACING YAW
// ==========================================
//
// Minecraft Java Edition yaw:
// +Z = 0
// -X = 90
// -Z = 180
// +X = -90
//
// Team A and Team B always face opposite
// directions based on the selected battlefield
// direction.
// ==========================================

function getBattlefieldFacingYaw(
    direction,
    team
) {

    const normalizedDirection =
        String(direction || '+X')
            .toUpperCase();

    const normalizedTeam =
        String(team || 'A')
            .toUpperCase();


    if (
        normalizedDirection === '+X'
    ) {

        return normalizedTeam === 'A'
            ? -90
            : 90;
    }


    if (
        normalizedDirection === '-X'
    ) {

        return normalizedTeam === 'A'
            ? 90
            : -90;
    }


    if (
        normalizedDirection === '+Z'
    ) {

        return normalizedTeam === 'A'
            ? 0
            : 180;
    }


    if (
        normalizedDirection === '-Z'
    ) {

        return normalizedTeam === 'A'
            ? 180
            : 0;
    }


    throw new Error(
        `Invalid Battlefield direction: ${direction}`
    );
}
// ==========================================
// GET BATTLEFIELD FORMATION POSITION
// ==========================================
//
// Team A / Team B position = EXACT CENTER
// of that team's formation.
//
// Direction ONLY controls facing direction.
//
// +X:
// Team A faces +X
// Team B faces -X
//
// -X:
// Team A faces -X
// Team B faces +X
//
// +Z:
// Team A faces +Z
// Team B faces -Z
//
// -Z:
// Team A faces -Z
// Team B faces +Z
//
// The supplied coordinate is never offset.
// ==========================================

function getBattlefieldFormationPosition(
    position,
    index,
    amount,
    direction,
    team
) {

    if (!position) {
        throw new Error(
            `Battlefield Team ${team} position is required.`
        );
    }

    const centerX = Number(position.x);
    const y = Number(position.y);
    const centerZ = Number(position.z);

    if (
        !Number.isFinite(centerX) ||
        !Number.isFinite(y) ||
        !Number.isFinite(centerZ)
    ) {
        throw new Error(
            `Battlefield Team ${team} position must contain valid X, Y, and Z coordinates.`
        );
    }

    const normalizedDirection =
        String(direction || '+X').toUpperCase();

    const normalizedTeam =
        String(team || 'A').toUpperCase();

    if (
        ![
            '+X',
            '-X',
            '+Z',
            '-Z'
        ].includes(normalizedDirection)
    ) {
        throw new Error(
            `Invalid Battlefield direction: ${direction}`
        );
    }

    if (
        !VALID_TEAMS.includes(normalizedTeam)
    ) {
        throw new Error(
            `Invalid Battlefield team: ${team}`
        );
    }


    // ==========================================
    // FORMATION SIZE
    // ==========================================

    const maxColumns =
        Math.min(
            FORMATION_COLUMNS,
            amount
        );

    const totalRows =
        Math.ceil(
            amount / maxColumns
        );


    // ==========================================
    // CURRENT ROW / COLUMN
    // ==========================================

    const column =
        index % maxColumns;

    const row =
        Math.floor(
            index / maxColumns
        );


    // ==========================================
    // CENTER COLUMNS
    // ==========================================

    const mobsInCurrentRow =
        Math.min(
            maxColumns,
            amount -
            row * maxColumns
        );

    const columnSpan =
        (
            mobsInCurrentRow - 1
        ) *
        FORMATION_SPACING;

    const columnOffset =
        (
            column *
            FORMATION_SPACING
        ) -
        columnSpan / 2;


    // ==========================================
    // CENTER ROWS
    // ==========================================

    const totalRowSpan =
        (
            totalRows - 1
        ) *
        FORMATION_SPACING;

    const rowOffset =
        (
            row *
            FORMATION_SPACING
        ) -
        totalRowSpan / 2;


    // ==========================================
    // X-FACING
    // ==========================================

    if (
        normalizedDirection === '+X' ||
        normalizedDirection === '-X'
    ) {

        // Formation columns spread across Z.
        const columnZ =
            centerZ +
            columnOffset;

        const facesPositiveX =
            (
                normalizedDirection === '+X' &&
                normalizedTeam === 'A'
            ) ||
            (
                normalizedDirection === '-X' &&
                normalizedTeam === 'B'
            );

        const rowX =
            facesPositiveX
                ? centerX - rowOffset
                : centerX + rowOffset;

        return {
            x: Math.round(rowX),
            y,
            z: Math.round(columnZ)
        };
    }


    // ==========================================
    // Z-FACING
    // ==========================================

    if (
        normalizedDirection === '+Z' ||
        normalizedDirection === '-Z'
    ) {

        // Formation columns spread across X.
        const columnX =
            centerX +
            columnOffset;

        const facesPositiveZ =
            (
                normalizedDirection === '+Z' &&
                normalizedTeam === 'A'
            ) ||
            (
                normalizedDirection === '-Z' &&
                normalizedTeam === 'B'
            );

        const rowZ =
            facesPositiveZ
                ? centerZ - rowOffset
                : centerZ + rowOffset;

        return {
            x: Math.round(columnX),
            y,
            z: Math.round(rowZ)
        };
    }


    throw new Error(
        `Invalid Battlefield direction: ${direction}`
    );
}
// ==========================================
// GET TEAM BATTLEFIELD BOUNDS
// ==========================================
//
// Each team now has its own independent
// battlefield spawn position.
//
// The position represents the front/center
// anchor of that team's formation.
//
// Direction determines which way the team
// faces.
//
// +X:
// Team A faces +X
// Team B faces -X
//
// -X:
// Team A faces -X
// Team B faces +X
//
// +Z:
// Team A faces +Z
// Team B faces -Z
//
// -Z:
// Team A faces -Z
// Team B faces +Z
// ==========================================

function getTeamBattlefieldBounds(
    position,
    width,
    length,
    direction,
    team
) {

    if (!position) {
        throw new Error(
            `Battlefield Team ${team} position is required.`
        );
    }

    const x = Number(position.x);
    const y = Number(position.y);
    const z = Number(position.z);

    if (
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        !Number.isFinite(z)
    ) {
        throw new Error(
            `Battlefield Team ${team} position must contain valid X, Y, and Z coordinates.`
        );
    }

    const normalizedWidth = Number(width);
    const normalizedLength = Number(length);

    if (
        !Number.isInteger(normalizedWidth) ||
        normalizedWidth < MIN_BATTLEFIELD_SIZE ||
        normalizedWidth > MAX_BATTLEFIELD_SIZE
    ) {
        throw new Error(
            `Battlefield width must be between ${MIN_BATTLEFIELD_SIZE} and ${MAX_BATTLEFIELD_SIZE}.`
        );
    }

    if (
        !Number.isInteger(normalizedLength) ||
        normalizedLength < MIN_BATTLEFIELD_SIZE ||
        normalizedLength > MAX_BATTLEFIELD_SIZE
    ) {
        throw new Error(
            `Battlefield length must be between ${MIN_BATTLEFIELD_SIZE} and ${MAX_BATTLEFIELD_SIZE}.`
        );
    }

    const normalizedDirection =
        String(direction || '+X')
            .toUpperCase();

    const normalizedTeam =
        String(team || 'A')
            .toUpperCase();

    if (
        ![
            '+X',
            '-X',
            '+Z',
            '-Z'
        ].includes(normalizedDirection)
    ) {
        throw new Error(
            `Invalid Battlefield direction: ${direction}`
        );
    }

    if (
        !VALID_TEAMS.includes(normalizedTeam)
    ) {
        throw new Error(
            `Invalid Battlefield team: ${team}`
        );
    }

    // ==========================================
    // X-FACING
    // ==========================================

    if (
        normalizedDirection === '+X' ||
        normalizedDirection === '-X'
    ) {

        const facesPositiveX =
            (
                normalizedDirection === '+X' &&
                normalizedTeam === 'A'
            ) ||
            (
                normalizedDirection === '-X' &&
                normalizedTeam === 'B'
            );

        if (facesPositiveX) {

            return {
                minX: x,
                maxX: x + normalizedWidth - 1,
                y,
                minZ: z - Math.floor(normalizedLength / 2),
                maxZ:
                    z -
                    Math.floor(normalizedLength / 2) +
                    normalizedLength - 1
            };

        }

        return {
            minX:
                x -
                normalizedWidth +
                1,

            maxX: x,

            y,

            minZ:
                z -
                Math.floor(normalizedLength / 2),

            maxZ:
                z -
                Math.floor(normalizedLength / 2) +
                normalizedLength - 1
        };
    }

    // ==========================================
    // Z-FACING
    // ==========================================

    if (
        normalizedDirection === '+Z' ||
        normalizedDirection === '-Z'
    ) {

        const facesPositiveZ =
            (
                normalizedDirection === '+Z' &&
                normalizedTeam === 'A'
            ) ||
            (
                normalizedDirection === '-Z' &&
                normalizedTeam === 'B'
            );

        if (facesPositiveZ) {

            return {
                minX:
                    x -
                    Math.floor(normalizedWidth / 2),

                maxX:
                    x -
                    Math.floor(normalizedWidth / 2) +
                    normalizedWidth - 1,

                y,

                minZ: z,

                maxZ:
                    z +
                    normalizedLength - 1
            };

        }

        return {
            minX:
                x -
                Math.floor(normalizedWidth / 2),

            maxX:
                x -
                Math.floor(normalizedWidth / 2) +
                normalizedWidth - 1,

            y,

            minZ:
                z -
                normalizedLength +
                1,

            maxZ: z
        };
    }

    throw new Error(
        `Invalid Battlefield direction: ${direction}`
    );
}

// ==========================================
// SPAWN MOB BATTLE LOADOUT
// ==========================================

export function spawnMobBattleLoadout(
    loadoutId,
    donorName = null,
    team = null
) {

    const loadout =
        getMobBattleLoadout(
            loadoutId
        );


    const amount =
        validateLoadout(
            loadout
        );


    const summonId =
        normalizeMinecraftId(
            loadout.mobId
        );


    const normalizedTeam =
        team
            ? String(team).toUpperCase()
            : null;


    if (
        normalizedTeam &&
        !VALID_TEAMS.includes(
            normalizedTeam
        )
    ) {

        throw new Error(
            `Invalid Mob Battle team: ${team}`
        );
    }


    if (normalizedTeam) {
        ensureMobBattleLoadoutTeams();
    }


    const spawnedMobs = [];


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        spawnCounter++;


        const tag =
            `mobbattle_loadout_${spawnCounter}`;


     
        const position =
    getFormationPosition(
        i,
        amount
    );

const displayName =
    getMobBattleSpawnName(
        normalizedTeam,
        donorName
    );

const nbt =
    buildMobNbt(
        loadout,
        tag,
        displayName
    );

        console.log(
            `Mob Battle Loadout Spawn | ` +
            `Loadout: ${loadout.name} | ` +
            `Mob: ${summonId} | ` +
            `Spawn: ${i + 1}/${amount} | ` +
            `Team: ${normalizedTeam || 'None'} | ` +
            `Tag: ${tag} | ` +
            `Name: ${displayName}`
        );


        sendCommand(
            `summon ${summonId} ` +
            `~${position.x} ` +
            `~${position.y} ` +
            `~${position.z} ` +
            `${nbt}`
        );


        if (normalizedTeam) {

            assignMobBattleLoadoutTeam(
                tag,
                normalizedTeam
            );
        }


        applyMobEffects(
            tag,
            loadout.effects
        );


        spawnedMobs.push({
            index: i + 1,
            tag,
            mobId: summonId,
            displayName,
            team: normalizedTeam,
            position
        });
    }


    console.log(
        `Mob Battle Loadout Spawn Complete | ` +
        `Loadout: ${loadout.name} | ` +
        `Mob: ${summonId} | ` +
        `Quantity: ${amount} | ` +
        `Team: ${normalizedTeam || 'None'}`
    );

   

    return {
        success: true,
        loadoutId: loadout.id,
        loadoutName: loadout.name,
        mobId: summonId,
        amount,
        spawned: spawnedMobs.length,
        team: normalizedTeam,
        mobs: spawnedMobs
    };
}


// ==========================================
// SPAWN MOB BATTLE LOADOUT IN BATTLEFIELD
// ==========================================
//
// This is separate from the normal
// spawnMobBattleLoadout() function.
//
// The existing loadout spawn uses a fixed
// formation relative to the player.
//
// Battlefield spawning instead uses absolute
// coordinates inside Team A or Team B bounds.
//
// All existing loadout functionality is
// preserved:
// - Armor
// - Weapons
// - Enchantments
// - Effects
// - Naming
// - Team assignment
// ==========================================

export function spawnMobBattleLoadoutInBattlefield(
    {
        teamAPosition,
        teamBPosition,
        width,
        length,
        direction = '+X',
        teamA = [],
        teamB = [],
        donorName = null
    } = {}
) {

    if (!isMinecraftConnected()) {
        throw new Error(
            'Minecraft LCon is disconnected. Connect Minecraft before spawning the battlefield.'
        );
    }


    if (!Array.isArray(teamA)) {
        throw new Error(
            'Battlefield Team A loadouts must be an array.'
        );
    }


    if (!Array.isArray(teamB)) {
        throw new Error(
            'Battlefield Team B loadouts must be an array.'
        );
    }


    // ==========================================
    // NORMALIZE DIRECTION
    // ==========================================

    const normalizedDirection =
        String(direction || '+X')
            .toUpperCase();


    // ==========================================
    // VALIDATE TEAM A BOUNDS
    // ==========================================

    const teamABounds =
        getTeamBattlefieldBounds(
            teamAPosition,
            width,
            length,
            normalizedDirection,
            'A'
        );


    // ==========================================
    // VALIDATE TEAM B BOUNDS
    // ==========================================

    const teamBBounds =
        getTeamBattlefieldBounds(
            teamBPosition,
            width,
            length,
            normalizedDirection,
            'B'
        );


    // ==========================================
    // NORMALIZE LOADOUT ROWS
    // ==========================================

    const normalizeRows =
        (rows, team) => {

            return rows.map(
                (row, index) => {

                    if (
                        !row ||
                        typeof row !== 'object'
                    ) {

                        throw new Error(
                            `Invalid Team ${team} loadout row at index ${index}.`
                        );
                    }


                    const loadoutId =
                        String(
                            row.loadoutId || ''
                        ).trim();


                    if (!loadoutId) {

                        throw new Error(
                            `Team ${team} loadout row ${index + 1} is missing a loadout ID.`
                        );
                    }


                    const loadout =
                        getMobBattleLoadout(
                            loadoutId
                        );


                    // ==========================================
                    // VALIDATE ACTUAL LOADOUT
                    // ==========================================

                    validateLoadout(
                        loadout
                    );


                    // ==========================================
                    // GET REQUESTED BATTLEFIELD AMOUNT
                    // ==========================================

                    const requestedAmount =
                        row.amount === undefined
                            ? Number(loadout.amount)
                            : Number(row.amount);


                    if (
                        !Number.isInteger(
                            requestedAmount
                        ) ||
                        requestedAmount < 1
                    ) {

                        throw new Error(
                            `Team ${team} loadout "${loadout.name}" has an invalid Battlefield amount.`
                        );
                    }


                    if (
                        requestedAmount >
                        MAX_SPAWN_AMOUNT
                    ) {

                        throw new Error(
                            `Team ${team} loadout "${loadout.name}" cannot exceed ${MAX_SPAWN_AMOUNT} Battlefield mobs.`
                        );
                    }


                    return {
                        loadout,
                        loadoutId,
                        amount: requestedAmount,
                        team
                    };
                }
            );
        };


    // ==========================================
    // NORMALIZE TEAM A
    // ==========================================

    const normalizedTeamA =
        normalizeRows(
            teamA,
            'A'
        );


    // ==========================================
    // NORMALIZE TEAM B
    // ==========================================

    const normalizedTeamB =
        normalizeRows(
            teamB,
            'B'
        );


    // ==========================================
    // TOTAL TEAM A
    // ==========================================

    const totalTeamA =
        normalizedTeamA.reduce(
            (total, row) =>
                total + row.amount,
            0
        );


    // ==========================================
    // TOTAL TEAM B
    // ==========================================

    const totalTeamB =
        normalizedTeamB.reduce(
            (total, row) =>
                total + row.amount,
            0
        );


    // ==========================================
    // TOTAL REQUESTED
    // ==========================================

    const totalRequested =
        totalTeamA +
        totalTeamB;


    if (
        totalRequested === 0
    ) {

        throw new Error(
            'Battlefield has no mobs to spawn.'
        );
    }


    // ==========================================
    // GLOBAL BATTLEFIELD SAFETY LIMIT
    // ==========================================

    if (
        totalRequested >
        MAX_BATTLEFIELD_TOTAL_SPAWN
    ) {

        throw new Error(
            `Battlefield cannot spawn more than ${MAX_BATTLEFIELD_TOTAL_SPAWN} mobs at once. Requested: ${totalRequested}`
        );
    }


    // ==========================================
    // ENSURE MINECRAFT COMBAT TEAMS
    // ==========================================

    ensureMobBattleLoadoutTeams();


    // ==========================================
    // SPAWN RESULT STORAGE
    // ==========================================

    const spawnedMobs = [];


    // ==========================================
    // INTERNAL TEAM SPAWNER
    // ==========================================

    const spawnTeam =
        (rows, team) => {

            for (
                const row of rows
            ) {

                const loadout =
                    row.loadout;


                const summonId =
                    normalizeMinecraftId(
                        loadout.mobId
                    );


                // ==========================================
                // GET TEAM POSITION
                // ==========================================

                const teamPosition =
                    team === 'A'
                        ? teamAPosition
                        : teamBPosition;


                // ==========================================
                // GET TEAM FACING
                // ==========================================

                const facingYaw =
                    getBattlefieldFacingYaw(
                        normalizedDirection,
                        team
                    );


                // ==========================================
                // SPAWN EACH MOB
                // ==========================================

                for (
                    let i = 0;
                    i < row.amount;
                    i++
                ) {

                    spawnCounter++;


                    // ==========================================
                    // UNIQUE MOB TAG
                    // ==========================================

                    const tag =
                        `mobbattle_loadout_${spawnCounter}`;


                    // ==========================================
                    // GET FORMATION POSITION
                    // ==========================================

                    const position =
                        getBattlefieldFormationPosition(
                            teamPosition,
                            i,
                            row.amount,
                            normalizedDirection,
                            team
                        );


                    // ==========================================
                    // GET DISPLAY NAME
                    // ==========================================

                    const displayName =
                        getMobBattleSpawnName(
                            team,
                            donorName
                        );


                    // ==========================================
                    // BUILD MOB NBT
                    // ==========================================

                    const nbt =
                        buildMobNbt(
                            loadout,
                            tag,
                            displayName,
                            facingYaw
                        );


                    // ==========================================
                    // LOG SPAWN
                    // ==========================================

                    console.log(
                        `Mob Battle Battlefield Spawn | ` +
                        `Loadout: ${loadout.name} | ` +
                        `Mob: ${summonId} | ` +
                        `Spawn: ${i + 1}/${row.amount} | ` +
                        `Team: ${team} | ` +
                        `Tag: ${tag} | ` +
                        `Name: ${displayName} | ` +
                        `Facing: ${facingYaw} | ` +
                        `Position: ${position.x},${position.y},${position.z}`
                    );


                    // ==========================================
                    // SUMMON MOB
                    // ==========================================

                    const summonSent =
                        sendCommand(
                            `summon ${summonId} ` +
                            `${position.x} ` +
                            `${position.y} ` +
                            `${position.z} ` +
                            `${nbt}`
                        );

                        // ==========================================
                        // FREEZE MOB IMMEDIATELY AFTER SPAWN
                        // ==========================================

                        freezeMobBattleMobs([tag]);


                    if (!summonSent) {

                        throw new Error(
                            `Failed to send summon command for ${summonId} at ${position.x},${position.y},${position.z}.`
                        );
                    }


                    // ==========================================
                    // ASSIGN COMBAT TEAM
                    // ==========================================

                    assignMobBattleLoadoutTeam(
                        tag,
                        team
                    );


                    // ==========================================
                    // APPLY LOADOUT EFFECTS
                    // ==========================================

                    applyMobEffects(
                        tag,
                        loadout.effects
                    );


                    // ==========================================
                    // STORE SPAWN RESULT
                    // ==========================================

                    spawnedMobs.push({
                        index:
                            spawnedMobs.length + 1,

                        loadoutId:
                            loadout.id,

                        loadoutName:
                            loadout.name,

                        tag,

                        mobId:
                            summonId,

                        displayName,

                        team,

                        facingYaw,

                        position
                    });
                }
            }
        };


    // ==========================================
    // SPAWN TEAM A
    // ==========================================

    spawnTeam(
        normalizedTeamA,
        'A'
    );


    // ==========================================
    // SPAWN TEAM B
    // ==========================================

    spawnTeam(
        normalizedTeamB,
        'B'
    );



    // ==========================================
    // SPAWN COMPLETE LOG
    // ==========================================

    console.log(
        `Mob Battle Battlefield Spawn Complete | ` +
        `Direction: ${normalizedDirection} | ` +
        `Width: ${Number(width)} | ` +
        `Length: ${Number(length)} | ` +
        `Team A: ${totalTeamA} | ` +
        `Team B: ${totalTeamB} | ` +
        `Total: ${totalRequested}`
    );


    // ==========================================
    // RETURN RESULT
    // ==========================================

    return {
        success: true,

        direction:
            normalizedDirection,

        width:
            Number(width),

        length:
            Number(length),

        teamAPosition,

        teamBPosition,

        bounds: {
            A: teamABounds,
            B: teamBBounds
        },

        teamA: {
            requested:
                totalTeamA,

            spawned:
                spawnedMobs.filter(
                    mob =>
                        mob.team === 'A'
                ).length
        },

        teamB: {
            requested:
                totalTeamB,

            spawned:
                spawnedMobs.filter(
                    mob =>
                        mob.team === 'B'
                ).length
        },

        totalRequested,

        spawned:
            spawnedMobs.length,

        mobs:
            spawnedMobs
    };
}


