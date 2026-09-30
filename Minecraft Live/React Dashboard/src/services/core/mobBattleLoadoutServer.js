// ==========================================
// MOB BATTLE LOADOUT SERVER
// ==========================================
//
// Separate API for Mob Battle Loadouts.
//
// IMPORTANT:
// This does NOT replace or modify
// mobBattleServer.js.
// ==========================================

import {
    getMobBattleLoadouts,
    getMobBattleLoadout,
    createMobBattleLoadout,
    updateMobBattleLoadout,
    deleteMobBattleLoadout,
    getEnabledMobBattleLoadouts
} from './mobBattleLoadoutConfig.js';

import {
    getMobBattleCatalog,
    addMobBattleCatalogItem,
    updateMobBattleCatalogItem,
    deleteMobBattleCatalogItem
} from './mobBattleCatalog.js';

import {
    spawnMobBattleLoadout,
    spawnMobBattleLoadoutInBattlefield
} from './mobBattle.js';

import { getMinecraftPlayerPosition } from '../minecraft/lcon.js';

import {
    getMobBattleBattlefield,
    saveMobBattleBattlefield,
    resetMobBattleBattlefield
} from './mobBattleBattlefieldConfig.js';

// ==========================================
// SETUP
// ==========================================

export function setupMobBattleLoadoutServer(app) {


    // ==========================================
// GET CURRENT MINECRAFT PLAYER POSITION
// ==========================================

app.get(
    '/api/mob-battle/battlefield/position',

    
    async (req, res) => {

        try {

            const player =
                String(req.query.player || '@p').trim();

            const position =
                await getMinecraftPlayerPosition(player);

            res.json({
                success: true,
                position
            });

        } catch (error) {

            console.error(
                'Mob Battle Battlefield: Failed to get Minecraft position:',
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
);

// ========================================
// BATTLEFIELD CONFIG
// ========================================

// GET SAVED BATTLEFIELD

app.get(
    '/api/mob-battle/battlefield',
    (req, res) => {
        try {
            const battlefield =
                getMobBattleBattlefield();

            res.json({
                success: true,
                battlefield
            });

        } catch (error) {

            console.error(
                'Mob Battle Battlefield GET Error:',
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
);


// SAVE BATTLEFIELD

app.post(
    '/api/mob-battle/battlefield',
    (req, res) => {
        try {

            const battlefield =
                saveMobBattleBattlefield(
                    req.body
                );

            res.json({
                success: true,
                message:
                    'Mob Battle Battlefield saved successfully.',
                battlefield
            });

        } catch (error) {

            console.error(
                'Mob Battle Battlefield SAVE Error:',
                error
            );

            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
);


// RESET BATTLEFIELD

app.delete(
    '/api/mob-battle/battlefield',
    (req, res) => {
        try {

            const battlefield =
                resetMobBattleBattlefield();

            res.json({
                success: true,
                message:
                    'Mob Battle Battlefield reset successfully.',
                battlefield
            });

        } catch (error) {

            console.error(
                'Mob Battle Battlefield RESET Error:',
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
);

// ========================================
// BATTLEFIELD SPAWN
// ========================================

app.post(
    '/api/mob-battle/battlefield/spawn',
    (req, res) => {

        try {

const {
    teamAPosition,
    teamBPosition,
    width,
    length,
    direction,
    teamA,
    teamB,
    donorName
} = req.body || {};


  const result =
    spawnMobBattleLoadoutInBattlefield({
        teamAPosition,
        teamBPosition,
        width,
        length,
        direction,
        teamA,
        teamB,
        donorName
    });

            res.json({
                success: true,
                message:
                    'Mob Battle Battlefield spawned successfully.',
                result
            });

        } catch (error) {

            console.error(
                'Mob Battle Battlefield SPAWN Error:',
                error
            );

            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
);
    // ========================================
    // CATALOG API
    // ========================================

    // ----------------------------------------
    // GET CATALOG
    // ----------------------------------------

    app.get('/api/mob-battle/catalog/:catalog', (req, res) => {
        try {
            const catalog = getMobBattleCatalog(
                req.params.catalog
            );

            res.json({
                success: true,
                catalog: req.params.catalog,
                items: catalog
            });

        } catch (error) {
            console.error(
                'Mob Battle Catalog GET Error:',
                error
            );

            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    });

    // ----------------------------------------
    // CREATE CATALOG ITEM
    // ----------------------------------------

    app.post('/api/mob-battle/catalog/:catalog', (req, res) => {
        try {
            const item = addMobBattleCatalogItem(
                req.params.catalog,
                req.body
            );

            res.status(201).json({
                success: true,
                message: 'Catalog item created successfully.',
                item
            });

        } catch (error) {
            console.error(
                'Mob Battle Catalog CREATE Error:',
                error
            );

            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    });

    // ----------------------------------------
    // UPDATE CATALOG ITEM
    // ----------------------------------------

    app.put('/api/mob-battle/catalog/:catalog/:id', (req, res) => {
        try {
            const item = updateMobBattleCatalogItem(
                req.params.catalog,
                req.params.id,
                req.body
            );

            res.json({
                success: true,
                message: 'Catalog item updated successfully.',
                item
            });

        } catch (error) {
            console.error(
                'Mob Battle Catalog UPDATE Error:',
                error
            );

            const status =
                error.message.startsWith(
                    'Catalog item not found:'
                )
                    ? 404
                    : 400;

            res.status(status).json({
                success: false,
                error: error.message
            });
        }
    });

    // ----------------------------------------
    // DELETE CATALOG ITEM
    // ----------------------------------------

    app.delete('/api/mob-battle/catalog/:catalog/:id', (req, res) => {
        try {
            const item = deleteMobBattleCatalogItem(
                req.params.catalog,
                req.params.id
            );

            res.json({
                success: true,
                message: 'Catalog item deleted successfully.',
                item
            });

        } catch (error) {
            console.error(
                'Mob Battle Catalog DELETE Error:',
                error
            );

            const status =
                error.message.startsWith(
                    'Catalog item not found:'
                )
                    ? 404
                    : 400;

            res.status(status).json({
                success: false,
                error: error.message
            });
        }
    });

    // ========================================
    // LOADOUT API
    // ========================================

    // ----------------------------------------
    // GET ALL LOADOUTS
    // ----------------------------------------

    app.get('/api/mob-battle/loadouts', (req, res) => {
        try {
            res.json({
                success: true,
                loadouts: getMobBattleLoadouts()
            });

        } catch (error) {
            console.error(
                'Mob Battle Loadouts GET Error:',
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ----------------------------------------
    // GET ENABLED LOADOUTS
    // ----------------------------------------

    app.get('/api/mob-battle/loadouts/enabled', (req, res) => {
        try {
            res.json({
                success: true,
                loadouts: getEnabledMobBattleLoadouts()
            });

        } catch (error) {
            console.error(
                'Mob Battle Enabled Loadouts GET Error:',
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ----------------------------------------
    // GET SINGLE LOADOUT
    // ----------------------------------------

    app.get('/api/mob-battle/loadouts/:id', (req, res) => {
        try {
            const loadout = getMobBattleLoadout(
                req.params.id
            );

            if (!loadout) {
                return res.status(404).json({
                    success: false,
                    error: 'Loadout not found.'
                });
            }

            res.json({
                success: true,
                loadout
            });

        } catch (error) {
            console.error(
                'Mob Battle Loadout GET Error:',
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ----------------------------------------
    // CREATE LOADOUT
    // ----------------------------------------

    app.post('/api/mob-battle/loadouts', (req, res) => {
        try {
            const loadout = createMobBattleLoadout(
                req.body
            );

            res.status(201).json({
                success: true,
                message: 'Loadout created successfully.',
                loadout
            });

        } catch (error) {
            console.error(
                'Mob Battle Loadout CREATE Error:',
                error
            );

            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    });

    // ----------------------------------------
    // UPDATE LOADOUT
    // ----------------------------------------

    app.put('/api/mob-battle/loadouts/:id', (req, res) => {
        try {
            const loadout = updateMobBattleLoadout(
                req.params.id,
                req.body
            );

            res.json({
                success: true,
                message: 'Loadout updated successfully.',
                loadout
            });

        } catch (error) {
            console.error(
                'Mob Battle Loadout UPDATE Error:',
                error
            );

            const status =
                error.message === 'Loadout not found.'
                    ? 404
                    : 400;

            res.status(status).json({
                success: false,
                error: error.message
            });
        }
    });

    // ----------------------------------------
// SPAWN LOADOUT
// ----------------------------------------

app.post('/api/mob-battle/loadouts/:id/spawn', (req, res) => {

    try {

        const result =
            spawnMobBattleLoadout(
                req.params.id,
                req.body?.donorName || null,
                req.body?.team || null
            );


        res.json({
            success: true,
            message: 'Mob Battle loadout spawned successfully.',
            result
        });

    } catch (error) {

        console.error(
            'Mob Battle Loadout SPAWN Error:',
            error
        );


        const status =
            error.message.startsWith(
                'Loadout not found'
            ) ||
            error.message.startsWith(
                'Loadout is disabled'
            )
                ? 404
                : 400;


        res.status(status).json({
            success: false,
            error: error.message
        });
    }
});

    // ----------------------------------------
    // DELETE LOADOUT
    // ----------------------------------------

    app.delete('/api/mob-battle/loadouts/:id', (req, res) => {
        try {
            const loadout = deleteMobBattleLoadout(
                req.params.id
            );

            res.json({
                success: true,
                message: 'Loadout deleted successfully.',
                loadout
            });

        } catch (error) {
            console.error(
                'Mob Battle Loadout DELETE Error:',
                error
            );

            const status =
                error.message === 'Loadout not found.'
                    ? 404
                    : 400;

            res.status(status).json({
                success: false,
                error: error.message
            });
        }
    });


    // ========================================
    // READY
    // ========================================

    console.log(
        'Mob Battle Loadout Server: Ready.'
    );
}