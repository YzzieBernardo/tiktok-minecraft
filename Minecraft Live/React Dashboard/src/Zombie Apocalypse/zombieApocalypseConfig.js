// ==========================================
// ZOMBIE APOCALYPSE V2 CONFIG
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

const CONFIG_FILE =
    path.join(
        __dirname,
        'zombieApocalypseConfig.json'
    );


// ==========================================
// DEFAULT CONFIGURATION
// ==========================================

const defaultConfig = {

    // Maximum zombies allowed alive
    // at the same time.
    maxActiveZombies: 100,

    // Minimum distance from target player.
    minSpawnDistance: 100,

    // Maximum distance from target player.
    maxSpawnDistance: 120,

    // Zombies spawned during one batch.
    zombiesPerBatch: 5,

    // Delay between spawn batches.
    spawnIntervalMs: 1000,

    // Maximum attempts to find a valid
    // spawn position.
    maxPositionAttempts: 20,

};


// ==========================================
// RUNTIME CONFIG
// ==========================================

let config = {
    ...defaultConfig,
};


// ==========================================
// SAVE CONFIG TO JSON
// ==========================================

function saveZombieApocalypseConfig() {

    try {

        fs.writeFileSync(
            CONFIG_FILE,
            JSON.stringify(
                config,
                null,
                4
            ),
            'utf8'
        );


        console.log(
            'Zombie Apocalypse V2: Config saved to JSON.'
        );


        return true;


    } catch (error) {

        console.error(
            'Zombie Apocalypse V2: Failed to save config JSON:',
            error
        );


        return false;

    }

}


// ==========================================
// LOAD CONFIG FROM JSON
// ==========================================

function loadZombieApocalypseConfig() {

    try {

        // ==========================================
        // CREATE JSON IF IT DOES NOT EXIST
        // ==========================================

        if (!fs.existsSync(CONFIG_FILE)) {

            config = {
                ...defaultConfig,
            };


            saveZombieApocalypseConfig();


            console.log(
                'Zombie Apocalypse V2: Config JSON created.'
            );


            return;

        }


        // ==========================================
        // READ JSON
        // ==========================================

        const fileData =
            fs.readFileSync(
                CONFIG_FILE,
                'utf8'
            );


        const parsed =
            JSON.parse(fileData);


        // ==========================================
        // VALIDATE JSON
        // ==========================================

        if (
            !parsed ||
            typeof parsed !== 'object' ||
            Array.isArray(parsed)
        ) {

            throw new Error(
                'Config JSON must contain an object.'
            );

        }


        // ==========================================
        // MERGE WITH DEFAULTS
        // ==========================================

        config = {
            ...defaultConfig,
            ...parsed,
        };


        // ==========================================
        // SAFETY CHECK
        // ==========================================

        config.maxActiveZombies =
            Math.max(
                1,
                Number(
                    config.maxActiveZombies
                ) || defaultConfig.maxActiveZombies
            );


        config.minSpawnDistance =
            Math.max(
                1,
                Number(
                    config.minSpawnDistance
                ) || defaultConfig.minSpawnDistance
            );


        config.maxSpawnDistance =
            Math.max(
                config.minSpawnDistance,
                Number(
                    config.maxSpawnDistance
                ) || config.minSpawnDistance
            );


        config.zombiesPerBatch =
            Math.max(
                1,
                Number(
                    config.zombiesPerBatch
                ) || defaultConfig.zombiesPerBatch
            );


        config.spawnIntervalMs =
            Math.max(
                100,
                Number(
                    config.spawnIntervalMs
                ) || defaultConfig.spawnIntervalMs
            );


        config.maxPositionAttempts =
            Math.max(
                1,
                Number(
                    config.maxPositionAttempts
                ) || defaultConfig.maxPositionAttempts
            );


        console.log(
            'Zombie Apocalypse V2: Config loaded from JSON.'
        );


        console.log(
            `Max Zombies: ${config.maxActiveZombies}`
        );


        console.log(
            `Min Distance: ${config.minSpawnDistance}`
        );


        console.log(
            `Max Distance: ${config.maxSpawnDistance}`
        );


    } catch (error) {

        console.error(
            'Zombie Apocalypse V2: Failed to load config JSON:',
            error
        );


        // ==========================================
        // FALLBACK TO DEFAULTS
        // ==========================================

        config = {
            ...defaultConfig,
        };


        saveZombieApocalypseConfig();

    }

}


