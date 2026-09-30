2// ==========================================
// MOB BATTLE BATTLEFIELD CONFIG
// ==========================================
//
// Persistent configuration for the separate
// Mob Battle Battlefield system.
//
// This does NOT modify:
// - TikTok Mob Battle teams
// - Zombie Apocalypse
// - Mob Battle Loadouts
// ==========================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const battlefieldFile = path.join(
    __dirname,
    'mobBattleBattlefield.json'
);

// ==========================================
// DEFAULT CONFIG
// ==========================================

const defaultBattlefield = {
    teamAPosition: {
        x: '',
        y: '',
        z: ''
    },

    teamBPosition: {
        x: '',
        y: '',
        z: ''
    },

    width: 100,

    length: 100,

    direction: '+X',

    teamA: [],

    teamB: []
};

// ==========================================
// ENSURE FILE
// ==========================================

function ensureBattlefieldFile() {
    if (!fs.existsSync(battlefieldFile)) {
        fs.writeFileSync(
            battlefieldFile,
            JSON.stringify(
                defaultBattlefield,
                null,
                2
            ),
            'utf8'
        );

        console.log(
            'Mob Battle Battlefield: Created battlefield.json'
        );
    }
}

// ==========================================
// READ
// ==========================================

function readBattlefield() {
    ensureBattlefieldFile();

    try {
        const raw = fs.readFileSync(
            battlefieldFile,
            'utf8'
        );

        const data = JSON.parse(raw);

  const legacyCenter = data.center || {};

return {
    ...defaultBattlefield,
    ...data,

    teamAPosition: {
        ...defaultBattlefield.teamAPosition,
        ...(data.teamAPosition || {}),

        // Backward compatibility:
        // old center becomes Team A position
        ...(data.teamAPosition
            ? {}
            : legacyCenter)
    },

    teamBPosition: {
        ...defaultBattlefield.teamBPosition,
        ...(data.teamBPosition || {})
    },

    teamA: Array.isArray(data.teamA)
        ? data.teamA
        : [],

    teamB: Array.isArray(data.teamB)
        ? data.teamB
        : []
};

    } catch (error) {
        console.error(
            'Mob Battle Battlefield: Failed to read config:',
            error
        );

        throw new Error(
            'Failed to read Mob Battle Battlefield configuration.'
        );
    }
}

// ==========================================
// WRITE
// ==========================================

function writeBattlefield(data) {
    fs.writeFileSync(
        battlefieldFile,
        JSON.stringify(
            data,
            null,
            2
        ),
        'utf8'
    );
}

// ==========================================
// GET
// ==========================================

export function getMobBattleBattlefield() {
    return readBattlefield();
}

// ==========================================
// SAVE
// ==========================================

export function saveMobBattleBattlefield(config) {
    if (!config || typeof config !== 'object') {
        throw new Error(
            'Invalid Battlefield configuration.'
        );
    }

   const teamAPosition = config.teamAPosition || {};
const teamBPosition = config.teamBPosition || {};

const normalized = {
    teamAPosition: {
        x: teamAPosition.x ?? '',
        y: teamAPosition.y ?? '',
        z: teamAPosition.z ?? ''
    },

    teamBPosition: {
        x: teamBPosition.x ?? '',
        y: teamBPosition.y ?? '',
        z: teamBPosition.z ?? ''
    },

    width: Number(config.width) || 100,

    length: Number(config.length) || 100,

    direction:
        config.direction === '-X' ||
        config.direction === '+Z' ||
        config.direction === '-Z'
            ? config.direction
            : '+X',

    teamA: Array.isArray(config.teamA)
        ? config.teamA
        : [],

    teamB: Array.isArray(config.teamB)
        ? config.teamB
        : []
};

    writeBattlefield(normalized);

    return normalized;
}

// ==========================================
// RESET
// ==========================================

export function resetMobBattleBattlefield() {
    writeBattlefield(defaultBattlefield);

    return defaultBattlefield;
}

// ==========================================
// READY
// ==========================================

ensureBattlefieldFile();

console.log(
    'Mob Battle Battlefield Config: Ready.'
);