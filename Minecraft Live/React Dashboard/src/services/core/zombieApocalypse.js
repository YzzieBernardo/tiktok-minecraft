// ==========================================
// zombieApocalypse.js
// ==========================================

let enabled = false
let maxZombies = 100
let activeZombies = 0


// ==========================================
// GET STATE
// ==========================================

export function getZombieApocalypseState() {

    return {
        enabled,
        maxZombies,
        activeZombies,
    }

}


// ==========================================
// ENABLE / DISABLE
// ==========================================

export function setZombieApocalypseEnabled(value) {

    enabled = Boolean(value)

    console.log(
        `Zombie Apocalypse: ${enabled ? 'ON' : 'OFF'}`
    )

    return getZombieApocalypseState()

}


// ==========================================
// SET MAX ZOMBIES
// ==========================================

export function setZombieMax(value) {

    maxZombies = Math.max(
        1,
        Math.floor(Number(value) || 100)
    )

    return getZombieApocalypseState()

}


// ==========================================
// SPAWN ZOMBIES
// ==========================================

export function spawnZombieCount(amount, sendCommand) {

    if (!enabled) {

        return {
            ok: false,
            error: 'Zombie Apocalypse is OFF',
        }

    }

    const requested = Math.max(
        0,
        Math.floor(Number(amount) || 0)
    )

    if (requested <= 0) {

        return {
            ok: false,
            error: 'Invalid zombie amount',
        }

    }

    const available = Math.max(
        0,
        maxZombies - activeZombies
    )

    const spawnAmount = Math.min(
        requested,
        available
    )

    if (spawnAmount <= 0) {

        return {
            ok: false,
            error: 'Zombie limit reached',
        }

    }

    let spawned = 0

    for (let i = 0; i < spawnAmount; i++) {

        const success = sendCommand(
            'execute at @p run summon minecraft:zombie ~ ~ ~'
        )

        if (success) {
            spawned++
        }

    }

    activeZombies += spawned

    return {
        ok: true,
        requested,
        spawned,
        blocked: requested - spawned,
        ...getZombieApocalypseState(),
    }

}


// ==========================================
// RESET COUNTER
// ==========================================

export function resetZombieCount() {

    activeZombies = 0

    return getZombieApocalypseState()

}