// ==========================================
// ZOMBIE APOCALYPSE V2
// ZOMBIE SOCIAL LISTENER
// ==========================================
//
// Responsibilities:
// - Handle TikTok Likes for Zombie Apocalypse
// - Handle TikTok Follows for Zombie Apocalypse
// - Read Like reward configuration
// - Read Follow reward configuration
// - Process dynamic Like milestones
// - Process Follow rewards
// - Send rewards to Zombie Reward Processor
//
// IMPORTANT:
// - Does NOT modify Mob Battle
// - Does NOT use spawnMobForTeam()
// - Does NOT use Mob Battle Like/Follow rewards
// - Does NOT use canMobBattleReceiveEvents()
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
    getZombieFollowRewards,
} from './zombieFollowManager.js';

import {
    processZombieReward,
} from './zombieSpawnProcessor.js';


// ==========================================
// LIKE STATE
// ==========================================

// Total likes counted during the
// current Zombie Apocalypse session.
let totalZombieLikes = 0;


// ==========================================
// TIKTOK CUMULATIVE LIKE TRACKER
// ==========================================
//
// TikTok total is cumulative.
//
// Example:
//
// Previous Total = 2350
// Current Total  = 2365
//
// New Likes = 15
//
// This is the value used for
// Zombie Apocalypse like accounting.
//
// ==========================================

let lastKnownTotalLikes = null;


// ==========================================
// FOLLOW STATE
// ==========================================

const processedZombieFollowers =
    new Set();


// ==========================================
// LIKE REWARD STATE
// ==========================================
//
// Stores Like Reward IDs that have
// already been triggered.
//
// ==========================================

const triggeredLikeRewards =
    new Set();


// ==========================================
// FORMAT REWARD NAME
// ==========================================

function formatRewardName(
    rewardName = ''
) {

    const name =
        String(
            rewardName || ''
        ).trim();


    if (!name) {

        return 'Unknown';

    }


    const shortName =
        name.includes(':')
            ? name.split(':').pop()
            : name;


    return shortName
        .replace(
            /_/g,
            ' '
        )
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

}


// ==========================================
// GET NEXT LIKE REWARD
// ==========================================

