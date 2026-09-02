//Minecraft Live/React Dashboard/src/Zombie Apocalypse/zombieGiftActions.js
// ==========================================
// ZOMBIE APOCALYPSE V2
// GIFT ACTIONS
// ==========================================
//
// Responsibilities:
// - Find Zombie Apocalypse gift rule
// - Process configured gift actions
// - Add zombies to the Zombie Apocalypse queue
// - Give configured Minecraft items
//
// IMPORTANT:
// This file does NOT modify Mob Battle.
// ==========================================

import {
    getZombieGiftRule,
} from './zombieGiftManager.js';

import {
    addZombieSpawn,
} from './zombieSpawnQueue.js';

import {
    sendCommand,
} from '../services/minecraft/lcon.js';


// ==========================================
// PROCESS GIFT
// ==========================================

export function processZombieApocalypseGift(
    giftId,
    donorName = 'Unknown',
    quantity = 1
) {

    const rule =
        getZombieGiftRule(giftId);


    // ==========================================
    // NO RULE
    // ==========================================

    if (!rule) {

        console.log(
            `Zombie Apocalypse V2: No rule for Gift ID ${giftId}.`
        );

        return {
            handled: false,
            reason: 'no_rule',
        };

    }


    // ==========================================
    // DISABLED
    // ==========================================

    if (!rule.enabled) {

        console.log(
            `Zombie Apocalypse V2: Gift ID ${giftId} is disabled.`
        );

        return {
            handled: false,
            reason: 'disabled',
        };

    }


    const repeatCount =
        Math.max(
            1,
            Number(quantity) || 1
        );


    const totalAmount =
        rule.amount *
        repeatCount;


    // ==========================================
    // LOG
    // ==========================================

    console.log('');
    console.log('==============================');
    console.log('ZOMBIE APOCALYPSE V2');
    console.log('GIFT ACTION');
    console.log(`Gift ID: ${rule.giftId}`);
    console.log(`Gift: ${rule.giftName}`);
    console.log(`Donor: ${donorName}`);
    console.log(`Action: ${rule.action}`);
    console.log(`Amount per gift: ${rule.amount}`);
    console.log(`Quantity: ${repeatCount}`);
    console.log(`Total amount: ${totalAmount}`);
    console.log('==============================');


    // ==========================================
    // SPAWN ZOMBIES
    // ==========================================

    if (rule.action === 'spawn_zombie') {

        const queueItem =
            addZombieSpawn(
                totalAmount,
                donorName,
                rule.giftId,
                rule.giftName
            );


        if (!queueItem) {

            return {
                handled: false,
                reason: 'invalid_amount',
            };

        }


        console.log(
            `Zombie Apocalypse V2: Added ${totalAmount} zombie(s) to queue.`
        );


        return {
            handled: true,
            action: 'spawn_zombie',
            amount: totalAmount,
            queueItem,
        };

    }


    // ==========================================
    // GIVE ITEM
    // ==========================================

    if (rule.action === 'give_item') {

        if (!rule.item) {

            console.log(
                'Zombie Apocalypse V2: No item configured.'
            );

            return {
                handled: false,
                reason: 'missing_item',
            };

        }


        const itemAmount =
            Math.max(
                1,
                Number(totalAmount) || 1
            );


        const command =
            `give @p ${rule.item} ${itemAmount}`;


        const sent =
            sendCommand(command);


        if (!sent) {

            console.log(
                'Zombie Apocalypse V2: Cannot give item. Minecraft disconnected.'
            );

            return {
                handled: false,
                reason: 'minecraft_disconnected',
            };

        }


        console.log(
            `Zombie Apocalypse V2: Gave ${itemAmount}x ${rule.item} to @p.`
        );


        return {
            handled: true,
            action: 'give_item',
            amount: itemAmount,
            item: rule.item,
        };

    }


    // ==========================================
    // UNKNOWN ACTION
    // ==========================================

    console.log(
        `Zombie Apocalypse V2: Unknown action "${rule.action}".`
    );


    return {
        handled: false,
        reason: 'unknown_action',
    };
}