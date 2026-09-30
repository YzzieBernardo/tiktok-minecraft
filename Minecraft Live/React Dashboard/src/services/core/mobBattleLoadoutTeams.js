// ==========================================
// MOB BATTLE LOADOUT TEAMS
// ==========================================
//
// NEW isolated team system for Mob Loadouts.
//
// IMPORTANT:
// This does NOT use:
// - teams.js
// - TikTok spawning
// - Zombie Apocalypse
//
// Team A = TeamA
// Team B = TeamB
// ==========================================

import {
    sendCommand
} from '../minecraft/lcon.js';


// ==========================================
// CREATE COMBAT TEAMS
// ==========================================

export function ensureMobBattleLoadoutTeams() {

    // ==========================================
    // TEAM A
    // ==========================================

    sendCommand(
        'team add TeamA'
    );

    sendCommand(
        'team modify TeamA color red'
    );

    sendCommand(
        'team modify TeamA friendlyFire false'
    );


    // ==========================================
    // TEAM B
    // ==========================================

    sendCommand(
        'team add TeamB'
    );

    sendCommand(
        'team modify TeamB color blue'
    );

    sendCommand(
        'team modify TeamB friendlyFire false'
    );
}


// ==========================================
// GET MINECRAFT TEAM
// ==========================================

function getMinecraftTeam(
    team
) {

    if (team === 'A') {
        return 'TeamA';
    }

    if (team === 'B') {
        return 'TeamB';
    }

    return null;
}


// ==========================================
// ASSIGN MOB TO TEAM
// ==========================================

export function assignMobBattleLoadoutTeam(
    tag,
    team
) {

    const combatTeam =
        getMinecraftTeam(
            team
        );


    if (!combatTeam) {
        return false;
    }


    sendCommand(
        `team join ${combatTeam} @e[tag=${tag},limit=1]`
    );


    return true;
}