//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\Zombie Apocalypse\zombieFollowListener.js
// ==========================================
// ZOMBIE APOCALYPSE V2
// ZOMBIE FOLLOW REWARD LISTENER
// ==========================================
//
// Responsibilities:
// - Listen for TikTok follows
// - Detect new followers
// - Prevent duplicate follow rewards
// - Process Zombie Apocalypse follow rewards
// - Respect Zombie Apocalypse ON / OFF
// - Keep follow rewards independent
//   from the existing gift system
// ==========================================

import { WebcastEvent } from 'tiktok-live-connector';

import {
    tiktok,
} from '../services/tiktok/connection.js';

import {
    getZombieFollowRewards,
} from './zombieFollowManager.js';



import {
    isZombieApocalypseRunning,
} from './zombieApocalypseServer.js';

import {
    processZombieReward,
} from './zombieSpawnProcessor.js';

import {
    registerZombieDeathByName,
} from './zombieSpawnManager.js';

// ==========================================
// STATE
// ==========================================
//
// Stores TikTok users who have already received
// their Zombie Apocalypse follow reward.
//
// Example:
//
// Set {
//     'YzzieBoi',
//     'Player123'
// }
//
// ==========================================

const rewardedFollowers = new Set();


// ==========================================
// CHECK IF FOLLOWER WAS ALREADY REWARDED
// ==========================================

function hasRewardedFollower(username) {

    return rewardedFollowers.has(
        username
    );

}


// ==========================================
// MARK FOLLOWER AS REWARDED
// ==========================================

function markFollowerRewarded(username) {

    rewardedFollowers.add(
        username
    );

}


// ==========================================
// PROCESS FOLLOW REWARDS
// ==========================================

function processFollowRewards(username) {

    // ==========================================
    // ZA ON / OFF
    // ==========================================

    if (!isZombieApocalypseRunning()) {

        console.log(
            `Zombie Apocalypse V2: Follow reward ignored for ${username} because Zombie Apocalypse is OFF.`
        );

        return;

    }


    // ==========================================
    // DUPLICATE FOLLOW PROTECTION
    // ==========================================

    if (
        hasRewardedFollower(username)
    ) {

        console.log(
            `Zombie Apocalypse V2: Follow from ${username} already rewarded.`
        );

        return;

    }


    // ==========================================
    // GET ENABLED REWARDS
    // ==========================================

    const rewards =
        getZombieFollowRewards()
            .filter(
                reward =>
                    reward.enabled
            );


    if (rewards.length === 0) {

        console.log(
            'Zombie Apocalypse V2: No enabled follow rewards configured.'
        );

        return;

    }


    // ==========================================
    // LOG FOLLOW REWARD
    // ==========================================

    console.log('');
    console.log('==============================');
    console.log('ZOMBIE APOCALYPSE V2');
    console.log('FOLLOW REWARD');
    console.log(`User: ${username}`);
    console.log(
        `Rewards: ${rewards.length}`
    );
    console.log('==============================');


    // ==========================================
    // PROCESS EACH REWARD
    // ==========================================

    for (const reward of rewards) {

        console.log(
            `Reward Type: ${reward.rewardType}`
        );

        console.log(
            `Reward: ${reward.rewardName}`
        );

        console.log(
            `Amount: ${reward.amount}`
        );


        // ==========================================
        // PROCESS ACTUAL MINECRAFT REWARD
        // ==========================================

        const result =
            processZombieReward(
                {
                    rewardType:
                        reward.rewardType,

                    rewardName:
                        reward.rewardName,

                    amount:
                        reward.amount,
                },

                username
            );


        // ==========================================
        // CHECK RESULT
        // ==========================================

        if (!result?.success) {

            console.log(
                `Zombie Apocalypse V2: Follow reward failed for ${username}.`
            );

            console.log(
                `Reason: ${result?.reason || 'unknown'}`
            );

            continue;

        }


        console.log(
            `Zombie Apocalypse V2: Follow reward processed successfully for ${username}.`
        );

    }


    // ==========================================
    // MARK FOLLOWER AS REWARDED
    // ==========================================

    markFollowerRewarded(
        username
    );

}

// ==========================================
// TIKTOK FOLLOW LISTENER
// ==========================================

export function setupZombieFollowListener() {

    console.log(
        'Zombie Apocalypse V2: Follow listener starting...'
    );


    // ==========================================
    // LISTEN FOR TIKTOK FOLLOWS
    // ==========================================

    tiktok.on(
        WebcastEvent.FOLLOW,
        data => {

            // ==========================================
            // GET USERNAME
            // ==========================================

            const username =
                data.user?.uniqueId ||
                data.user?.displayId ||
                'Unknown';


            // ==========================================
            // LOG FOLLOW
            // ==========================================

            console.log('');
            console.log('==============================');
            console.log('ZOMBIE APOCALYPSE V2');
            console.log('TIKTOK FOLLOW DETECTED');
            console.log(`User: ${username}`);
            console.log('==============================');


            // ==========================================
            // PROCESS FOLLOW REWARDS
            // ==========================================

            processFollowRewards(
                username
            );

        }
    );


    // ==========================================
    // LISTENER READY
    // ==========================================

    console.log(
        'Zombie Apocalypse V2: Follow listener ready.'
    );

}