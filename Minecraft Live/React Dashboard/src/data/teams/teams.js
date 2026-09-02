
//Minecraft Live/React Dashboard/src/data/teams/teams.js

import {
    sendCommand
} from '../../services/minecraft/lcon.js';

import {
    getMobBattleSpawnName
} from '../../services/core/mobBattleConfig.js';
let spawnCounter = 0;


// ==========================================
// CREATE COMBAT TEAMS
// ==========================================

export function ensureTeamsExist() {

    // ==========================================
    // TEAM A
    // RED + YELLOW = MAGKAKAMPI
    // ==========================================

sendCommand('team add TeamA')
sendCommand('team modify TeamA color red')
sendCommand('team modify TeamA friendlyFire false')



    // ==========================================
    // TEAM B
    // BLUE + GREEN = MAGKAKAMPI
    // ==========================================

sendCommand('team add TeamB')
sendCommand('team modify TeamB color blue')
sendCommand('team modify TeamB friendlyFire false')
    }


// ==========================================
// GET COMBAT TEAM
// ==========================================

function getCombatTeam(team) {

    // ==========================================
    // TEAM A
    // ==========================================

    if (team === 'A') {
        return 'TeamA';
    }


    // ==========================================
    // TEAM B
    // ==========================================

    if (team === 'B') {
        return 'TeamB';
    }


    return null;
}


// ==========================================
// SPAWN MOB FOR TEAM
// ==========================================

export function spawnMobForTeam(
    entityId,
    team,
    donorName = null,
    nameColor = null
) {

    spawnCounter++;

    const tag = `spawn_${spawnCounter}`;


    // ==========================================
    // ENTITY ID
    // ==========================================

    const summonId = entityId.includes(':')
        ? entityId
        : `minecraft:${entityId}`;


    // ==========================================
    // VALID NAME COLORS
    // ==========================================

    const validColors = [
        'red',
        'yellow',
        'blue',
        'green'
    ];


    // ==========================================
    // DETERMINE NAME COLOR
    // ==========================================

    // Kung may explicit color:
    // gamitin iyon.
    //
    // Kung wala:
    // Team A = RED
    // Team B = BLUE

    const color = validColors.includes(nameColor)
        ? nameColor
        : team === 'A'
            ? 'red'
            : team === 'B'
                ? 'blue'
                : 'white';


    // ==========================================
    // DISPLAY COLOR NAME
    // ==========================================

    const displayColor = {
        red: 'RED',
        yellow: 'YELLOW',
        blue: 'BLUE',
        green: 'GREEN'
    }[color] || 'WHITE';


    // ==========================================
    // COMBAT TEAM
    // ==========================================

    const combatTeam = getCombatTeam(team);


    // ==========================================
    // DISPLAY NAME
    // ==========================================

    // Manual test:
    //
    // Unknown -> TEST

const displayName =
    getMobBattleSpawnName(
        team,
        donorName
    );
    // ==========================================
    // FINAL NAMETAG
    // ==========================================

    // Examples:
    //
    // [RED] Juan
    // [YELLOW] Maria
    // [BLUE] Pedro
    // [GREEN] Alex
    //
    // Manual:
    //
    // [RED] TEST
    // [BLUE] TEST

const safeDisplayName = String(
    displayName || 'MOB'
)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');

const nameText =
    `[${displayColor}] ${safeDisplayName}`;



    // ==========================================
    // LOG
    // ==========================================

    console.log(
        `Spawning ${summonId} | ` +
        `Team ${team} | ` +
        `CombatTeam: ${combatTeam || 'None'} | ` +
        `Donor: ${donorName} | ` +
        `Color: ${color} | ` +
        `Tag: ${tag}`
    );


    // ==========================================
    // SPAWN POSITION
    // ==========================================

    // 7 x 7 formation
    // 2 blocks ang pagitan ng bawat mob.

    const gridIndex =
        (spawnCounter - 1) % 49;

    const column =
        gridIndex % 7;

    const row =
        Math.floor(gridIndex / 7);

    const offsetX =
        column * 2 - 6;

    const offsetZ =
        row * 2 - 6;


    // ==========================================
    // SUMMON MOB
    // ==========================================


    sendCommand(
        `summon ${summonId} ~${offsetX} ~ ~${offsetZ} ` +
        `{` +
        `Tags:["${tag}"],` +
        `CustomName:'{"text":"${nameText}","color":"${color}"}',` +
        `CustomNameVisible:1b` +
        `}`
    );


    // ==========================================
    // ASSIGN COMBAT TEAM
    // ==========================================

    if (combatTeam) {

        sendCommand(
            `team join ${combatTeam} @e[tag=${tag},limit=1]`
        );
    }
}


// ==========================================
// SPAWN RANDOM MUTANT
// ==========================================

export function spawnRandomMutant(
    team,
    donorName = 'Unknown',
    nameColor = null
) {

    const mutants = [
        'mutantmonsters:mutant_zombie',
        'mutantmonsters:mutant_skeleton',
        'mutantmonsters:mutant_creeper',
        'mutantmonsters:mutant_enderman'
    ];


    const randomMutant =
        mutants[
            Math.floor(
                Math.random() * mutants.length
            )
        ];


    spawnMobForTeam(
        randomMutant,
        team,
        donorName,
        nameColor
    );
}