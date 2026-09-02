//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\services\core\gameMode.js

// ==========================================
// GAME MODE
// ==========================================

let activeGameMode = 'NONE'

// ==========================================
// GAME MODES
// ==========================================

export const GAME_MODES = {
    NONE: 'NONE',
    MOB_BATTLE: 'MOB_BATTLE',
    ZOMBIE_APOCALYPSE: 'ZOMBIE_APOCALYPSE',
}

// ==========================================
// GET ACTIVE MODE
// ==========================================

export function getActiveGameMode() {
    return activeGameMode
}

// ==========================================
// CHECK MODE
// ==========================================

export function isGameModeActive(mode) {
    return activeGameMode === mode
}

// ==========================================
// ENABLE MODE
// ==========================================

export function enableGameMode(mode) {

    if (!Object.values(GAME_MODES).includes(mode)) {

        return {
            ok: false,
            error: `Invalid game mode: ${mode}`,
        }

    }

    // --------------------------------------
    // ANOTHER MODE IS ALREADY ACTIVE
    // --------------------------------------

    if (
        activeGameMode !== GAME_MODES.NONE &&
        activeGameMode !== mode
    ) {

        return {
            ok: false,
            error: `Cannot enable ${mode}. ${activeGameMode} is currently active.`,
            activeGameMode,
        }

    }

    activeGameMode = mode

    console.log(
        `Game Mode: ${activeGameMode}`
    )

    return {
        ok: true,
        activeGameMode,
    }

}

// ==========================================
// DISABLE MODE
// ==========================================

export function disableGameMode(mode) {

    if (activeGameMode !== mode) {

        return {
            ok: true,
            activeGameMode,
        }

    }

    activeGameMode = GAME_MODES.NONE

    console.log(
        'Game Mode: NONE'
    )

    return {
        ok: true,
        activeGameMode,
    }

}