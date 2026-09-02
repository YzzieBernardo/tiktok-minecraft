// ==========================================
// ZOMBIE APOCALYPSE V2
// ZOMBIE LIKE REWARD LISTENER
// ==========================================
//
// Responsibilities:
// - Listen for TikTok likes
// - Track TikTok cumulative like total
// - Detect multi-like bursts correctly
// - Process Zombie Apocalypse like milestones
// - Send like events to dashboard
// - Respect Zombie Apocalypse ON / OFF
//
// IMPORTANT:
// - Uses TikTok cumulative total
// - Does NOT use likeCount
// - Does NOT use repeatCount
// - Does NOT assume 1 like per event
// ==========================================

import { WebcastEvent } from 'tiktok-live-connector';

import {
    tiktok,
} from '../services/tiktok/connection.js';

import {
    botState,
    broadcastToDashboard,
} from '../services/core/server.js';

import {
    isZombieApocalypseRunning,
} from './zombieApocalypseServer.js';

import {
    getZombieLikeRewards,
} from './zombieLikeManager.js';

import {
    processZombieReward,
} from './zombieSpawnProcessor.js';


// ==========================================
// STATE
// ==========================================
//
// Total likes counted by Zombie Apocalypse
// during the current bot session.
//
// ==========================================

let totalZombieLikes = 0;


// ==========================================
// TIKTOK CUMULATIVE TOTAL
// ==========================================
//
// Example:
//
// Previous = 2350
// Current  = 2365
//
// New Likes = 15
//
// ==========================================

let lastKnownTotalLikes = null;


// ==========================================
// LIKE REWARD STATE
// ==========================================
//
// Stores reward IDs that have already
// been triggered.
//
// ==========================================

const triggeredLikeRewards =
    new Set();


// ==========================================
// RESET TRACKER
// ==========================================
//
// This can be used later when starting
// a completely new TikTok session.
//
// ==========================================

export function resetZombieLikeTracker() {

    totalZombieLikes = 0;

    lastKnownTotalLikes = null;

    triggeredLikeRewards.clear();

}


// ==========================================
// PROCESS LIKE REWARDS
// ==========================================

function processLikeRewards(
    username = 'Unknown'
) {

    const rewards =
        getZombieLikeRewards();


    // ==========================================
    // NO REWARDS
    // ==========================================

    if (
        !rewards ||
        rewards.length === 0
    ) {

        console.log(
            'Zombie Apocalypse V2: No like rewards configured.'
        );

        return;

    }


    // ==========================================
    // ENABLED REWARDS
    // ==========================================

    const enabledRewards =
        rewards
            .filter(
                reward =>
                    reward &&
                    reward.enabled !== false
            )
            .sort(
                (a, b) =>
                    Number(
                        a.likesRequired
                    ) -
                    Number(
                        b.likesRequired
                    )
            );


    // ==========================================
    // CHECK MILESTONES
    // ==========================================

    for (
        const reward
        of enabledRewards
    ) {

        const rewardId =
            Number(
                reward.id
            );


        const milestone =
            Number(
                reward.likesRequired
            );


        // ==========================================
        // INVALID MILESTONE
        // ==========================================

        if (
            !Number.isInteger(
                milestone
            ) ||
            milestone <= 0
        ) {

            continue;

        }


        // ==========================================
        // ALREADY TRIGGERED
        // ==========================================

        if (
            triggeredLikeRewards.has(
                rewardId
            )
        ) {

            continue;

        }


        // ==========================================
        // MILESTONE NOT REACHED
        // ==========================================

        if (
            totalZombieLikes <
            milestone
        ) {

            continue;

        }


        // ==========================================
        // MILESTONE REACHED
        // ==========================================

        console.log('');

        console.log(
            '=============================='
        );

        console.log(
            'ZOMBIE APOCALYPSE V2'
        );

        console.log(
            'LIKE MILESTONE REACHED'
        );

        console.log(
            `User: ${username}`
        );

        console.log(
            `Session Likes: ${totalZombieLikes}`
        );

        console.log(
            `Required Likes: ${milestone}`
        );

        console.log(
            `Reward ID: ${rewardId}`
        );

        console.log(
            `Reward Type: ${reward.rewardType}`
        );

        console.log(
            `Reward: ${reward.rewardName}`
        );

        console.log(
            `Amount: ${reward.amount}`
        );

        console.log(
            '=============================='
        );


        // ==========================================
        // MARK TRIGGERED
        // ==========================================

        triggeredLikeRewards.add(
            rewardId
        );


        // ==========================================
        // PROCESS REWARD
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
        // RESULT
        // ==========================================

        if (
            result?.success
        ) {

            console.log(
                `Zombie Apocalypse V2: Like reward ${rewardId} processed successfully.`
            );

        } else {

            console.log(
                `Zombie Apocalypse V2: Like reward ${rewardId} failed.`
            );

        }

    }

}


// ==========================================
// SETUP LIKE LISTENER
// ==========================================

