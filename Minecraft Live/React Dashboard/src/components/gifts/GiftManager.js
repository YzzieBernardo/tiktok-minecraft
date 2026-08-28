import { zombieGiftListA } from '../../data/gifts/teamA/zombieGiftList.js';
import { mutantGiftListA } from '../../data/gifts/teamA/mutantGiftList.js';

import { zombieGiftListB } from '../../data/gifts/teamB/zombieGiftList.js';
import { mutantGiftListB } from '../../data/gifts/teamB/mutantGiftList.js';
import { bombList } from '../../data/gifts/Bomblist.js';

// ==========================================
// MERGE TEAM GIFTS
// ==========================================

function mergeTeamGifts(
    zombieList,
    mutantList,
    team
) {
    const merged = {};

    const ids = new Set([
        ...Object.keys(zombieList),
        ...Object.keys(mutantList)
    ]);

    for (const id of ids) {

        const zombieGift = zombieList[id] || {};
        const mutantGift = mutantList[id] || {};

        merged[id] = {
            ...zombieGift,
            ...mutantGift,

            // Keep zombie data
            mobs: zombieGift.mobs ?? 0,

            // Keep mutant data
            mutantCreepers: mutantGift.mutantCreepers ?? 0,
            mutantZombies: mutantGift.mutantZombies ?? 0,
            mutantEndermen: mutantGift.mutantEndermen ?? 0,
            mutantSkeletons: mutantGift.mutantSkeletons ?? 0,
            mutantOthers: mutantGift.mutantOthers ?? 0,

            // Team
            team
        };
    }

    return merged;
}


// ==========================================
// FINAL GIFT LIST
// ==========================================

export const giftList = {

    // TEAM A
    ...mergeTeamGifts(
        zombieGiftListA,
        mutantGiftListA,
        'A'
    ),

    // TEAM B
    ...mergeTeamGifts(
        zombieGiftListB,
        mutantGiftListB,
        'B'
    ),

    // BOMBS = NEUTRAL
    ...bombList
};