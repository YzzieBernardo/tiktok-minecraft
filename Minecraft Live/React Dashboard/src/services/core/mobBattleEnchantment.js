import { getMobBattleCatalog } from './mobBattleCatalog.js';

const ENCHANTMENT_CATALOG = 'enchantments';

const ARMOR_TARGETS = [
    'helmet',
    'chestplate',
    'leggings',
    'boots'
];

const EQUIPMENT_TARGETS = [
    'full_armor',
    ...ARMOR_TARGETS,
    'main_hand',
    'off_hand'
];

function normalizeId(id) {
    return String(id || '').trim().toLowerCase();
}

function getEnchantmentCatalog() {
    return getMobBattleCatalog(ENCHANTMENT_CATALOG);
}

export function getMobBattleEnchantment(id) {
    const normalizedId = normalizeId(id);

    return (
        getEnchantmentCatalog().find(
            enchantment =>
                normalizeId(enchantment.id) === normalizedId
        ) || null
    );
}

// ==================================================
// ENCHANTMENT TARGETS
// ==================================================

export function getMobBattleEnchantmentTargets() {
    return [
        {
            id: 'full_armor',
            name: 'Full Armor'
        },
        {
            id: 'helmet',
            name: 'Helmet'
        },
        {
            id: 'chestplate',
            name: 'Chestplate'
        },
        {
            id: 'leggings',
            name: 'Leggings'
        },
        {
            id: 'boots',
            name: 'Boots'
        },
        {
            id: 'main_hand',
            name: 'Main Hand'
        },
        {
            id: 'off_hand',
            name: 'Off Hand'
        }
    ];
}

// ==================================================
// EQUIPMENT TYPE DETECTION
// ==================================================

function getEquipmentType(itemId) {
    const id = normalizeId(itemId);

    if (!id) {
        return null;
    }

    // ----------------------------------------------
    // NEVER ENCHANTABLE / SPECIAL ITEMS
    // ----------------------------------------------

    if (id.endsWith(':totem_of_undying')) {
        return 'totem';
    }

    // ----------------------------------------------
    // RANGED WEAPONS
    // ----------------------------------------------

    if (id.endsWith(':bow')) {
        return 'bow';
    }

    if (id.endsWith(':crossbow')) {
        return 'crossbow';
    }

    if (id.endsWith(':trident')) {
        return 'trident';
    }

    // ----------------------------------------------
    // SPECIAL EQUIPMENT
    // ----------------------------------------------

    if (id.endsWith(':shield')) {
        return 'shield';
    }

    if (id.endsWith(':elytra')) {
        return 'elytra';
    }

    if (id.endsWith(':fishing_rod')) {
        return 'fishing_rod';
    }

    if (id.endsWith(':shears')) {
        return 'shears';
    }

    if (id.endsWith(':flint_and_steel')) {
        return 'flint_and_steel';
    }

    if (id.endsWith(':brush')) {
        return 'brush';
    }

    if (id.endsWith(':carrot_on_a_stick')) {
        return 'carrot_on_a_stick';
    }

    if (id.endsWith(':warped_fungus_on_a_stick')) {
        return 'warped_fungus_on_a_stick';
    }

    // ----------------------------------------------
    // MACE
    // ----------------------------------------------

    if (id.endsWith(':mace')) {
        return 'mace';
    }

    // ----------------------------------------------
    // ARMOR
    // ----------------------------------------------

    if (
        id.includes('helmet') ||
        id.endsWith('_head') ||
        id.includes('skull')
    ) {
        return 'helmet';
    }

    if (id.includes('chestplate')) {
        return 'chestplate';
    }

    if (id.endsWith(':elytra')) {
        return 'elytra';
    }

    if (id.includes('leggings')) {
        return 'leggings';
    }

    if (id.includes('boots')) {
        return 'boots';
    }

    // ----------------------------------------------
    // MELEE / TOOLS
    // ----------------------------------------------

    if (id.includes('sword')) {
        return 'sword';
    }

    if (id.includes('pickaxe')) {
        return 'pickaxe';
    }

    if (id.includes('shovel')) {
        return 'shovel';
    }

    if (id.includes('hoe')) {
        return 'hoe';
    }

    if (id.includes('axe')) {
        return 'axe';
    }

    return null;
}

// ==================================================
// LOADOUT EQUIPMENT
// ==================================================

function getLoadoutEquipment(loadout, target) {
    if (target === 'helmet') {
        return [
            loadout?.armor?.helmet
        ];
    }

    if (target === 'chestplate') {
        return [
            loadout?.armor?.chestplate
        ];
    }

    if (target === 'leggings') {
        return [
            loadout?.armor?.leggings
        ];
    }

    if (target === 'boots') {
        return [
            loadout?.armor?.boots
        ];
    }

    if (target === 'main_hand') {
        return [
            loadout?.weapon?.mainHand
        ];
    }

    if (target === 'off_hand') {
        return [
            loadout?.weapon?.offHand
        ];
    }

    if (target === 'full_armor') {
        return [
            loadout?.armor?.helmet,
            loadout?.armor?.chestplate,
            loadout?.armor?.leggings,
            loadout?.armor?.boots
        ];
    }

    return [];
}