function getNextZombieLikeReward() {

    const rewards =
        getZombieLikeRewards();


    const enabledRewards =
        rewards
            .filter(
                reward =>
                    reward &&
                    reward.enabled !== false
            )
            .filter(
                reward =>
                    Number.isInteger(
                        Number(
                            reward.likesRequired
                        )
                    )
            )
            .filter(
                reward =>
                    Number(
                        reward.likesRequired
                    ) > 0
            )
            .filter(
                reward =>
                    !triggeredLikeRewards.has(
                        Number(
                            reward.id
                        )
                    )
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


    return (
        enabledRewards[0] ||
        null
    );

}


// ==========================================
// PROCESS LIKE REWARDS
// ==========================================

function processZombieLikeRewards(
    username = 'Unknown'
) {

    const rewards =
        getZombieLikeRewards();


    if (
        !rewards.length
    ) {

        console.log(
            'Zombie Apocalypse: No Like Rewards configured.'
        );

        return 0;

    }


    let processed = 0;


    // ==========================================
    // SORT REWARDS
    // ==========================================

    const sortedRewards =
        [...rewards]
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
    // CHECK ALL MILESTONES
    // ==========================================

    for (
        const reward
        of sortedRewards
    ) {

        const rewardId =
            Number(
                reward.id
            );


        const likesRequired =
            Number(
                reward.likesRequired
            );


        // ==========================================
        // INVALID REWARD
        // ==========================================

        if (
            !Number.isInteger(
                likesRequired
            ) ||
            likesRequired <= 0
        ) {

            console.log(
                `Zombie Apocalypse: Invalid Like Reward milestone for reward ${rewardId}.`
            );

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
        // MILESTONE NOT YET REACHED
        // ==========================================

        if (
            totalZombieLikes <
            likesRequired
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
            `Required Likes: ${likesRequired}`
        );

        console.log(
            `Reward ID: ${rewardId}`
        );

        console.log(
            `Reward Type: ${reward.rewardType}`
        );

        console.log(
            `Reward: ${formatRewardName(
                reward.rewardName
            )}`
        );

        console.log(
            `Amount: ${reward.amount}`
        );

        console.log(
            '=============================='
        );


        // ==========================================
        // MARK AS TRIGGERED
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

            processed++;


            console.log(
                `Zombie Apocalypse: Like Reward ${rewardId} processed successfully.`
            );

        } else {

            console.log(
                `Zombie Apocalypse: Like Reward ${rewardId} failed.`
            );

        }

    }


    return processed;

}


// ==========================================
// SETUP ZOMBIE SOCIAL LISTENER
// ==========================================

export function setupZombieSocialListener() {

    console.log(
        '>>> ZOMBIE APOCALYPSE SOCIAL LISTENER SETUP <<<'
    );


    // ==========================================
    // TIKTOK LIKES
    // ==========================================

    tiktok.on(
        WebcastEvent.LIKE,
        data => {

            // ==========================================
            // ZOMBIE APOCALYPSE ON / OFF
            // ==========================================
            //
            // If Zombie Apocalypse is OFF,
            // this listener does absolutely nothing.
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

            const currentTotalLikes =
                Number(
                    data.total || 0
                );


            // ==========================================
            // EVENT COUNT
            // ==========================================
            //
            // This is only for logging.
            //
            // DO NOT use this for session
            // like accounting.
            //
            // The real calculation is:
            //
            // currentTotal - previousTotal
            //
            // ==========================================

            const eventLikes =
                Number(
                    data.count || 0
                );


            // ==========================================
            // RAW EVENT LOG
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
                `Likes this event: ${eventLikes}`
            );

            console.log(
                `TikTok total likes: ${currentTotalLikes}`
            );

            console.log(
                `Bot previous total: ${lastKnownTotalLikes}`
            );

            console.log(
                'System: ZOMBIE APOCALYPSE'
            );

            console.log(
                '=============================='
            );


            // ==========================================
            // FIRST EVENT
            // ==========================================
            //
            // Establish baseline only.
            //
            // Existing TikTok likes are not counted.
            //
            // ==========================================

            if (
                lastKnownTotalLikes === null
            ) {

                lastKnownTotalLikes =
                    currentTotalLikes;


                console.log(
                    `Zombie Apocalypse V2: Like tracker started at ${currentTotalLikes} likes.`
                );


                return;

            }


            // ==========================================
            // CALCULATE NEW LIKES
            // ==========================================
            //
            // THIS IS THE IMPORTANT PART.
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
            // UPDATE PREVIOUS TOTAL
            // ==========================================

            lastKnownTotalLikes =
                currentTotalLikes;


            // ==========================================
            // IGNORE INVALID / OLD EVENTS
            // ==========================================

            if (
                newLikes <= 0
            ) {

                console.log(
                    'Zombie Apocalypse V2: No new likes.'
                );

                return;

            }


            // ==========================================
            // ADD SESSION LIKES
            // ==========================================

            totalZombieLikes +=
                newLikes;


            // ==========================================
            // UPDATE DASHBOARD STATS
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
            // SEND LIKE EVENT TO DASHBOARD
            // ==========================================
            //
            // count = newLikes
            //
            // Therefore:
            //
            // x15 -> count 15
            // x13 -> count 13
            // x7  -> count 7
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
            // GET NEXT REWARD
            // ==========================================

            const nextReward =
                getNextZombieLikeReward();


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


            if (
                nextReward
            ) {

                console.log(
                    `Next reward: ${nextReward.likesRequired} likes`
                );

            } else {

                console.log(
                    'Next reward: None'
                );

            }


            console.log(
                '=============================='
            );


            // ==========================================
            // PROCESS JSON REWARDS
            // ==========================================

            processZombieLikeRewards(
                username
            );

        }
    );


    // ==========================================
    // TIKTOK FOLLOWS
    // ==========================================

    tiktok.on(
        WebcastEvent.FOLLOW,
        data => {

            // ==========================================
            // ZOMBIE APOCALYPSE ON / OFF
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
            // FOLLOW LOG
            // ==========================================

            console.log('');

            console.log(
                '=============================='
            );

            console.log(
                'ZOMBIE APOCALYPSE V2'
            );

            console.log(
                'TIKTOK FOLLOW DETECTED'
            );

            console.log(
                `User: ${username}`
            );

            console.log(
                'System: ZOMBIE APOCALYPSE'
            );

            console.log(
                '=============================='
            );


            // ==========================================
            // DUPLICATE FOLLOW
            // ==========================================

            if (
                processedZombieFollowers.has(
                    username
                )
            ) {

                console.log(
                    `Zombie Apocalypse: Follow ignored. ${username} already received a reward.`
                );

                return;

            }


            // ==========================================
            // GET FOLLOW REWARDS
            // ==========================================

            const rewards =
                getZombieFollowRewards();


            const enabledRewards =
                rewards.filter(
                    reward =>
                        reward &&
                        reward.enabled !== false
                );


            // ==========================================
            // NO REWARDS
            // ==========================================

            if (
                enabledRewards.length === 0
            ) {

                console.log(
                    'Zombie Apocalypse: No enabled Follow Rewards configured.'
                );

                return;

            }


            // ==========================================
            // MARK FOLLOWER
            // ==========================================

            processedZombieFollowers.add(
                username
            );


            // ==========================================
            // DASHBOARD FOLLOW STATS
            // ==========================================

            botState.stats.totalFollows++;


            broadcastToDashboard({

                type:
                    'stats_update',

                stats:
                    botState.stats

            });


            // ==========================================
            // DASHBOARD FOLLOW EVENT
            // ==========================================

            broadcastToDashboard({

                type:
                    'follow',

                user:
                    username

            });


            // ==========================================
            // PROCESS ALL FOLLOW REWARDS
            // ==========================================

            for (
                const reward
                of enabledRewards
            ) {

                console.log('');

                console.log(
                    '=============================='
                );

                console.log(
                    'ZOMBIE FOLLOW REWARD'
                );

                console.log(
                    `User: ${username}`
                );

                console.log(
                    `Reward ID: ${reward.id}`
                );

                console.log(
                    `Reward Type: ${reward.rewardType}`
                );

                console.log(
                    `Reward: ${formatRewardName(
                        reward.rewardName
                    )}`
                );

                console.log(
                    `Amount: ${reward.amount}`
                );

                console.log(
                    '=============================='
                );


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


                if (
                    result?.success
                ) {

                    console.log(
                        `Zombie Apocalypse: Follow Reward ${reward.id} processed successfully.`
                    );

                } else {

                    console.log(
                        `Zombie Apocalypse: Follow Reward ${reward.id} failed.`
                    );

                }

            }

        }
    );

}