//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\Zombie Apocalypse\zombieApocalypseServer.js
// ==========================================
// ZOMBIE APOCALYPSE V2 SERVER
// ==========================================
//
// React Dashboard API
//
// Responsibilities:
// - Zombie Apocalypse ON / OFF
// - Zombie spawn configuration
// - Active zombie status
// - Spawn queue status
// - Zombie Gift CRUD
// - Keep Zombie Apocalypse separate
//   from Mob Battle and GiftManager
// ==========================================

import {
    getZombieApocalypseConfig,
    setZombieApocalypseConfig,
} from './zombieApocalypseConfig.js';

import {
    getActiveZombieCount,
    getZombieSpawnLimit,
} from './zombieSpawnManager.js';

import {
    getQueuedZombieCount,
    getZombieSpawnQueue,
    clearZombieSpawnQueue,
} from './zombieSpawnQueue.js';

import {
    getZombieGiftRules,
    getZombieGiftRule,
    createZombieGiftRule,
    updateZombieGiftRule,
    deleteZombieGiftRule,
} from './zombieGiftManager.js';

// ==========================================
// ZOMBIE LIKE REWARDS
// ==========================================

import {
    getZombieLikeRewards,
    getZombieLikeReward,
    createZombieLikeReward,
    updateZombieLikeReward,
    deleteZombieLikeReward,
    setZombieLikeRewardEnabled,
} from './zombieLikeManager.js';


// ==========================================
// ZOMBIE FOLLOW REWARDS
// ==========================================

import {
    getZombieFollowRewards,
    getZombieFollowReward,
    createZombieFollowReward,
    updateZombieFollowReward,
    deleteZombieFollowReward,
    setZombieFollowRewardEnabled,
} from './zombieFollowManager.js';



// ==========================================
// STATE
// ==========================================

let zombieApocalypseRunning = false;


// ==========================================
// STATUS
// ==========================================

export function isZombieApocalypseRunning() {
    return zombieApocalypseRunning;
}


// ==========================================
// CONFIG
// ==========================================

function getConfig() {

    const config =
        getZombieApocalypseConfig();

    return {
        ...config,

        activeZombies:
            getActiveZombieCount(),

        queuedZombies:
            getQueuedZombieCount(),

        running:
            zombieApocalypseRunning,
    };
}


// ==========================================
// SET CONFIG
// ==========================================

function updateConfig(data = {}) {

    return setZombieApocalypseConfig({

        maxActiveZombies:
            data.maxActiveZombies,

        minSpawnDistance:
            data.minSpawnDistance ??
            data.minSpawnRange,

        maxSpawnDistance:
            data.maxSpawnDistance ??
            data.maxSpawnRange,

        zombiesPerBatch:
            data.zombiesPerBatch,

        spawnIntervalMs:
            data.spawnIntervalMs,

        maxPositionAttempts:
            data.maxPositionAttempts,

    });
}

// ==========================================
// VALIDATE GIFT
// ==========================================

function validateZombieGift(data = {}) {

  const id =
    Number(data.giftId);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {

        throw new Error(
            'TikTok Gift ID must be a positive whole number.'
        );

    }


  const name =
    String(data.giftName || '').trim();


    if (!name) {

        throw new Error(
            'Gift name is required.'
        );

    }


const rewardName =
    String(data.rewardName || '').trim();

if (!rewardName) {

    throw new Error(
        'Reward name is required.'
    );

}

const amount =
    Math.max(
        1,
        Number(data.amount) || 1
    );

const action =
    data.action === 'give_item'
        ? 'give_item'
        : 'spawn_mob';

return {

    id,

    name,

    action,

    rewardName,

    amount,

};
}


// ==========================================
// SETUP SERVER
// ==========================================

console.log('>>> ZOMBIE APOCALYPSE SERVER FILE LOADED <<<')

