//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\Zombie Apocalypse\zombieGiftManager.js
// ==========================================
// ZOMBIE APOCALYPSE V2
// GIFT MANAGER
// ==========================================
//
// This file is ONLY for Zombie Apocalypse.
//
// Responsibilities:
// - Store Zombie Apocalypse gift rules
// - Create gift rules
// - Read gift rules
// - Update gift rules
// - Delete gift rules
// - Enable / disable gift rules
//
// IMPORTANT:
// This does NOT modify GiftManager.js.
// ==========================================


// ==========================================
// STORAGE
// ==========================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const GIFT_RULES_FILE =
    path.join(
        __dirname,
        'zombieGiftRules.json'
    );

let zombieGiftRules = [];

// ==========================================
// LOAD GIFT RULES
// ==========================================

function loadZombieGiftRules() {

    try {

        if (!fs.existsSync(GIFT_RULES_FILE)) {

            zombieGiftRules = [];

            return;
        }

        const fileData =
            fs.readFileSync(
                GIFT_RULES_FILE,
                'utf8'
            );

        const parsed =
            JSON.parse(fileData);

        if (!Array.isArray(parsed)) {

            zombieGiftRules = [];

            return;
        }

        zombieGiftRules = parsed;

        console.log(
            `Zombie Apocalypse V2: Loaded ${zombieGiftRules.length} gift rule(s).`
        );

    } catch (error) {

        console.error(
            'Zombie Apocalypse V2: Failed to load gift rules:',
            error
        );

        zombieGiftRules = [];
    }
}

// ==========================================
// SAVE GIFT RULES
// ==========================================

function saveZombieGiftRules() {

    try {

        fs.writeFileSync(
            GIFT_RULES_FILE,
            JSON.stringify(
                zombieGiftRules,
                null,
                4
            ),
            'utf8'
        );

        console.log(
            'Zombie Apocalypse V2: Gift rules saved.'
        );

        return true;

    } catch (error) {

        console.error(
            'Zombie Apocalypse V2: Failed to save gift rules:',
            error
        );

        return false;
    }
}

// ==========================================
// INITIAL LOAD
// ==========================================

loadZombieGiftRules();


// ==========================================
// ID VALIDATION
// ==========================================

function normalizeGiftId(giftId) {

    const id =
        Number(giftId);

    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}


// ==========================================
// CREATE
// ==========================================

export function createZombieGiftRule({
    giftId,
    giftName = 'Unknown Gift',
    action = 'spawn_mob',
    rewardName = '',
    amount = 1,
    mobId = '',
    enabled = true,
} = {}) {

    const id =
        normalizeGiftId(giftId);

    if (id === null) {
        throw new Error(
            'Invalid TikTok Gift ID.'
        );
    }


    // Prevent duplicate TikTok Gift IDs.
    const existing =
        zombieGiftRules.find(
            rule =>
                rule.giftId === id
        );

    if (existing) {
        throw new Error(
            `Gift ID ${id} already exists.`
        );
    }

    if (!String(rewardName || '').trim()) {
    throw new Error(
        'Reward name is required.'
    );
}

const rule = {
    giftId: id,

    giftName:
        String(giftName || 'Unknown Gift'),

    action:
        action === 'give_item'
            ? 'give_item'
            : 'spawn_mob',

rewardName:
    String(rewardName || '').trim(),

amount:
    Math.max(
        1,
        Number(amount) || 1
    ),

mobId:
String(
    mobId ||
    rewardName ||
    ''
).trim(),

enabled:
    Boolean(enabled),

    createdAt:
        Date.now(),

    updatedAt:
        Date.now(),
};

zombieGiftRules.push(rule);

saveZombieGiftRules();


    console.log('');
    console.log('==============================');
    console.log('ZOMBIE APOCALYPSE V2');
    console.log('GIFT RULE CREATED');
    console.log(`Gift ID: ${rule.giftId}`);
    console.log(`Gift: ${rule.giftName}`);
    console.log(`Action: ${rule.action}`);
    console.log(`Reward Type: ${
        rule.action === 'give_item'
            ? 'Item'
            : 'Mob'
    }`);

console.log(`Reward: ${rule.rewardName || '-'}`);
console.log(`Amount: ${rule.amount}`);
console.log(`Enabled: ${rule.enabled}`);
    console.log('==============================');


    return {
        ...rule,
    };
}


// ==========================================
// READ ALL
// ==========================================

export function getZombieGiftRules() {

    return zombieGiftRules.map(
        rule => ({
            ...rule,
        })
    );
}


// ==========================================
// READ ONE
// ==========================================

