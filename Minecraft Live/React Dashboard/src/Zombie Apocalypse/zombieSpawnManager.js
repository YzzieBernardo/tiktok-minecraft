//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\Zombie Apocalypse\zombieSpawnManager.js
// ==========================================
// ZOMBIE APOCALYPSE V2
// ZOMBIE SPAWN MANAGER
// ==========================================
//
// Responsibilities:
// - Track active zombies
// - Enforce maximum zombie limit
// - Spawn zombies
// - Use configurable spawn distance
// - Keep Zombie Apocalypse separate
//   from Mob Battle
// ==========================================

import {
    sendCommand,
} from '../services/minecraft/lcon.js';

import {
    getZombieApocalypseConfig,
} from './zombieApocalypseConfig.js';

import {
    getZombieSpawnPosition,
} from './zombieSpawnPosition.js';

import {
processZombieQueueAfterDeath,
} from './zombieSpawnProcessor.js';


// ==========================================
// STATE
// ==========================================

let activeZombies = 0;

// ==========================================
// TRACK SPAWNED MOB TYPES
// ==========================================
//
// Stores the Minecraft mob IDs that were
// spawned by Zombie Apocalypse.
//
// Example:
// minecraft:zombie
// minecraft:skeleton
// minecraft:creeper
// ==========================================

const spawnedMobTypes = new Map();


// ==========================================
// STATUS
// ==========================================

export function getActiveZombieCount() {

    return activeZombies;

}


export function getZombieSpawnLimit() {

    const config =
        getZombieApocalypseConfig();

    return config.maxActiveZombies;

}


export function canSpawnZombie() {

    const config =
        getZombieApocalypseConfig();

    return (
        activeZombies <
        config.maxActiveZombies
    );

}
// ==========================================
// SPAWN ONE MOB
// ==========================================

export function spawnMob(
    mobId,
    donorName = 'Unknown'
) {

    // ==========================================
    // CHECK LIMIT
    // ==========================================

    if (!canSpawnZombie()) {

        console.log(
            'Zombie Apocalypse V2: Spawn limit reached.'
        );

        return false;

    }


    // ==========================================
    // VALIDATE MOB ID
    // ==========================================

    const mob =
    String(mobId || '').trim();

const displayName =
    String(donorName || '').trim() || 'Unknown';

    if (!mob) {

        console.log(
            'Zombie Apocalypse V2: Mob ID is required.'
        );

        return false;

    }


    // ==========================================
    // GET SPAWN POSITION
    // ==========================================

    const position =
        getZombieSpawnPosition();


    // ==========================================
    // SPAWN COMMAND
    // ==========================================

const command =
`execute at @p run summon ${mob} ~${position.x} ~ ~${position.z} {CustomName:'{"text":"${displayName}"}',CustomNameVisible:1b,Tags:["zombie_apocalypse"]}`;

    const sent =
        sendCommand(command);


    // ==========================================
    // MINECRAFT DISCONNECTED
    // ==========================================

    if (!sent) {

        console.log(
            `Zombie Apocalypse V2: Cannot spawn ${mob}. Minecraft disconnected.`
        );

        return false;

    }


    // ==========================================
    // UPDATE ACTIVE COUNT
    // ==========================================

    activeZombies++;

// ==========================================
// TRACK MOB TYPE
// ==========================================

const currentMobCount =
    spawnedMobTypes.get(mob) || 0;

spawnedMobTypes.set(
    mob,
    currentMobCount + 1
);


    const config =
        getZombieApocalypseConfig();


    console.log('');

    console.log('==============================');

    console.log(
        'ZOMBIE APOCALYPSE V2'
    );

    console.log(
        'MOB SPAWNED'
    );

    console.log(
        `Mob: ${mob}`
    );

    console.log(
        `Distance: ${position.distance} blocks`
    );

    console.log(
        `Position: X ${position.x} | Z ${position.z}`
    );

    console.log(
        `Active Mobs: ${activeZombies}/${config.maxActiveZombies}`
    );

    console.log(
        '=============================='
    );


    return true;
}

