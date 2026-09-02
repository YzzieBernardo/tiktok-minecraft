//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\Zombie Apocalypse\zombieSpawnProcessor.js

// ==========================================
// ZOMBIE APOCALYPSE V2
// ZOMBIE SPAWN PROCESSOR
// ==========================================
//
// Responsibilities:
// - Process the Zombie Apocalypse spawn queue
// - Spawn only while there is an available slot
// - Keep excess zombies in the queue
// - Release queued zombies when slots become available
// - ONLY for Zombie Apocalypse
// ==========================================

import {
    addZombieSpawn,
    getNextZombieSpawn,
    consumeZombieSpawn,
    getQueuedZombieCount,
} from './zombieSpawnQueue.js';

import {
    spawnMobs,
    canSpawnZombie,
    getActiveZombieCount,
    getZombieSpawnLimit,
} from './zombieSpawnManager.js';

import {
    getZombieGiftRule,
} from './zombieGiftManager.js';

import {
    sendCommand,
} from '../services/minecraft/lcon.js';


// ==========================================
// PROCESS GENERIC ZOMBIE REWARD
// ==========================================
//
// Used by:
// - Zombie Gifts
// - Zombie Likes
// - Zombie Follows
//
// rewardType:
// - mob
// - item
//
// rewardName:
// - Minecraft mob ID
// - Minecraft item ID
//
// amount:
// - Number of rewards to process
// ==========================================

export function processZombieReward(
    reward = {},
    donorName = 'Unknown'
) {

    // ==========================================
    // NORMALIZE SENDER NAME
    // ==========================================

    const senderName =
        String(donorName || '').trim() || 'Unknown';


    const rewardType =
        reward.rewardType === 'item'
            ? 'item'
            : 'mob';


    const rewardName =
        String(
            reward.rewardName || ''
        ).trim();


    const amount =
        Math.max(
            1,
            Number(reward.amount) || 1
        );


    // ==========================================
    // VALIDATE REWARD
    // ==========================================

    if (!rewardName) {

        console.log(
            'Zombie Apocalypse V2: Reward name is empty.'
        );

        return {
            success: false,
            reason: 'reward_name_empty',
        };

    }


    // ==========================================
    // LOG
    // ==========================================

    console.log('');
    console.log('==============================');
    console.log('ZOMBIE APOCALYPSE V2');
    console.log('REWARD PROCESSING');
    console.log(`Donor: ${senderName}`);
    console.log(`Reward Type: ${rewardType}`);
    console.log(`Reward: ${rewardName}`);
    console.log(`Amount: ${amount}`);
    console.log('==============================');


    // ==========================================
    // MOB REWARD
    // ==========================================

    if (rewardType === 'mob') {

        addZombieSpawn(
            amount,
            senderName,
            null,
            null,
            rewardName
        );


        const spawnedMobs =
            processZombieSpawnQueue();


        const mobName =
            rewardName.includes(':')
                ? rewardName.split(':').pop()
                : rewardName;


        const formattedMobName =
            mobName
                .replace(/_/g, ' ')
                .replace(/\b\w/g, letter =>
                    letter.toUpperCase()
                );


        const chatMessage =
            `${senderName} sent ${amount} ${formattedMobName}(s)!`;


        const chatSent =
            sendCommand(
                `say ${chatMessage}`
            );


        if (!chatSent) {

            console.log(
                'Zombie Apocalypse V2: Failed to send Minecraft chat message.'
            );

        }


        return {

            success: true,

            rewardType,

            rewardName,

            amount,

            spawnedMobs,

            itemsGiven: 0,

        };

    }


    // ==========================================
    // ITEM REWARD
    // ==========================================

    if (rewardType === 'item') {

        const command =
            `give @p ${rewardName} ${amount}`;


        console.log(
            `Zombie Apocalypse V2: Sending item command: ${command}`
        );


        const sent =
            sendCommand(command);


        if (!sent) {

            console.log(
                'Zombie Apocalypse V2: Failed to give item. Minecraft disconnected.'
            );

            return {

                success: false,

                reason:
                    'minecraft_disconnected',

            };

        }


        const itemName =
            rewardName.includes(':')
                ? rewardName.split(':').pop()
                : rewardName;


        const formattedItemName =
            itemName
                .replace(/_/g, ' ')
                .replace(/\b\w/g, letter =>
                    letter.toUpperCase()
                );


        const chatMessage =
            `${senderName} sent ${amount} ${formattedItemName}!`;


        sendCommand(
            `say ${chatMessage}`
        );


        console.log(
            `Zombie Apocalypse V2: Given ${amount}x ${rewardName}.`
        );


        return {

            success: true,

            rewardType,

            rewardName,

            amount,

            spawnedMobs: 0,

            itemsGiven: amount,

        };

    }

}


