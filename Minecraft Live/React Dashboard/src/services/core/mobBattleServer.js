//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\services\core\mobBattleServer.js

// ==========================================
// MOB BATTLE SERVER
// ==========================================

import {
    getMobBattleNames,
    getMobBattleName,
    createMobBattleName,
    updateMobBattleName,
    deleteMobBattleName,
    getMobBattleNameMode,
    setMobBattleNameMode,
} from './mobBattleConfig.js';

import {
    GAME_MODES,
    enableGameMode,
    disableGameMode,
    isGameModeActive,
} from './gameMode.js';

// ==========================================
// START MOB BATTLE
// ==========================================

export function startMobBattle() {

    const result =
        enableGameMode(
            GAME_MODES.MOB_BATTLE
        );


    if (!result.ok) {

        console.log(
            `Mob Battle: Cannot start. ${result.error}`
        );

        return result;
    }


    console.log(
        'Mob Battle: ON'
    );


    return result;
}


// ==========================================
// STOP MOB BATTLE
// ==========================================

export function stopMobBattle() {

    const result =
        disableGameMode(
            GAME_MODES.MOB_BATTLE
        );


    console.log(
        'Mob Battle: OFF'
    );


    return result;
}


// ==========================================
// MOB BATTLE STATUS
// ==========================================

export function isMobBattleRunning() {

    return isGameModeActive(
        GAME_MODES.MOB_BATTLE
    );

}

// ==========================================
// MOB BATTLE EVENT PERMISSION
// ==========================================

export function canMobBattleReceiveEvents() {
    return isMobBattleRunning();
}


// ==========================================
// SETUP MOB BATTLE SERVER
// ==========================================

export function setupMobBattleServer(app) {

    // ==========================================
// GET CUSTOM MOB NAMES
// ==========================================

app.get(
    '/api/mob-battle/names',
    (req, res) => {

        res.json({

            ok: true,

            names:
                getMobBattleNames()

                

        });

        

    }
);

// ==========================================
// GET MOB NAME MODE
// ==========================================

app.get(
    '/api/mob-battle/name-mode',
    (req, res) => {

        res.json({

            ok: true,

            ...getMobBattleNameMode()

        });

    }
);


// ==========================================
// SET MOB NAME MODE
// ==========================================

app.post(
    '/api/mob-battle/name-mode',
    (req, res) => {

        try {

            const result =
                setMobBattleNameMode(
                    req.body || {}
                );


            res.json({

                ok: true,

                ...result

            });

        } catch (error) {

            console.error(
                'Mob Battle name mode error:',
                error
            );


            res.status(400).json({

                ok: false,

                error:
                    error.message

            });

        }

    }
);
// ==========================================
// GET ONE CUSTOM MOB NAME
// ==========================================

app.get(
    '/api/mob-battle/names/:id',
    (req, res) => {

        const id =
            Number(
                req.params.id
            );

        const name =
            getMobBattleName(id);

        if (!name) {

            return res.status(404).json({

                ok: false,

                error:
                    'Mob name not found.'

            });

        }

        res.json({

            ok: true,

            name

        });

    }
);

// ==========================================
// CREATE CUSTOM MOB NAME
// ==========================================

app.post(
    '/api/mob-battle/names',
    (req, res) => {

        try {

            const saved =
                createMobBattleName(
                    req.body || {}
                );


            res.json({

                ok: true,

                name:
                    saved

            });

        } catch (error) {

            console.error(
                'Mob Battle name create error:',
                error
            );


            res.status(400).json({

                ok: false,

                error:
                    error.message

            });

        }

    }
);

// ==========================================
// UPDATE CUSTOM MOB NAME
// ==========================================

app.put(
    '/api/mob-battle/names/:id',
    (req, res) => {

        try {

            const id =
                Number(
                    req.params.id
                );


            const saved =
                updateMobBattleName(
                    id,
                    req.body || {}
                );


            if (!saved) {

                return res.status(404).json({

                    ok: false,

                    error:
                        'Mob name not found.'

                });

            }


            res.json({

                ok: true,

                name:
                    saved

            });

        } catch (error) {

            console.error(
                'Mob Battle name update error:',
                error
            );


            res.status(400).json({

                ok: false,

                error:
                    error.message

            });

        }

    }
);

// ==========================================
// DELETE CUSTOM MOB NAME
// ==========================================

app.delete(
    '/api/mob-battle/names/:id',
    (req, res) => {

        const removed =
            deleteMobBattleName(
                Number(
                    req.params.id
                )
            );


        if (!removed) {

            return res.status(404).json({

                ok: false,

                error:
                    'Mob name not found.'

            });

        }


        res.json({

            ok: true

        });

    }
);
    // ==========================================
    // GET STATUS
    // ==========================================

    app.get(
        '/api/mob-battle/status',
        (req, res) => {

            res.json({
                running:
                    isMobBattleRunning(),
                activeGameMode:
                    isGameModeActive(
                        GAME_MODES.MOB_BATTLE
                    )
                        ? GAME_MODES.MOB_BATTLE
                        : GAME_MODES.NONE,
            });

        }
    );


    // ==========================================
    // TOGGLE ON / OFF
    // ==========================================

    app.post(
        '/api/mob-battle/toggle',
        (req, res) => {

            try {

                const { enabled } =
                    req.body;


                // ==========================================
                // TURN ON
                // ==========================================

                if (enabled) {

                    const result =
                        startMobBattle();


                    if (!result.ok) {

                        return res.status(409).json({
                            ok: false,
                            error: result.error,
                            activeGameMode:
                                result.activeGameMode,
                        });

                    }


                    return res.json({
                        ok: true,
                        running: true,
                        activeGameMode:
                            result.activeGameMode,
                    });

                }


                // ==========================================
                // TURN OFF
                // ==========================================

                const result =
                    stopMobBattle();


                return res.json({
                    ok: true,
                    running: false,
                    activeGameMode:
                        result.activeGameMode,
                });

            } catch (error) {

                console.error(
                    'Mob Battle toggle error:',
                    error
                );


                return res.status(500).json({
                    ok: false,
                    error: error.message,
                });

            }

        }
    );


    // ==========================================
    // SERVER READY
    // ==========================================

    console.log(
        'Mob Battle Server: Ready.'
    );

}