//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\Zombie Apocalypse\zombieSpawnPosition.js

// ==========================================
// ZOMBIE APOCALYPSE V2
// ZOMBIE SPAWN POSITION
// ==========================================

import {
    getZombieApocalypseConfig,
} from './zombieApocalypseConfig.js';


// ==========================================
// RANDOM NUMBER
// ==========================================

function randomBetween(min, max) {

    return (
        min +
        Math.random() *
        (max - min)
    );

}


// ==========================================
// GET RANDOM SPAWN POSITION
// ==========================================
//
// Returns an X/Z offset from the target
// player.
//
// Example:
//
// Player
//   ●
//    \
//     \ 100–120 blocks
//      × Zombie
//
// ==========================================

export function getZombieSpawnPosition() {

    const config =
        getZombieApocalypseConfig();


    const angle =
        Math.random() *
        Math.PI *
        2;


    const distance =
        randomBetween(
            config.minSpawnDistance,
            config.maxSpawnDistance
        );


    const x =
        Math.round(
            Math.cos(angle) *
            distance
        );


    const z =
        Math.round(
            Math.sin(angle) *
            distance
        );


    return {

        x,

        z,

        distance:
            Math.round(distance),

    };

}