// ==========================================
// PROCESS ONE GIFT
// ==========================================

export function processZombieGift(
    giftId,
    donorName = 'Unknown',
    quantity = 1
) {

    // ==========================================
    // NORMALIZE SENDER NAME
    // ==========================================

    const senderName =
        String(donorName || '').trim() || 'Unknown';


    // ==========================================
    // GET GIFT CONFIGURATION
    // ==========================================

    const gift =
        getZombieGiftRule(giftId);


    if (!gift) {

        console.log(
            `Zombie Apocalypse V2: Gift ID ${giftId} is not configured.`
        );

        return {
            success: false,
            reason: 'gift_not_configured',
        };

    }


    // ==========================================
    // QUANTITY
    // ==========================================

    const count =
        Math.max(
            1,
            Number(quantity) || 1
        );


    // ==========================================
    // GIFT INFORMATION
    // ==========================================

    const displayGiftName =
        String(
            gift.name ||
            gift.giftName ||
            'Unknown Gift'
        ).trim();



    const coins =
        gift.coins ?? 0;


    // ==========================================
    // LOG
    // ==========================================

    console.log('');
    console.log('==============================');
    console.log('ZOMBIE APOCALYPSE V2');
    console.log('GIFT PROCESSED');
    console.log(`Gift ID: ${giftId}`);
    console.log(`Gift: ${displayGiftName}`);
    console.log(`Donor: ${senderName}`);
    console.log(`Quantity: ${count}`);
    console.log(`Action: ${gift.action}`);
    console.log(`Reward: ${gift.rewardName}`);
    console.log(`Amount: ${gift.amount}`);
    console.log(`CONFIGURED MOB ID: ${gift.mobId}`);
    console.log(`Coins: ${coins}`);
    console.log('==============================');


    // ==========================================
    // TOTAL REWARD AMOUNT
    // ==========================================

    const totalAmount =
        Math.max(
            1,
            Number(gift.amount) || 1
        ) * count;


    // ==========================================
    // SPAWN MOB
    // ==========================================

    let spawnedMobs = 0;


    if (
        gift.action === 'spawn_mob'
    ) {

        addZombieSpawn(
            totalAmount,
            senderName,
            giftId,
            displayGiftName,
            gift.mobId
        );


        spawnedMobs =
            processZombieSpawnQueue();


        console.log(
            `Zombie Apocalypse V2: Requested ${totalAmount} mob(s).`
        );


        console.log(
            `Zombie Apocalypse V2: Spawned immediately: ${spawnedMobs}`
        );


        console.log(
            `Zombie Apocalypse V2: Queued: ${getQueuedZombieCount()}`
        );

    }


    // ==========================================
    // GIVE ITEM
    // ==========================================

    let itemsGiven = 0;


    if (
        gift.action === 'give_item'
    ) {

        const item =
            String(
                gift.rewardName || ''
            ).trim();


        if (!item) {

            console.log(
                'Zombie Apocalypse V2: Item reward is empty.'
            );

        } else {

            itemsGiven =
                totalAmount;


            const command =
                `give @p ${item} ${itemsGiven}`;


            console.log(
                `Zombie Apocalypse V2: Sending item command: ${command}`
            );


            const sent =
                sendCommand(command);


            if (!sent) {

                console.log(
                    'Zombie Apocalypse V2: Failed to give item. Minecraft disconnected.'
                );

                return {
                    success: false,
                    reason: 'minecraft_disconnected',
                };

            }


            console.log(
                `Zombie Apocalypse V2: Given ${itemsGiven}x ${item}.`
            );

        }

    }


    // ==========================================
    // MINECRAFT CHAT
    // ==========================================

    let chatMessage = '';


    // ==========================================
    // MOB CHAT
    // ==========================================

    if (
        gift.action === 'spawn_mob'
    ) {

       const mobId =
    String(
        gift.mobId || ''
    ).trim();

    if (!mobId) {

    console.log(
        `Zombie Apocalypse V2: No mobId configured for gift ${displayGiftName}.`
    );

    return {
        success: false,
        reason: 'mob_id_empty',
    };

}


        const mobName =
            mobId.includes(':')
                ? mobId.split(':').pop()
                : mobId;


        const formattedMobName =
            mobName
                .replace(/_/g, ' ')
                .replace(/\b\w/g, letter =>
                    letter.toUpperCase()
                );

chatMessage =
    `${senderName} sent ${displayGiftName} | Mobs: ${totalAmount} | Coins: ${coins} | Mob: ${formattedMobName}`;

    }


    // ==========================================
    // ITEM CHAT
    // ==========================================

    if (
        gift.action === 'give_item'
    ) {

        const item =
            String(
                gift.rewardName || ''
            ).trim();


        if (item) {

            const itemName =
                item.includes(':')
                    ? item.split(':').pop()
                    : item;


            const formattedItemName =
                itemName
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, letter =>
                        letter.toUpperCase()
                    );


           chatMessage =
    `${senderName} sent ${displayGiftName} | Mobs: 0 | Coins: ${coins} | Item: ${formattedItemName}`;

        }

    }


    // ==========================================
    // SEND CHAT
    // ==========================================

    if (chatMessage) {

        const chatSent =
            sendCommand(
                `say ${chatMessage}`
            );


        if (!chatSent) {

            console.log(
                'Zombie Apocalypse V2: Failed to send Minecraft chat message.'
            );

        } else {

            console.log(
                `Zombie Apocalypse V2: Minecraft chat sent: ${chatMessage}`
            );

        }

    }


    // ==========================================
    // RESULT
    // ==========================================

    return {

        success: true,

        giftId,

        giftName:
            displayGiftName,

        donorName:
            senderName,

        quantity:
            count,

        action:
            gift.action,

        rewardName:
            gift.rewardName,

        amount:
            totalAmount,

        spawnedMobs,

        itemsGiven,

    };

}


