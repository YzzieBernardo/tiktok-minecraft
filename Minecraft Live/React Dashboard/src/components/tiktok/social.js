import { WebcastEvent } from 'tiktok-live-connector';

import { tiktok } from '../../services/tiktok/connection.js';

import {
    botState,
    broadcastToDashboard
} from '../../services/core/server.js';

import {
    canMobBattleReceiveEvents
} from '../../services/core/mobBattleServer.js';

import {
    spawnMobForTeam
} from '../../data/teams/teams.js';


// ==========================================
// SOCIAL SYSTEM
// ==========================================
//
// MOB BATTLE SOCIAL LISTENER
//
// Zombie Apocalypse has its own listener:
// src/Zombie Apocalypse/zombieSocial.js
//
// ROUTING:
//
// Mob Battle ON
//     -> this file processes LIKE/FOLLOW
//
// Mob Battle OFF
//     -> this file ignores the event
//     -> Zombie Apocalypse may process it
//
// ==========================================


// ==========================================
// LIKE SETTINGS
// ==========================================

const LIKES_PER_REWARD = 100;

const LIKE_ZOMBIES = 3;
const LIKE_SKELETONS = 3;
const LIKE_CREEPERS = 3;
const LIKE_ENDERMEN = 3;


// ==========================================
// FOLLOW SETTINGS
// ==========================================

const FOLLOW_ZOMBIES = 10;
const FOLLOW_SKELETONS = 10;
const FOLLOW_CREEPERS = 10;
const FOLLOW_ENDERMEN = 10;


// ==========================================
// SPAWN MOBS
// ==========================================

function spawnMobs(
    team,
    mobCounts,
    donorName = 'Unknown'
) {

    for (
        const [mobType, amount]
        of Object.entries(mobCounts)
    ) {

        for (
            let count = 0;
            count < amount;
            count++
        ) {

            spawnMobForTeam(
                mobType,
                team,
                donorName
            );

        }

    }

}


// ==========================================
// LIKE STATE
// ==========================================

// Likes counted during this bot session.
let totalLikes = 0;


// TikTok's previous cumulative like total.
//
// Example:
//
// Previous = 1958
// Current  = 1965
// New      = 7
//
let lastKnownTotalLikes = null;


// Number of 100-like rewards already given.
let likeRewardsGiven = 0;


// ==========================================
// FOLLOW STATE
// ==========================================

const processedFollowers =
    new Set();


// ==========================================
// SPAWN LIKE REWARD
// TEAM A / RED
// ==========================================

function spawnLikeReward(
    username = 'Unknown'
) {

    console.log('');
    console.log('==============================');
    console.log('RED TEAM - LIKE REWARD');
    console.log(`User: ${username}`);
    console.log('Reward: 100 LIKES');
    console.log('Team: A / RED');
    console.log('Zombie: 3');
    console.log('Skeleton: 3');
    console.log('Creeper: 3');
    console.log('Enderman: 3');
    console.log('==============================');


    spawnMobs(
        'A',
        {
            zombie:
                LIKE_ZOMBIES,

            skeleton:
                LIKE_SKELETONS,

            creeper:
                LIKE_CREEPERS,

            enderman:
                LIKE_ENDERMEN,
        },
        username
    );

}


// ==========================================
// SPAWN FOLLOW REWARD
// TEAM B / BLUE
// ==========================================

function spawnFollowReward(
    username = 'Unknown'
) {

    console.log('');
    console.log('==============================');
    console.log('BLUE TEAM - FOLLOW REWARD');
    console.log(`User: ${username}`);
    console.log('Reward: NEW FOLLOWER');
    console.log('Team: B / BLUE');
    console.log('Zombie: 10');
    console.log('Skeleton: 10');
    console.log('Creeper: 10');
    console.log('Enderman: 10');
    console.log('==============================');


    spawnMobs(
        'B',
        {
            zombie:
                FOLLOW_ZOMBIES,

            skeleton:
                FOLLOW_SKELETONS,

            creeper:
                FOLLOW_CREEPERS,

            enderman:
                FOLLOW_ENDERMEN,
        },
        username
    );

}


// ==========================================
// SETUP SOCIAL LISTENERS
// ==========================================