// ==================================================
// HARD EQUIPMENT RULES
// ==================================================

function isEquipmentEnchantable(equipmentType) {
    const nonEnchantableTypes = [
        'totem'
    ];

    return !nonEnchantableTypes.includes(
        equipmentType
    );
}

// ==================================================
// COMPATIBILITY
// ==================================================

export function isMobBattleEnchantmentCompatible(
    enchantmentId,
    loadout,
    target
) {
    const enchantment =
        getMobBattleEnchantment(
            enchantmentId
        );

    // ----------------------------------------------
    // ENCHANTMENT EXISTS
    // ----------------------------------------------

    if (!enchantment) {
        return {
            valid: false,
            reason:
                'Enchantment does not exist in the catalog.'
        };
    }

    // ----------------------------------------------
    // VALID TARGET
    // ----------------------------------------------

    if (!EQUIPMENT_TARGETS.includes(target)) {
        return {
            valid: false,
            reason:
                'Invalid enchantment target.'
        };
    }

    // ----------------------------------------------
    // GET EQUIPMENT
    // ----------------------------------------------

    const equipment =
        getLoadoutEquipment(
            loadout,
            target
        );

    if (equipment.length === 0) {
        return {
            valid: false,
            reason:
                'No equipment was selected for this target.'
        };
    }

    // ----------------------------------------------
    // EVERY SLOT MUST HAVE EQUIPMENT
    // ----------------------------------------------

    if (
        equipment.some(
            item => !item
        )
    ) {
        return {
            valid: false,
            reason:
                'Every selected equipment slot must contain an item.'
        };
    }

    // ----------------------------------------------
    // DETERMINE EQUIPMENT TYPES
    // ----------------------------------------------

    const equipmentTypes =
        equipment.map(
            getEquipmentType
        );

    if (
        equipmentTypes.some(
            type => !type
        )
    ) {
        return {
            valid: false,
            reason:
                'Unable to determine the equipment type.'
        };
    }

    // ----------------------------------------------
    // HARD BLOCK NON-ENCHANTABLE ITEMS
    // ----------------------------------------------

    if (
        equipmentTypes.some(
            type =>
                !isEquipmentEnchantable(type)
        )
    ) {
        return {
            valid: false,
            reason:
                'This equipment cannot receive enchantments.'
        };
    }

    // ----------------------------------------------
    // FULL ARMOR
    // ----------------------------------------------

    if (target === 'full_armor') {
        const validForEveryArmorPiece =
            equipmentTypes.every(
                type =>
                    enchantment.appliesTo?.includes(
                        type
                    )
            );

        if (!validForEveryArmorPiece) {
            return {
                valid: false,
                reason:
                    `${enchantment.name} cannot be applied to every armor piece.`
            };
        }

        return {
            valid: true,
            reason: null
        };
    }

    // ----------------------------------------------
    // SINGLE EQUIPMENT
    // ----------------------------------------------

    const equipmentType =
        equipmentTypes[0];

    if (
        !enchantment.appliesTo?.includes(
            equipmentType
        )
    ) {
        return {
            valid: false,
            reason:
                `${enchantment.name} cannot be applied to ${equipmentType}.`
        };
    }

    return {
        valid: true,
        reason: null
    };
}

// ==================================================
// ENCHANTMENT CONFLICTS
// ==================================================

