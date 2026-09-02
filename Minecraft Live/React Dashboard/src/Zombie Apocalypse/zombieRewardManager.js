// ==========================================
// ZOMBIE APOCALYPSE V2
// REWARD MANAGER
// ==========================================
//
// Responsibilities:
// - Give Minecraft items
// - Validate item ID
// - Handle item amount
// - Keep item rewards separate
//   from mob spawning
// ==========================================

import {
    sendCommand,
} from '../services/minecraft/lcon.js';


// ==========================================
// GIVE ITEM
// ==========================================

export function giveItem(
    itemId = 'minecraft:diamond',
    amount = 1
) {

    // ======================================
    // VALIDATE ITEM ID
    // ======================================

    const item =
        String(itemId || '').trim();

    if (!item) {

        console.log(
            'Zombie Apocalypse V2: Item ID is required.'
        );

        return false;

    }


    // ======================================
    // VALIDATE AMOUNT
    // ======================================

    const count =
        Math.max(
            1,
            Number(amount) || 1
        );


    // ======================================
    // GIVE COMMAND
    // ======================================

    const command =
        `give @p ${item} ${count}`;


    const sent =
        sendCommand(command);


    // ======================================
    // MINECRAFT DISCONNECTED
    // ======================================

    if (!sent) {

        console.log(
            `Zombie Apocalypse V2: Cannot give ${item}. Minecraft disconnected.`
        );

        return false;

    }


    // ======================================
    // LOG
    // ======================================

    console.log('');

    console.log(
        '=============================='
    );

    console.log(
        'ZOMBIE APOCALYPSE V2'
    );

    console.log(
        'ITEM REWARD GIVEN'
    );

    console.log(
        `Item: ${item}`
    );

    console.log(
        `Amount: ${count}`
    );

    console.log(
        '=============================='
    );


    return true;
}


// ==========================================
// GIVE MULTIPLE ITEMS
// ==========================================

export function giveItems(
    itemId = 'minecraft:diamond',
    amount = 1
) {

    return giveItem(
        itemId,
        amount
    );

}