//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\Zombie Apocalypse\zombieFollowManager.js
// ==========================================
// ZOMBIE APOCALYPSE V2
// ZOMBIE FOLLOW REWARD MANAGER
// ==========================================
//
// Responsibilities:
// - Store Zombie Apocalypse follow rewards
// - Create follow reward rules
// - Read follow reward rules
// - Update follow reward rules
// - Delete follow reward rules
// - Enable / disable follow rewards
// - Keep follow rewards independent
//   from the existing gift system
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

const FOLLOW_REWARDS_FILE =
    path.join(
        __dirname,
        'zombieFollowRewards.json'
    );


// ==========================================
// STATE
// ==========================================

let zombieFollowRewards = [];


// ==========================================
// ID COUNTER
// ==========================================

let nextZombieFollowRewardId = 1;


// ==========================================
// LOAD FOLLOW REWARDS
// ==========================================

function loadZombieFollowRewards() {

    try {

        if (!fs.existsSync(FOLLOW_REWARDS_FILE)) {

            zombieFollowRewards = [];

            return;

        }

        const fileData =
            fs.readFileSync(
                FOLLOW_REWARDS_FILE,
                'utf8'
            );

        const parsed =
            JSON.parse(fileData);

        if (!Array.isArray(parsed)) {

            zombieFollowRewards = [];

            return;

        }

        zombieFollowRewards = parsed;

        nextZombieFollowRewardId =
            zombieFollowRewards.reduce(
                (max, reward) =>
                    Math.max(
                        max,
                        Number(reward.id) || 0
                    ),
                0
            ) + 1;

        console.log(
            `Zombie Apocalypse V2: Loaded ${zombieFollowRewards.length} follow reward(s).`
        );

    } catch (error) {

        console.error(
            'Zombie Apocalypse V2: Failed to load follow rewards:',
            error
        );

        zombieFollowRewards = [];

    }

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadZombieFollowRewards();


// ==========================================
// SAVE FOLLOW REWARDS
// ==========================================

function saveZombieFollowRewards() {

    try {

        fs.writeFileSync(
            FOLLOW_REWARDS_FILE,
            JSON.stringify(
                zombieFollowRewards,
                null,
                4
            ),
            'utf8'
        );

        console.log(
            'Zombie Apocalypse V2: Follow rewards saved.'
        );

        return true;

    } catch (error) {

        console.error(
            'Zombie Apocalypse V2: Failed to save follow rewards:',
            error
        );

        return false;

    }

}


// ==========================================
// VALIDATE REWARD
// ==========================================

function validateZombieFollowReward(data = {}) {
    const rewardType =
        data.rewardType === 'item'
            ? 'item'
            : 'mob';


    const rewardName =
        String(data.rewardName || '').trim();


    if (!rewardName) {

        throw new Error(
            'Reward name is required.'
        );

    }


    const amount =
        Math.max(
            1,
            Number(data.amount) || 1
        );


    return {

        rewardType,

        rewardName,

        amount,

    };
}

// ==========================================
// GET ALL
// ==========================================

export function getZombieFollowRewards() {

    return zombieFollowRewards.map(
        reward => ({
            ...reward,
        })
    );

}

// ==========================================
// GET ONE
// ==========================================

export function getZombieFollowReward(id) {

    const rewardId =
        Number(id);


    return (
        zombieFollowRewards.find(
            reward =>
                reward.id === rewardId
        ) || null
    );

}

// ==========================================
// CREATE
// ==========================================

export function createZombieFollowReward(
    data = {}
) {

    const reward =
        validateZombieFollowReward(data);


    const saved = {

        id:
            nextZombieFollowRewardId++,

        ...reward,

        enabled:
            true,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),

    };


    zombieFollowRewards.push(saved);
    saveZombieFollowRewards();

    saveZombieFollowRewards();

    console.log(
        'Zombie Follow Reward created:',
        saved
    );


    return {
        ...saved,
    };

}

// ==========================================
// UPDATE
// ==========================================

export function updateZombieFollowReward(
    id,
    data = {}
) {

    const rewardId =
        Number(id);


    const index =
        zombieFollowRewards.findIndex(
            reward =>
                reward.id === rewardId
        );


    if (index === -1) {

        return null;

    }


    const current =
        zombieFollowRewards[index];


    const updatedData =
        validateZombieFollowReward({

            rewardType:
                data.rewardType ??
                current.rewardType,

            rewardName:
                data.rewardName ??
                current.rewardName,

            amount:
                data.amount ??
                current.amount,

        });


    const updated = {

        ...current,

        ...updatedData,

        updatedAt:
            new Date().toISOString(),

    };


    zombieFollowRewards[index] =
        updated;

        saveZombieFollowRewards();


    console.log(
        'Zombie Follow Reward updated:',
        updated
    );


    return {
        ...updated,
    };

}

// ==========================================
// DELETE
// ==========================================

export function deleteZombieFollowReward(id) {

    const rewardId =
        Number(id);


    const index =
        zombieFollowRewards.findIndex(
            reward =>
                reward.id === rewardId
        );


    if (index === -1) {

        return false;

    }


    const removed =
        zombieFollowRewards.splice(
            index,
            1
        )[0];

        saveZombieFollowRewards();


    console.log(
        'Zombie Follow Reward deleted:',
        removed
    );


    return true;

}

// ==========================================
// ENABLE / DISABLE
// ==========================================

export function setZombieFollowRewardEnabled(
    id,
    enabled
) {

    const reward =
        getZombieFollowReward(id);


    if (!reward) {

        return null;

    }


    reward.enabled =
        Boolean(enabled);


    reward.updatedAt =
        new Date().toISOString();

        saveZombieFollowRewards();


    return {
        ...reward,
    };

}

// ==========================================
// CLEAR ALL
// ==========================================

export function clearZombieFollowRewards() {

    zombieFollowRewards = [];

    saveZombieFollowRewards();

}