// ==========================================
// PROCESS QUEUE
// ==========================================

export function processZombieSpawnQueue() {

    let spawnedTotal = 0;


    while (
        getQueuedZombieCount() > 0 &&
        canSpawnZombie()
    ) {

        const queueItem =
            getNextZombieSpawn();


        if (!queueItem) {
            break;
        }


        const availableAmount =
            Math.min(
                queueItem.amount,
                getAvailableZombieSlots()
            );


        if (availableAmount <= 0) {
            break;
        }


const spawned =
    spawnMobs(
        queueItem.mobId,
        availableAmount,
        queueItem.donorName
    );


        if (spawned <= 0) {
            break;
        }


        consumeZombieSpawn(
            spawned
        );


        spawnedTotal += spawned;


        console.log(
            `Zombie Apocalypse V2: Queue spawned ${spawned} mob(s).`
        );


        console.log(
            `Zombie Apocalypse V2: Mob: ${queueItem.mobId}`
        );

    }


    if (spawnedTotal > 0) {

        console.log(
            `Zombie Apocalypse V2: Queue remaining = ${getQueuedZombieCount()}`
        );

    }


    return spawnedTotal;

}


// ==========================================
// AVAILABLE SLOTS
// ==========================================

export function getAvailableZombieSlots() {

    const queueLimit =
        getZombieSpawnLimit();


    const active =
        getActiveZombieCount();


    return Math.max(
        0,
        queueLimit - active
    );

}


// ==========================================
// PROCESS WHEN ZOMBIE DIES
// ==========================================
//
// Call this after registerZombieDeath().
// It immediately checks whether queued
// zombies can now spawn.
// ==========================================

export function processZombieQueueAfterDeath() {

    console.log(
        'Zombie Apocalypse V2: Zombie death detected. Processing queue...'
    );


    return processZombieSpawnQueue();

}