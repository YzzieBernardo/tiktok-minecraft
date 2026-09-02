//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\Zombie Apocalypse\zombieLikeManager.js
// ==========================================
// ZOMBIE APOCALYPSE V2
// ZOMBIE LIKE REWARD MANAGER
// ==========================================
//
// Responsibilities:
// - Store Zombie Apocalypse like rewards
// - Create like reward rules
// - Read like reward rules
// - Update like reward rules
// - Delete like reward rules
// - Keep like rewards independent
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

const LIKE_REWARDS_FILE =
    path.join(
        __dirname,
        'zombieLikeRewards.json'
    );


// ==========================================
// STATE
// ==========================================

let zombieLikeRewards = [];

// ==========================================
// LOAD LIKE REWARDS
// ==========================================

function loadZombieLikeRewards() {

    try {

        if (!fs.existsSync(LIKE_REWARDS_FILE)) {

            zombieLikeRewards = [];

            return;

        }


        const fileData =
            fs.readFileSync(
                LIKE_REWARDS_FILE,
                'utf8'
            );


        const parsed =
            JSON.parse(fileData);


        if (!Array.isArray(parsed)) {

            zombieLikeRewards = [];

            return;

        }


        zombieLikeRewards =
            parsed;


        console.log(
            `Zombie Apocalypse V2: Loaded ${zombieLikeRewards.length} like reward(s).`
        );


    } catch (error) {

        console.error(
            'Zombie Apocalypse V2: Failed to load like rewards:',
            error
        );


        zombieLikeRewards = [];

    }

}

// ==========================================
// SAVE LIKE REWARDS
// ==========================================

function saveZombieLikeRewards() {

    try {

        fs.writeFileSync(
            LIKE_REWARDS_FILE,
            JSON.stringify(
                zombieLikeRewards,
                null,
                4
            ),
            'utf8'
        );


        console.log(
            'Zombie Apocalypse V2: Like rewards saved.'
        );


        return true;


    } catch (error) {

        console.error(
            'Zombie Apocalypse V2: Failed to save like rewards:',
            error
        );


        return false;

    }

}

// ==========================================
// INITIAL LOAD
// ==========================================

loadZombieLikeRewards();

// ==========================================
// ID COUNTER
// ==========================================

let nextZombieLikeRewardId = 1;


// ==========================================
// VALIDATE REWARD
// ==========================================

function validateZombieLikeReward(data = {}) {

    const likesRequired =
        Number(data.likesRequired);

    if (
        !Number.isInteger(likesRequired) ||
        likesRequired <= 0
    ) {

        throw new Error(
            'Likes required must be a positive whole number.'
        );

    }


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

        likesRequired,

        rewardType,

        rewardName,

        amount,

    };

}


// ==========================================
// GET ALL
// ==========================================

export function getZombieLikeRewards() {

    return zombieLikeRewards.map(
        reward => ({
            ...reward,
        })
    );

}


// ==========================================
// GET ONE
// ==========================================

export function getZombieLikeReward(id) {

    const rewardId =
        Number(id);

    return (
        zombieLikeRewards.find(
            reward =>
                reward.id === rewardId
        ) || null
    );

}


// ==========================================
// CREATE
// ==========================================

export function createZombieLikeReward(data = {}) {

    const reward =
        validateZombieLikeReward(data);


    const saved = {

        id:
            nextZombieLikeRewardId++,

        ...reward,

        enabled: true,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),

    };


    zombieLikeRewards.push(saved);

    saveZombieLikeRewards();


    console.log(
        'Zombie Like Reward created:',
        saved
    );


    return {
        ...saved,
    };

}


// ==========================================
// UPDATE
// ==========================================

export function updateZombieLikeReward(
    id,
    data = {}
) {

    const rewardId =
        Number(id);


    const index =
        zombieLikeRewards.findIndex(
            reward =>
                reward.id === rewardId
        );


    if (index === -1) {

        return null;

    }


    const current =
        zombieLikeRewards[index];


    const updatedData =
        validateZombieLikeReward({

            likesRequired:
                data.likesRequired ??
                current.likesRequired,

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


    zombieLikeRewards[index] =
        updated;

        saveZombieLikeRewards();


    console.log(
        'Zombie Like Reward updated:',
        updated
    );


    return {
        ...updated,
    };

}


// ==========================================
// DELETE
// ==========================================

export function deleteZombieLikeReward(id) {

    const rewardId =
        Number(id);


    const index =
        zombieLikeRewards.findIndex(
            reward =>
                reward.id === rewardId
        );


    if (index === -1) {

        return false;

    }


    const removed =
        zombieLikeRewards.splice(
            index,
            1
        )[0];

        saveZombieLikeRewards();


    console.log(
        'Zombie Like Reward deleted:',
        removed
    );


    return true;

}


// ==========================================
// ENABLE / DISABLE
// ==========================================

export function setZombieLikeRewardEnabled(
    id,
    enabled
) {

    const reward =
        getZombieLikeReward(id);


    if (!reward) {

        return null;

    }


    reward.enabled =
        Boolean(enabled);


    reward.updatedAt =
        new Date().toISOString();


    return {
        ...reward,
    };

}


// ==========================================
// CLEAR ALL
// ==========================================

export function clearZombieLikeRewards() {

    zombieLikeRewards = [];

    saveZombieLikeRewards();

}