// ==========================================
// SPAWN MULTIPLE MOBS
// ==========================================

export function spawnMobs(
    mobId,
    amount = 1,
    donorName = 'Unknown'
) {

    const count =
        Math.max(
            0,
            Number(amount) || 0
        );


    let spawned = 0;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        // Stop when maximum is reached.
       if (!spawnMob(mobId, donorName)) {
            break;
        }


        spawned++;

    }


    return spawned;
}


// ==========================================
// ZOMBIE DIED
// ==========================================

export function registerZombieDeath(amount = 1) {

    const count =
        Math.max(
            0,
            Number(amount) || 0
        );

    if (count <= 0) {
        return;
    }

    activeZombies =
        Math.max(
            0,
            activeZombies - count
        );

    const config =
        getZombieApocalypseConfig();

    console.log('');
    console.log('==============================');
    console.log('ZOMBIE APOCALYPSE V2');
    console.log('MOB DEATH REGISTERED');
    console.log(`Deaths: ${count}`);
    console.log(
        `Active Mobs: ${activeZombies}/${config.maxActiveZombies}`
    );
    console.log('==============================');

    // ==========================================
    // RELEASE QUEUED MOBS
    // ==========================================

    processZombieQueueAfterDeath();
}


// ==========================================
// RESET
// ==========================================

export function resetZombieSpawnManager() {

    activeZombies = 0;


    console.log(
        'Zombie Apocalypse V2: Spawn manager reset.'
    );


    

}

// ==========================================
// REGISTER MOB DEATH BY NAME
// ==========================================
//
// Used when Minecraft reports that a mob died.
//
// Example:
// "Zombie was slain"
// "Skeleton was killed"
// "Creeper died"
//
// The function checks the currently tracked
// Zombie Apocalypse mob types.
// ==========================================
export function registerZombieDeathByName(
    message = ''
) {

    const text =
        String(message || '')
            .toLowerCase()
            .trim();

    if (!text) {
        return false;
    }


    // ==========================================
    // DEATH KEYWORDS
    // ==========================================

    const deathKeywords = [
        'died',
        'was slain',
        'was killed',
        'was shot',
        'was blown up',
        'was squashed',
        'was burned',
        'was fireballed',
        'was impaled',
        'was struck by lightning',
        'was killed by',
        'fell from',
        'hit the ground',
        'drowned',
        'suffocated',
        'starved',
        'froze to death',
        'went up in flames',
        'experienced kinetic energy',
    ];


    const isDeathMessage =
        deathKeywords.some(
            keyword =>
                text.includes(keyword)
        );


    // ==========================================
    // NOT A DEATH MESSAGE
    // ==========================================

    if (!isDeathMessage) {
        return false;
    }


    // ==========================================
    // FIND TRACKED MOB
    // ==========================================

    for (const [mobId, count] of spawnedMobTypes) {

        if (count <= 0) {
            continue;
        }


        // Example:
        // minecraft:zombie -> zombie
        // minecraft:skeleton -> skeleton
        // minecraft:creeper -> creeper

        const mobName =
            mobId.includes(':')
                ? mobId.split(':').pop()
                : mobId;


        // ==========================================
        // CHECK MOB NAME
        // ==========================================

        if (
            !text.includes(
                mobName.toLowerCase()
            )
        ) {
            continue;
        }


        // ==========================================
        // REMOVE ONE TRACKED MOB
        // ==========================================

        const remaining =
            count - 1;


        if (remaining <= 0) {

            spawnedMobTypes.delete(
                mobId
            );

        } else {

            spawnedMobTypes.set(
                mobId,
                remaining
            );

        }


        // ==========================================
        // UPDATE ACTIVE COUNT
        // ==========================================

        registerZombieDeath(1);


        console.log('');
        console.log('==============================');
        console.log('ZOMBIE APOCALYPSE V2');
        console.log('MOB DEATH DETECTED');
        console.log(`Mob: ${mobId}`);
        console.log(`Message: ${message}`);
        console.log(
            `Active Mobs: ${activeZombies}`
        );
        console.log('==============================');


        return true;
    }


    return false;
}