// ==========================================
// LOAD CONFIG WHEN MODULE STARTS
// ==========================================

loadZombieApocalypseConfig();


// ==========================================
// GET CONFIG
// ==========================================

export function getZombieApocalypseConfig() {

    return {

        maxActiveZombies:
            config.maxActiveZombies,

        minSpawnDistance:
            config.minSpawnDistance,

        maxSpawnDistance:
            config.maxSpawnDistance,

        zombiesPerBatch:
            config.zombiesPerBatch,

        spawnIntervalMs:
            config.spawnIntervalMs,

        maxPositionAttempts:
            config.maxPositionAttempts,

    };

}


// ==========================================
// UPDATE CONFIG
// ==========================================

export function setZombieApocalypseConfig(
    updates = {}
) {

    // ==========================================
    // MAX ACTIVE ZOMBIES
    // ==========================================

    if (
        updates.maxActiveZombies !== undefined
    ) {

        config.maxActiveZombies =
            Math.max(
                1,
                Number(
                    updates.maxActiveZombies
                ) || 1
            );

    }


    // ==========================================
    // MIN SPAWN DISTANCE
    // ==========================================

    if (
        updates.minSpawnDistance !== undefined
    ) {

        config.minSpawnDistance =
            Math.max(
                1,
                Number(
                    updates.minSpawnDistance
                ) || 1
            );

    }


    // ==========================================
    // MAX SPAWN DISTANCE
    // ==========================================

    if (
        updates.maxSpawnDistance !== undefined
    ) {

        config.maxSpawnDistance =
            Math.max(
                config.minSpawnDistance,
                Number(
                    updates.maxSpawnDistance
                ) ||
                config.minSpawnDistance
            );

    }


    // ==========================================
    // ZOMBIES PER BATCH
    // ==========================================

    if (
        updates.zombiesPerBatch !== undefined
    ) {

        config.zombiesPerBatch =
            Math.max(
                1,
                Number(
                    updates.zombiesPerBatch
                ) || 1
            );

    }


    // ==========================================
    // SPAWN INTERVAL
    // ==========================================

    if (
        updates.spawnIntervalMs !== undefined
    ) {

        config.spawnIntervalMs =
            Math.max(
                100,
                Number(
                    updates.spawnIntervalMs
                ) || 100
            );

    }


    // ==========================================
    // MAX POSITION ATTEMPTS
    // ==========================================

    if (
        updates.maxPositionAttempts !== undefined
    ) {

        config.maxPositionAttempts =
            Math.max(
                1,
                Number(
                    updates.maxPositionAttempts
                ) || 1
            );

    }


    // ==========================================
    // SAFETY CHECK
    // ==========================================

    if (
        config.minSpawnDistance >
        config.maxSpawnDistance
    ) {

        config.maxSpawnDistance =
            config.minSpawnDistance;

    }


    // ==========================================
    // SAVE UPDATED CONFIG
    // ==========================================

    saveZombieApocalypseConfig();


    // ==========================================
    // LOG
    // ==========================================

    console.log('');

    console.log(
        '=============================='
    );

    console.log(
        'ZOMBIE APOCALYPSE V2'
    );

    console.log(
        'CONFIG UPDATED'
    );

    console.log(
        `Max Zombies: ${config.maxActiveZombies}`
    );

    console.log(
        `Min Distance: ${config.minSpawnDistance}`
    );

    console.log(
        `Max Distance: ${config.maxSpawnDistance}`
    );

    console.log(
        `Per Batch: ${config.zombiesPerBatch}`
    );

    console.log(
        `Interval: ${config.spawnIntervalMs}ms`
    );

    console.log(
        `Max Position Attempts: ${config.maxPositionAttempts}`
    );

    console.log(
        '=============================='
    );


    return getZombieApocalypseConfig();

}