export function getZombieGiftRule(
    giftId
) {

    const id =
        normalizeGiftId(giftId);

    if (id === null) {
        return null;
    }


    const rule =
        zombieGiftRules.find(
            item =>
                item.giftId === id
        );


    if (!rule) {
        return null;
    }


    return {
        ...rule,
    };
}


// ==========================================
// UPDATE
// ==========================================

export function updateZombieGiftRule(
    giftId,
    updates = {}
) {

    const id =
        normalizeGiftId(giftId);


    if (id === null) {

        throw new Error(
            'Invalid TikTok Gift ID.'
        );

    }


    const index =
        zombieGiftRules.findIndex(
            rule =>
                rule.giftId === id
        );


    if (index === -1) {

        throw new Error(
            `Gift ID ${id} was not found.`
        );

    }


    const rule =
        zombieGiftRules[index];


    // ==========================================
    // UPDATE GIFT NAME
    // ==========================================

    if (updates.giftName !== undefined) {

        rule.giftName =
            String(
                updates.giftName ||
                'Unknown Gift'
            );

    }


    // ==========================================
    // UPDATE ACTION
    // ==========================================

    if (updates.action !== undefined) {

        rule.action =
            updates.action === 'give_item'
                ? 'give_item'
                : 'spawn_mob';

    }


    // ==========================================
    // UPDATE AMOUNT
    // ==========================================

    if (updates.amount !== undefined) {

        rule.amount =
            Math.max(
                1,
                Number(updates.amount) || 1
            );

    }


    // ==========================================
    // UPDATE REWARD NAME
    // ==========================================

    if (updates.rewardName !== undefined) {

        const rewardName =
            String(
                updates.rewardName || ''
            ).trim();


        if (!rewardName) {

            throw new Error(
                'Reward name is required.'
            );

        }


        rule.rewardName =
            rewardName;


        // ==========================================
        // IMPORTANT:
        // If this is a MOB gift and mobId was not
        // explicitly supplied, use rewardName as mobId.
        //
        // Example:
        // rewardName = mutantmonsters:mutant_zombie
        //
        // Automatically becomes:
        // mobId = mutantmonsters:mutant_zombie
        // ==========================================

        if (
            rule.action === 'spawn_mob' &&
            updates.mobId === undefined
        ) {

            rule.mobId =
                rewardName;

        }

    }


    // ==========================================
    // UPDATE MOB ID
    // ==========================================

    if (updates.mobId !== undefined) {

        rule.mobId =
            String(
                updates.mobId ||
                rule.rewardName ||
                ''
            ).trim();

    }


    // ==========================================
    // UPDATE ENABLED
    // ==========================================

    if (updates.enabled !== undefined) {

        rule.enabled =
            Boolean(
                updates.enabled
            );

    }


    // ==========================================
    // SAVE
    // ==========================================

    rule.updatedAt =
        Date.now();


    saveZombieGiftRules();


    console.log(
        `Zombie Apocalypse V2: Gift ID ${id} updated.`
    );


    return {
        ...rule,
    };

}

// ==========================================
// DELETE
// ==========================================

export function deleteZombieGiftRule(
    giftId
) {

    const id =
        normalizeGiftId(giftId);


    if (id === null) {
        return false;
    }


    const index =
        zombieGiftRules.findIndex(
            rule =>
                rule.giftId === id
        );


    if (index === -1) {
        return false;
    }


    zombieGiftRules.splice(
        index,
        1
    );

saveZombieGiftRules();

    console.log(
        `Zombie Apocalypse V2: Gift ID ${id} deleted.`
    );


    return true;
}


// ==========================================
// ENABLE / DISABLE
// ==========================================

export function setZombieGiftRuleEnabled(
    giftId,
    enabled
) {

    return updateZombieGiftRule(
        giftId,
        {
            enabled:
                Boolean(enabled),
        }
    );
}


// ==========================================
// CHECK IF GIFT HAS A RULE
// ==========================================

export function hasZombieGiftRule(
    giftId
) {

    return (
        getZombieGiftRule(giftId)
        !== null
    );
}


// ==========================================
// GET ONLY ENABLED RULES
// ==========================================

export function getEnabledZombieGiftRules() {

    return zombieGiftRules
        .filter(
            rule =>
                rule.enabled
        )
        .map(
            rule => ({
                ...rule,
            })
        );
}


// ==========================================
// CLEAR ALL
// ==========================================

export function clearZombieGiftRules() {

    zombieGiftRules = [];

    saveZombieGiftRules();


    console.log(
        'Zombie Apocalypse V2: All gift rules cleared.'
    );
}