export function hasMobBattleEnchantmentConflict(
    enchantments,
    enchantmentId,
    target,
    allowIncompatible = false
) {
    const newEnchantment =
        getMobBattleEnchantment(
            enchantmentId
        );

    if (!newEnchantment) {
        return {
            conflict: true,
            reason:
                'Enchantment does not exist in the catalog.'
        };
    }

    const existingEnchantments =
        Array.isArray(enchantments)
            ? enchantments
            : [];

    for (
        const existing
        of existingEnchantments
    ) {
        if (!existing) {
            continue;
        }

        // ------------------------------------------
        // SAME ENCHANTMENT
        // ------------------------------------------

        if (
            normalizeId(existing.id) ===
                normalizeId(enchantmentId) &&
            existing.target === target
        ) {
            return {
                conflict: true,
                reason:
                    `${newEnchantment.name} is already added to this target.`
            };
        }

        // ------------------------------------------
        // ONLY SAME TARGET CAN CONFLICT
        // ------------------------------------------

      if (
    existing.target !== target
) {
    continue;
}

// Explicit override bypasses incompatibility conflicts only.
// Duplicate same-enchantment entries are still blocked above.
if (allowIncompatible === true) {
    continue;
}

const existingEnchantment =
    getMobBattleEnchantment(
        existing.id
    );

        if (!existingEnchantment) {
            continue;
        }

        // ------------------------------------------
        // NEW -> EXISTING
        // ------------------------------------------

        const incompatibleIds =
            Array.isArray(
                newEnchantment.incompatibleWith
            )
                ? newEnchantment.incompatibleWith
                : [];

        if (
            incompatibleIds.some(
                id =>
                    normalizeId(id) ===
                    normalizeId(existing.id)
            )
        ) {
            return {
                conflict: true,
                reason:
                    `${newEnchantment.name} is incompatible with ` +
                    `${existingEnchantment.name}.`
            };
        }

        // ------------------------------------------
        // EXISTING -> NEW
        //
        // This makes the check symmetric.
        // ------------------------------------------

        const existingIncompatibleIds =
            Array.isArray(
                existingEnchantment.incompatibleWith
            )
                ? existingEnchantment.incompatibleWith
                : [];

        if (
            existingIncompatibleIds.some(
                id =>
                    normalizeId(id) ===
                    normalizeId(enchantmentId)
            )
        ) {
            return {
                conflict: true,
                reason:
                    `${newEnchantment.name} is incompatible with ` +
                    `${existingEnchantment.name}.`
            };
        }
    }

    return {
        conflict: false,
        reason: null
    };
}

// ==================================================
// COMPLETE ENCHANTMENT VALIDATION
// ==================================================

export function validateMobBattleEnchantment(
    enchantment,
    loadout,
    existingEnchantments = []
) {
    // ----------------------------------------------
    // VALID ENCHANTMENT OBJECT
    // ----------------------------------------------

    if (
        !enchantment ||
        typeof enchantment !== 'object'
    ) {
        return {
            valid: false,
            reason:
                'Invalid enchantment data.'
        };
    }

    const enchantmentId =
        normalizeId(
            enchantment.id
        );

    const target =
        String(
            enchantment.target || ''
        ).trim();

    const level =
        Number(
            enchantment.level
        );

    // ----------------------------------------------
    // ENCHANTMENT EXISTS
    // ----------------------------------------------

    const catalogEntry =
        getMobBattleEnchantment(
            enchantmentId
        );

    if (!catalogEntry) {
        return {
            valid: false,
            reason:
                'Enchantment does not exist in the catalog.'
        };
    }

    // ----------------------------------------------
    // TARGET EXISTS
    // ----------------------------------------------

    if (
        !EQUIPMENT_TARGETS.includes(
            target
        )
    ) {
        return {
            valid: false,
            reason:
                'Invalid enchantment target.'
        };
    }

    // ----------------------------------------------
    // LEVEL
    // ----------------------------------------------

    if (
        !Number.isInteger(level) ||
        level < 1
    ) {
        return {
            valid: false,
            reason:
                'Enchantment level must be a positive integer.'
        };
    }

    // ----------------------------------------------
// MAX LEVEL
// ----------------------------------------------
//
// catalogEntry.maxLevel remains the NORMAL Minecraft
// maximum shown by the catalog.
//
// Extended levels are allowed up to the absolute
// limit of 255.
// ----------------------------------------------

const MAX_ENCHANTMENT_LEVEL = 255;

if (level > MAX_ENCHANTMENT_LEVEL) {
    return {
        valid: false,
        reason:
            `${catalogEntry.name} has a maximum extended level of ` +
            `${MAX_ENCHANTMENT_LEVEL}.`
    };
}

    // ----------------------------------------------
    // EQUIPMENT COMPATIBILITY
    // ----------------------------------------------

    const compatibility =
        isMobBattleEnchantmentCompatible(
            enchantmentId,
            loadout,
            target
        );

    if (!compatibility.valid) {
        return compatibility;
    }

    // ----------------------------------------------
    // CONFLICTS
    // ----------------------------------------------

const conflict =
    hasMobBattleEnchantmentConflict(
        existingEnchantments,
        enchantmentId,
        target,
        enchantment.allowIncompatible === true
    );

    if (conflict.conflict) {
        return {
            valid: false,
            reason:
                conflict.reason
        };
    }

    return {
        valid: true,
        reason: null
    };
}

// ==================================================
// GET COMPATIBLE ENCHANTMENTS
// ==================================================

export function getCompatibleMobBattleEnchantments(
    loadout,
    target
) {
    const catalog =
        getEnchantmentCatalog();

    if (!Array.isArray(catalog)) {
        return [];
    }

    return catalog.filter(
        enchantment => {
            const compatibility =
                isMobBattleEnchantmentCompatible(
                    enchantment.id,
                    loadout,
                    target
                );

            return compatibility.valid;
        }
    );
}

// ==================================================
// PUBLIC EQUIPMENT TYPE
// ==================================================

export function getMobBattleEquipmentType(
    itemId
) {
    return getEquipmentType(
        itemId
    );
}