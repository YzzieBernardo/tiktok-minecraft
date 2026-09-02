//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\Zombie Apocalypse\zombieSpawnQueue.js

// ==========================================
// ZOMBIE APOCALYPSE V2
// ZOMBIE SPAWN QUEUE
// ==========================================

let spawnQueue = [];

let nextQueueId = 1;


// ==========================================
// ADD TO QUEUE
// ==========================================

export function addZombieSpawn(
    amount,
    donorName = 'Unknown',
    giftId = null,
    giftName = 'Unknown Gift',
    mobId = ''
) {
    const count =
        Math.max(
            0,
            Number(amount) || 0
        );

    if (count <= 0) {
        return null;
    }

    const normalizedMobId =
    String(mobId || '').trim();

if (!normalizedMobId) {

    console.log(
        'Zombie Apocalypse V2: Mob ID is required for queue.'
    );

    return null;
}


const queueItem = {

    id: nextQueueId++,

    amount: count,

      mobId:
    normalizedMobId,

    donorName,

    giftId,

    giftName,

    createdAt:
        Date.now(),

};


    spawnQueue.push(queueItem);


    console.log('');
    console.log('==============================');
    console.log('ZOMBIE APOCALYPSE V2');
    console.log('ZOMBIE ADDED TO QUEUE');
    console.log(`Queue ID: ${queueItem.id}`);
    console.log(`Donor: ${donorName}`);
    console.log(`Gift: ${giftName}`);
    console.log(`Amount: ${count}`);
    console.log(`Mob: ${queueItem.mobId}`);
    console.log(`Queue Size: ${getQueuedZombieCount()}`);
    console.log('==============================');


    return queueItem;
}


// ==========================================
// GET FIRST QUEUE ITEM
// ==========================================

export function getNextZombieSpawn() {

    if (spawnQueue.length === 0) {
        return null;
    }


    return spawnQueue[0];
}


// ==========================================
// REMOVE ZOMBIES FROM FIRST QUEUE ITEM
// ==========================================

export function consumeZombieSpawn(amount) {

    let remaining =
        Math.max(
            0,
            Number(amount) || 0
        );


    if (remaining <= 0) {
        return [];
    }


    const releasedItems = [];


    while (
        remaining > 0 &&
        spawnQueue.length > 0
    ) {

        const item =
            spawnQueue[0];


        const spawnAmount =
            Math.min(
                remaining,
                item.amount
            );


        const releasedItem = {

            ...item,

            amount: spawnAmount,

        };


        releasedItems.push(
            releasedItem
        );


        item.amount -=
            spawnAmount;


        remaining -=
            spawnAmount;


        if (item.amount <= 0) {

            spawnQueue.shift();

        }

    }


    return releasedItems;
}


// ==========================================
// GET QUEUED ZOMBIE COUNT
// ==========================================

export function getQueuedZombieCount() {

    return spawnQueue.reduce(
        (total, item) =>
            total + item.amount,
        0
    );

}


// ==========================================
// GET QUEUE
// ==========================================

export function getZombieSpawnQueue() {

    return spawnQueue.map(
        item => ({
            ...item,
        })
    );

}


// ==========================================
// GET QUEUE LENGTH
// ==========================================

export function getZombieQueueLength() {

    return spawnQueue.length;

}


// ==========================================
// CLEAR QUEUE
// ==========================================

export function clearZombieSpawnQueue() {

    spawnQueue = [];

    console.log(
        'Zombie Apocalypse V2: Spawn queue cleared.'
    );

}


// ==========================================
// REMOVE SPECIFIC QUEUE ITEM
// ==========================================

export function removeZombieQueueItem(
    queueId
) {

    const index =
        spawnQueue.findIndex(
            item =>
                item.id ===
                Number(queueId)
        );


    if (index === -1) {
        return false;
    }


    spawnQueue.splice(
        index,
        1
    );


    return true;

}