function formatZombieGiftForClient(gift) {

    if (!gift) {
        return null;
    }

return {
    id: gift.giftId,
    name: gift.giftName,
    action: gift.action,
    rewardName: gift.rewardName,
    amount: gift.amount,
    enabled: gift.enabled,
    createdAt: gift.createdAt,
    updatedAt: gift.updatedAt,
};
}
export function setupZombieApocalypseServer(app) {

    // ======================================
    // STATUS
    // ======================================

    app.get(
        '/api/zombie-apocalypse/status',
        (req, res) => {

            res.json({
                ok: true,

                ...getConfig(),

                spawnLimit:
                    getZombieSpawnLimit(),

                queue:
                    getZombieSpawnQueue(),

            });

        }
    );


    // ======================================
    // ON / OFF
    // ======================================

    app.post(
        '/api/zombie-apocalypse/toggle',
        (req, res) => {

            zombieApocalypseRunning =
                Boolean(req.body?.enabled);


            console.log(
                `Zombie Apocalypse: ${
                    zombieApocalypseRunning
                        ? 'ON'
                        : 'OFF'
                }`
            );


            res.json({

                ok: true,

                running:
                    zombieApocalypseRunning,

            });

        }
    );


    // ======================================
    // GET CONFIG
    // ======================================

    app.get(
        '/api/zombie-apocalypse/config',
        (req, res) => {

            res.json({

                ok: true,

                config:
                    getConfig(),

            });

        }
    );


    // ======================================
    // UPDATE CONFIG
    // ======================================

    app.put(
        '/api/zombie-apocalypse/config',
        (req, res) => {

            try {

                const config =
                    updateConfig(
                        req.body || {}
                    );


                res.json({

                    ok: true,

                    config: {

                        ...config,

                        activeZombies:
                            getActiveZombieCount(),

                        queuedZombies:
                            getQueuedZombieCount(),

                        running:
                            zombieApocalypseRunning,

                    },

                });

            } catch (error) {

                console.error(
                    'Zombie Apocalypse config error:',
                    error
                );


                res.status(400).json({

                    ok: false,

                    error:
                        error.message,

                });

            }

        }
    );


    // ======================================
    // GET ZOMBIE GIFTS
    // ======================================

 app.get(
    '/api/zombie-apocalypse/gifts',
    (req, res) => {

        res.json({

            ok: true,

      gifts:
getZombieGiftRules().map(
    gift =>
        formatZombieGiftForClient(gift)
),

        });

    }
);


    // ======================================
    // GET ONE ZOMBIE GIFT
    // ======================================

  app.get(
    '/api/zombie-apocalypse/gifts/:id',
    (req, res) => {

     const gift =
    getZombieGiftRule(
        Number(req.params.id)
    );

        if (!gift) {

            return res.status(404).json({

                ok: false,

                error:
                    'Zombie gift not found.',

            });

        }

        res.json({

            ok: true,

            gift:
    formatZombieGiftForClient(gift),

        });

    }
);

    // ======================================
    // CREATE ZOMBIE GIFT
    // ======================================

    app.post(
        '/api/zombie-apocalypse/gifts',
        (req, res) => {

            try {

                const gift =
                    validateZombieGift(
                        req.body
                    );


 const saved =
    createZombieGiftRule({

        giftId:
            gift.id,

        giftName:
            gift.name,

        action:
            gift.action,

        rewardName:
            gift.rewardName,

        amount:
            gift.amount,

        enabled:
            true,

    });

                res.json({

                    ok: true,

                    gift:
    formatZombieGiftForClient(saved),

                });

            } catch (error) {

                console.error(
                    'Zombie gift create error:',
                    error
                );


                res.status(400).json({

                    ok: false,

                    error:
                        error.message,

                });

            }

        }
    );


    // ======================================
    // UPDATE ZOMBIE GIFT
    // ======================================

    app.put(
        '/api/zombie-apocalypse/gifts/:id',
        (req, res) => {

            try {

                const id =
                    Number(req.params.id);


            const gift =
    validateZombieGift({

        ...req.body,

        giftId: id,

    });

              const existing =
                    getZombieGiftRule(id);


                if (!existing) {

                    return res.status(404).json({

                        ok: false,

                        error:
                            'Zombie gift not found.',

                    });

                }


const saved =
    updateZombieGiftRule(
        id,
        {
            giftName:
                gift.name,

            action:
                gift.action,

            rewardName:
                gift.rewardName,

            amount:
                gift.amount,
        }
    );

const responseGift =
    formatZombieGiftForClient(
        saved
    );

               res.json({

                    ok: true,

                    gift:
                        responseGift,

                });

            } catch (error) {

                console.error(
                    'Zombie gift update error:',
                    error
                );


                res.status(400).json({

                    ok: false,

                    error:
                        error.message,

                });

            }

        }
    );


    // ======================================
    // DELETE ZOMBIE GIFT
    // ======================================

    app.delete(
        '/api/zombie-apocalypse/gifts/:id',
        (req, res) => {
            const removed =
                deleteZombieGiftRule(
                    Number(req.params.id)
                );

            if (!removed) {

                return res.status(404).json({

                    ok: false,

                    error:
                        'Zombie gift not found.',

                });

            }


            res.json({

                ok: true,

            });

        }
    );


    // ======================================
    // QUEUE STATUS
    // ======================================

    app.get(
        '/api/zombie-apocalypse/queue',
        (req, res) => {

            res.json({

                ok: true,

                count:
                    getQueuedZombieCount(),

                queue:
                    getZombieSpawnQueue(),

            });

        }
    );

    // ======================================
// ZOMBIE LIKE REWARDS
// ======================================

// GET ALL LIKE REWARDS

app.get(
    '/api/zombie-apocalypse/like-rewards',
    (req, res) => {

        res.json({

            ok: true,

            rewards:
                getZombieLikeRewards(),

        });

    }
);


// GET ONE LIKE REWARD

app.get(
    '/api/zombie-apocalypse/like-rewards/:id',
    (req, res) => {

        const reward =
            getZombieLikeReward(
                Number(req.params.id)
            );


        if (!reward) {

            return res.status(404).json({

                ok: false,

                error:
                    'Zombie like reward not found.',

            });

        }


        res.json({

            ok: true,

            reward,

        });

    }
);


// CREATE LIKE REWARD

app.post(
    '/api/zombie-apocalypse/like-rewards',
    (req, res) => {

        try {

            const reward =
                createZombieLikeReward(
                    req.body || {}
                );


            res.json({

                ok: true,

                reward,

            });

        } catch (error) {

            console.error(
                'Zombie like reward create error:',
                error
            );


            res.status(400).json({

                ok: false,

                error:
                    error.message,

            });

        }

    }
);


// UPDATE LIKE REWARD

app.put(
    '/api/zombie-apocalypse/like-rewards/:id',
    (req, res) => {

        try {

            const reward =
                updateZombieLikeReward(
                    Number(req.params.id),
                    req.body || {}
                );


            if (!reward) {

                return res.status(404).json({

                    ok: false,

                    error:
                        'Zombie like reward not found.',

                });

            }


            res.json({

                ok: true,

                reward,

            });

        } catch (error) {

            console.error(
                'Zombie like reward update error:',
                error
            );


            res.status(400).json({

                ok: false,

                error:
                    error.message,

            });

        }

    }
);


// DELETE LIKE REWARD

app.delete(
    '/api/zombie-apocalypse/like-rewards/:id',
    (req, res) => {

        const removed =
            deleteZombieLikeReward(
                Number(req.params.id)
            );


        if (!removed) {

            return res.status(404).json({

                ok: false,

                error:
                    'Zombie like reward not found.',

            });

        }


        res.json({

            ok: true,

        });

    }
);


// ENABLE / DISABLE LIKE REWARD

app.put(
    '/api/zombie-apocalypse/like-rewards/:id/enabled',
    (req, res) => {

        const reward =
            setZombieLikeRewardEnabled(
                Number(req.params.id),
                req.body?.enabled
            );


        if (!reward) {

            return res.status(404).json({

                ok: false,

                error:
                    'Zombie like reward not found.',

            });

        }


        res.json({

            ok: true,

            reward,

        });

    }
);


// ======================================
// ZOMBIE FOLLOW REWARDS
// ======================================

// GET ALL FOLLOW REWARDS

app.get(
    '/api/zombie-apocalypse/follow-rewards',
    (req, res) => {

        res.json({

            ok: true,

            rewards:
                getZombieFollowRewards(),

        });

    }
);


// GET ONE FOLLOW REWARD

app.get(
    '/api/zombie-apocalypse/follow-rewards/:id',
    (req, res) => {

        const reward =
            getZombieFollowReward(
                Number(req.params.id)
            );


        if (!reward) {

            return res.status(404).json({

                ok: false,

                error:
                    'Zombie follow reward not found.',

            });

        }


        res.json({

            ok: true,

            reward,

        });

    }
);


// CREATE FOLLOW REWARD

app.post(
    '/api/zombie-apocalypse/follow-rewards',
    (req, res) => {

        try {

            const reward =
                createZombieFollowReward(
                    req.body || {}
                );


            res.json({

                ok: true,

                reward,

            });

        } catch (error) {

            console.error(
                'Zombie follow reward create error:',
                error
            );


            res.status(400).json({

                ok: false,

                error:
                    error.message,

            });

        }

    }
);


// UPDATE FOLLOW REWARD

app.put(
    '/api/zombie-apocalypse/follow-rewards/:id',
    (req, res) => {

        try {

            const reward =
                updateZombieFollowReward(
                    Number(req.params.id),
                    req.body || {}
                );


            if (!reward) {

                return res.status(404).json({

                    ok: false,

                    error:
                        'Zombie follow reward not found.',

                });

            }


            res.json({

                ok: true,

                reward,

            });

        } catch (error) {

            console.error(
                'Zombie follow reward update error:',
                error
            );


            res.status(400).json({

                ok: false,

                error:
                    error.message,

            });

        }

    }
);


// DELETE FOLLOW REWARD

app.delete(
    '/api/zombie-apocalypse/follow-rewards/:id',
    (req, res) => {

        const removed =
            deleteZombieFollowReward(
                Number(req.params.id)
            );


        if (!removed) {

            return res.status(404).json({

                ok: false,

                error:
                    'Zombie follow reward not found.',

            });

        }


        res.json({

            ok: true,

        });

    }
);


// ENABLE / DISABLE FOLLOW REWARD

app.put(
    '/api/zombie-apocalypse/follow-rewards/:id/enabled',
    (req, res) => {

        const reward =
            setZombieFollowRewardEnabled(
                Number(req.params.id),
                req.body?.enabled
            );


        if (!reward) {

            return res.status(404).json({

                ok: false,

                error:
                    'Zombie follow reward not found.',

            });

        }


        res.json({

            ok: true,

            reward,

        });

    }
);


    // ======================================
    // CLEAR QUEUE
    // ======================================

    app.post(
        '/api/zombie-apocalypse/queue/clear',
        (req, res) => {

            clearZombieSpawnQueue();


            res.json({

                ok: true,

                count:
                    getQueuedZombieCount(),

            });

        }
    );


    // ======================================
    // SERVER READY
    // ======================================

    console.log(
        'Zombie Apocalypse V2 API loaded.'
    );

}