export function setupSocialListener() {

    console.log(
        '>>> MOB BATTLE SOCIAL LISTENER SETUP <<<'
    );


    // ==========================================
    // TIKTOK LIKES
    // ==========================================

    tiktok.on(
        WebcastEvent.LIKE,
        data => {

            // ==========================================
            // MOB BATTLE CHECK
            // ==========================================

            if (
                !canMobBattleReceiveEvents()
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
            // TIKTOK TOTAL
            // ==========================================

            const currentTotalLikes =
                Number(
                    data.total || 0
                );


            // ==========================================
            // EVENT LIKE COUNT
            // ==========================================
            //
            // This preserves TikTok burst likes.
            //
            // Example:
            //
            // x7 likes
            // data.count = 7
            //
            // We display this in the log.
            // ==========================================

            const eventLikes =
                Number(
                    data.count || 0
                );


            // ==========================================
            // LOG RAW TIKTOK EVENT
            // ==========================================

            console.log('');
            console.log('==============================');
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
                'Red Team: LIKE'
            );
            console.log(
                '=============================='
            );


            // ==========================================
            // FIRST LIKE EVENT
            // ==========================================
            //
            // Do NOT count the existing TikTok total.
            //
            // Example:
            //
            // Bot starts at 1958
            //
            // First event:
            // TikTok total = 1965
            //
            // We establish the baseline.
            // ==========================================

            if (
                lastKnownTotalLikes === null
            ) {

                lastKnownTotalLikes =
                    currentTotalLikes;


                console.log(
                    `Starting like tracker at ${currentTotalLikes} likes.`
                );


                return;

            }


            // ==========================================
            // CALCULATE NEW LIKES
            // ==========================================
            //
            // Example:
            //
            // Current total  = 1965
            // Previous total = 1958
            //
            // New likes = 7
            // ==========================================

            const newLikes =
                currentTotalLikes -
                lastKnownTotalLikes;


            // ==========================================
            // UPDATE PREVIOUS TOTAL
            // ==========================================
            //
            // Important:
            //
            // Always move the tracker forward.
            // ==========================================

            lastKnownTotalLikes =
                currentTotalLikes;


            // ==========================================
            // IGNORE OLD / DUPLICATE EVENT
            // ==========================================

            if (
                newLikes <= 0
            ) {

                console.log(
                    'No new likes detected.'
                );

                return;

            }


            // ==========================================
            // ADD SESSION LIKES
            // ==========================================

            totalLikes +=
                newLikes;


            // ==========================================
            // UPDATE DASHBOARD STATS
            // ==========================================

            botState.stats.totalLikes =
                totalLikes;


            broadcastToDashboard({
                type:
                    'stats_update',

                stats:
                    botState.stats
            });


            // ==========================================
            // SEND LIKE EVENT TO DASHBOARD
            // ==========================================

            broadcastToDashboard({
                type:
                    'like',

                user:
                    username,

                count:
                    newLikes,

                total:
                    totalLikes
            });


            // ==========================================
            // LIKE TRACKING
            // ==========================================

            console.log('');
            console.log('==============================');
            console.log(
                'LIKE TRACKING'
            );
            console.log(
                `New likes: ${newLikes}`
            );
            console.log(
                `Session likes: ${totalLikes}`
            );
            console.log(
                `Next reward: ${
                    (likeRewardsGiven + 1) *
                    LIKES_PER_REWARD
                } likes`
            );
            console.log(
                '=============================='
            );


            // ==========================================
            // CALCULATE REWARDS EARNED
            // ==========================================

            const rewardsEarned =
                Math.floor(
                    totalLikes /
                    LIKES_PER_REWARD
                );


            // ==========================================
            // PROCESS NEW LIKE REWARDS
            // ==========================================

            while (
                likeRewardsGiven <
                rewardsEarned
            ) {

                likeRewardsGiven++;


                console.log('');
                console.log('==============================');
                console.log(
                    'LIKE MILESTONE REACHED'
                );
                console.log(
                    `Reward #${likeRewardsGiven}`
                );
                console.log(
                    `${
                        likeRewardsGiven *
                        LIKES_PER_REWARD
                    } SESSION LIKES`
                );
                console.log(
                    'TEAM A / RED'
                );
                console.log(
                    'SYSTEM: MOB BATTLE'
                );
                console.log(
                    '=============================='
                );


                spawnLikeReward(
                    username
                );

            }

        }
    );


    // ==========================================
    // TIKTOK FOLLOWS
    // ==========================================

    tiktok.on(
        WebcastEvent.FOLLOW,
        data => {

            // ==========================================
            // MOB BATTLE CHECK
            // ==========================================

            if (
                !canMobBattleReceiveEvents()
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
            // LOG FOLLOW
            // ==========================================

            console.log('');
            console.log('==============================');
            console.log(
                'TIKTOK FOLLOW DETECTED'
            );
            console.log(
                `User: ${username}`
            );
            console.log(
                'System: Mob Battle'
            );
            console.log(
                'Team: B / BLUE'
            );
            console.log(
                '=============================='
            );


            // ==========================================
            // DUPLICATE FOLLOW
            // ==========================================

            if (
                processedFollowers.has(
                    username
                )
            ) {

                console.log(
                    `FOLLOW IGNORED: ${username} already processed.`
                );

                return;

            }


            // ==========================================
            // SAVE FOLLOWER
            // ==========================================

            processedFollowers.add(
                username
            );


            // ==========================================
            // UPDATE DASHBOARD
            // ==========================================

            botState.stats.totalFollows++;


            broadcastToDashboard({
                type:
                    'stats_update',

                stats:
                    botState.stats
            });


            broadcastToDashboard({
                type:
                    'follow',

                user:
                    username
            });


            console.log(
                `NEW FOLLOWER: ${username}`
            );


            // ==========================================
            // SPAWN MOB BATTLE FOLLOW REWARD
            // ==========================================

            spawnFollowReward(
                username
            );

        }
    );

}