import { WebcastEvent } from 'tiktok-live-connector';
import { tiktok } from './connection.js';
import {
    spawnMobForTeam,
    ensureTeamsExist
} from '../teams/teams.js';


// ==========================================
// SOCIAL SYSTEM
// ==========================================
//
// RED TEAM / TEAM A
// 100 LIKES =
// 3 Zombie
// 3 Skeleton
// 3 Creeper
// 3 Enderman
//
// BLUE TEAM / TEAM B
// 1 UNIQUE FOLLOW =
// 10 Zombie
// 10 Skeleton
// 10 Creeper
// 10 Enderman
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
// LIKE STATE
// ==========================================

// Likes counted by this bot session.
let totalLikes = 0;

// Last cumulative TikTok like total we received.
let lastKnownTotalLikes = null;

// Number of 100-like rewards already spawned.
let likeRewardsGiven = 0;


// ==========================================
// FOLLOW STATE
// ==========================================

// Users who already received their
// follow reward during this bot session.
const processedFollowers = new Set();


// ==========================================
// SPAWN LIKE REWARD
// TEAM A / RED
// ==========================================

function spawnLikeReward(username = 'Unknown') {

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


    // Zombie

    for (let i = 0; i < LIKE_ZOMBIES; i++) {

        spawnMobForTeam(
            'zombie',
            'A'
        );
    }


    // Skeleton

    for (let i = 0; i < LIKE_SKELETONS; i++) {

        spawnMobForTeam(
            'skeleton',
            'A'
        );
    }


    // Creeper

    for (let i = 0; i < LIKE_CREEPERS; i++) {

        spawnMobForTeam(
            'creeper',
            'A'
        );
    }


    // Enderman

    for (let i = 0; i < LIKE_ENDERMEN; i++) {

        spawnMobForTeam(
            'enderman',
            'A'
        );
    }
}


// ==========================================
// SPAWN FOLLOW REWARD
// TEAM B / BLUE
// ==========================================

function spawnFollowReward(username = 'Unknown') {

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


    // Zombie

    for (let i = 0; i < FOLLOW_ZOMBIES; i++) {

        spawnMobForTeam(
            'zombie',
            'B'
        );
    }


    // Skeleton

    for (let i = 0; i < FOLLOW_SKELETONS; i++) {

        spawnMobForTeam(
            'skeleton',
            'B'
        );
    }


    // Creeper

    for (let i = 0; i < FOLLOW_CREEPERS; i++) {

        spawnMobForTeam(
            'creeper',
            'B'
        );
    }


    // Enderman

    for (let i = 0; i < FOLLOW_ENDERMEN; i++) {

        spawnMobForTeam(
            'enderman',
            'B'
        );
    }
}


// ==========================================
// SETUP SOCIAL LISTENERS
// ==========================================

export function setupSocialListener() {

    // ==========================================
    // CREATE TEAMS
    // ==========================================

    ensureTeamsExist();


    // ==========================================
    // TIKTOK LIKES
    // ==========================================

    tiktok.on(WebcastEvent.LIKE, data => {

        const username =
            data.user?.uniqueId ||
            data.user?.displayId ||
            'Unknown';


        // TikTok's `total` is the cumulative
        // like count for the LIVE.

        const currentTotalLikes =
            Number(data.total || 0);


        // Number of likes represented by
        // this specific event.

        const eventLikes =
            Number(data.count || 0);


        console.log('');
        console.log('==============================');
        console.log('TIKTOK LIKE DETECTED');
        console.log(`User: ${username}`);
        console.log(`Likes this event: ${eventLikes}`);
        console.log(`TikTok total likes: ${currentTotalLikes}`);
        console.log(`Bot previous total: ${lastKnownTotalLikes}`);
        console.log('Red Team: LIKE');
        console.log('==============================');


        // ==========================================
        // FIRST LIKE EVENT
        // ==========================================

        if (lastKnownTotalLikes === null) {

            lastKnownTotalLikes =
                currentTotalLikes;

            console.log(
                `Starting like tracker at ` +
                `${currentTotalLikes} likes.`
            );

            return;
        }


        // ==========================================
        // CALCULATE NEW LIKES
        // ==========================================

        const newLikes =
            currentTotalLikes -
            lastKnownTotalLikes;


        // ==========================================
        // IGNORE DUPLICATE / OLD EVENTS
        // ==========================================

        if (newLikes <= 0) {

            console.log(
                'No new likes detected.'
            );

            return;
        }


        // ==========================================
        // UPDATE LIKE TOTAL
        // ==========================================

        totalLikes += newLikes;

        lastKnownTotalLikes =
            currentTotalLikes;


        console.log('');
        console.log('==============================');
        console.log('LIKE TRACKING');
        console.log(`New likes: ${newLikes}`);
        console.log(`Session likes: ${totalLikes}`);
        console.log(
            `Next reward: ${
                (likeRewardsGiven + 1) *
                LIKES_PER_REWARD
            } likes`
        );
        console.log('==============================');


        // ==========================================
        // CALCULATE REWARDS
        // ==========================================

        const rewardsEarned =
            Math.floor(
                totalLikes /
                LIKES_PER_REWARD
            );


        // ==========================================
        // SPAWN NEW REWARDS ONLY
        // ==========================================

        while (
            likeRewardsGiven <
            rewardsEarned
        ) {

            likeRewardsGiven++;


            console.log('');
            console.log('==============================');
            console.log('LIKE MILESTONE REACHED');
            console.log(
                `Reward #${likeRewardsGiven}`
            );
            console.log(
                `${likeRewardsGiven * LIKES_PER_REWARD}` +
                ` SESSION LIKES`
            );
            console.log('TEAM A / RED');
            console.log('==============================');


            spawnLikeReward(username);
        }
    });


    // ==========================================
    // TIKTOK FOLLOWS
    // ==========================================

    tiktok.on(WebcastEvent.FOLLOW, data => {

        const username =
            data.user?.uniqueId ||
            data.user?.displayId ||
            'Unknown';


        console.log('');
        console.log('==============================');
        console.log('TIKTOK FOLLOW DETECTED');
        console.log(`User: ${username}`);
        console.log('Team: B / BLUE');
        console.log('==============================');


        // ==========================================
        // CHECK DUPLICATE FOLLOW
        // ==========================================

        if (
            processedFollowers.has(username)
        ) {

            console.log(
                `FOLLOW IGNORED: ` +
                `${username} already processed.`
            );

            console.log(
                '=============================='
            );

            return;
        }


        // ==========================================
        // SAVE FOLLOWER
        // ==========================================

        processedFollowers.add(
            username
        );


        console.log(
            `NEW FOLLOWER: ${username}`
        );


        // ==========================================
        // SPAWN BLUE TEAM REWARD
        // ==========================================

        spawnFollowReward(
            username
        );
    });
}