export function setupZombieLikeListener() {

    console.log(
        'Zombie Apocalypse V2: Like listener starting...'
    );


    // ==========================================
    // TIKTOK LIKE EVENT
    // ==========================================

    tiktok.on(
        WebcastEvent.LIKE,
        data => {

            // ==========================================
            // ZOMBIE APOCALYPSE CHECK
            // ==========================================
            //
            // If OFF:
            //
            // - Do not log
            // - Do not count
            // - Do not update tracker
            // - Do not send dashboard event
            //
            // ==========================================

            if (
                !isZombieApocalypseRunning()
            ) {

                return;

            }


            // ==========================================
            // USER
            // ==========================================

            const username =
                data.user?.uniqueId ||
                data.user?.displayId ||
                'Unknown';


            // ==========================================
            // TIKTOK CUMULATIVE TOTAL
            // ==========================================
            //
            // THIS is the important value.
            //
            // Do NOT use:
            //
            // data.likeCount
            // data.repeatCount
            // data.count
            //
            // for the actual accounting.
            //
            // ==========================================

            const currentTotalLikes =
                Number(
                    data.total || 0
                );


            // ==========================================
            // INVALID TOTAL
            // ==========================================

            if (
                !Number.isFinite(
                    currentTotalLikes
                ) ||
                currentTotalLikes < 0
            ) {

                console.log(
                    'Zombie Apocalypse V2: Invalid TikTok like total.'
                );

                return;

            }


            // ==========================================
            // FIRST EVENT
            // ==========================================
            //
            // Establish baseline.
            //
            // Existing likes are NOT counted.
            //
            // ==========================================

            if (
                lastKnownTotalLikes === null
            ) {

                lastKnownTotalLikes =
                    currentTotalLikes;


                console.log('');

                console.log(
                    '=============================='
                );

                console.log(
                    'ZOMBIE APOCALYPSE V2'
                );

                console.log(
                    'TIKTOK LIKE TRACKER STARTED'
                );

                console.log(
                    `User: ${username}`
                );

                console.log(
                    `TikTok Total: ${currentTotalLikes}`
                );

                console.log(
                    'Existing likes not counted.'
                );

                console.log(
                    '=============================='
                );


                return;

            }


            // ==========================================
            // CALCULATE NEW LIKES
            // ==========================================
            //
            // Example:
            //
            // Previous = 2350
            // Current  = 2365
            //
            // New = 15
            //
            // ==========================================

            const newLikes =
                currentTotalLikes -
                lastKnownTotalLikes;


            // ==========================================
            // SAVE NEW TIKTOK TOTAL
            // ==========================================

            const previousTotal =
                lastKnownTotalLikes;


            lastKnownTotalLikes =
                currentTotalLikes;


            // ==========================================
            // IGNORE OLD / DUPLICATE
            // ==========================================

            if (
                newLikes <= 0
            ) {

                console.log('');

                console.log(
                    '=============================='
                );

                console.log(
                    'ZOMBIE APOCALYPSE V2'
                );

                console.log(
                    'LIKE EVENT IGNORED'
                );

                console.log(
                    `User: ${username}`
                );

                console.log(
                    `Previous Total: ${previousTotal}`
                );

                console.log(
                    `Current Total: ${currentTotalLikes}`
                );

                console.log(
                    'Reason: No new cumulative likes.'
                );

                console.log(
                    '=============================='
                );


                return;

            }


            // ==========================================
            // ADD NEW LIKES
            // ==========================================

            totalZombieLikes +=
                newLikes;


            // ==========================================
            // MAIN LIKE LOG
            // ==========================================

            console.log('');

            console.log(
                '=============================='
            );

            console.log(
                'ZOMBIE APOCALYPSE V2'
            );

            console.log(
                'TIKTOK LIKE DETECTED'
            );

            console.log(
                `User: ${username}`
            );

            console.log(
                `Likes Received: ${newLikes}`
            );

            console.log(
                `Previous Total: ${previousTotal}`
            );

            console.log(
                `Current Total: ${currentTotalLikes}`
            );

            console.log(
                'System: ZOMBIE APOCALYPSE'
            );

            console.log(
                '=============================='
            );


            // ==========================================
            // DASHBOARD STATS
            // ==========================================

            botState.stats.totalLikes =
                totalZombieLikes;


            broadcastToDashboard({

                type:
                    'stats_update',

                stats:
                    botState.stats

            });


            // ==========================================
            // DASHBOARD LIKE EVENT
            // ==========================================
            //
            // count = NEW cumulative difference.
            //
            // Therefore:
            //
            // 15 likes -> count 15
            // 13 likes -> count 13
            // 7 likes  -> count 7
            //
            // ==========================================

            broadcastToDashboard({

                type:
                    'like',

                user:
                    username,

                count:
                    newLikes,

                total:
                    totalZombieLikes

            });


            // ==========================================
            // LIKE TRACKING
            // ==========================================

            console.log('');

            console.log(
                '=============================='
            );

            console.log(
                'ZOMBIE LIKE TRACKING'
            );

            console.log(
                `New Likes: ${newLikes}`
            );

            console.log(
                `Session Likes: ${totalZombieLikes}`
            );

            console.log(
                '=============================='
            );


            // ==========================================
            // PROCESS MILESTONES
            // ==========================================

            processLikeRewards(
                username
            );

        }
    );


    // ==========================================
    // LISTENER READY
    // ==========================================

    console.log(
        'Zombie Apocalypse V2: Like listener ready.'
    );

}