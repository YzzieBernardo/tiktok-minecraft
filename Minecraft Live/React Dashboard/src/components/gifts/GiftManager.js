
//E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\components\gifts\GiftManager.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zombieGiftListA } from '../../data/gifts/teamA/zombieGiftList.js';
import { mutantGiftListA } from '../../data/gifts/teamA/mutantGiftList.js';
import { zombieGiftListB } from '../../data/gifts/teamB/zombieGiftList.js';
import { mutantGiftListB } from '../../data/gifts/teamB/mutantGiftList.js';
import { bombList } from '../../data/gifts/Bomblist.js';

const customGiftsPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../data/gifts/customGifts.json',
);

function mergeTeamGifts(zombieList, mutantList, team) {
    const merged = {};
    const ids = new Set([...Object.keys(zombieList), ...Object.keys(mutantList)]);

    for (const id of ids) {
        const zombieGift = zombieList[id] || {};
        const mutantGift = mutantList[id] || {};

        merged[id] = {
            ...zombieGift,
            ...mutantGift,
            mutantCreepers: mutantGift.mutantCreepers ?? 0,
            mutantZombies: mutantGift.mutantZombies ?? 0,
            mutantEndermen: mutantGift.mutantEndermen ?? 0,
            mutantSkeletons: mutantGift.mutantSkeletons ?? 0,
            mutantOthers: mutantGift.mutantOthers ?? 0,
            team,
        };
    }

    return merged;
}

const builtInGiftList = {
    ...mergeTeamGifts(zombieGiftListA, mutantGiftListA, 'A'),
    ...mergeTeamGifts(zombieGiftListB, mutantGiftListB, 'B'),
    ...bombList,
};

function readCustomGifts() {
    try {
        return JSON.parse(fs.readFileSync(customGiftsPath, 'utf8'));
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error('Could not read custom gifts:', error.message);
        }

        return { gifts: {}, deletedIds: [] };
    }
}

let customGifts = readCustomGifts();

export const giftList = { ...builtInGiftList, ...customGifts.gifts };

for (const id of customGifts.deletedIds) {
    delete giftList[id];
}

function saveCustomGifts() {
    fs.writeFileSync(customGiftsPath, `${JSON.stringify(customGifts, null, 2)}\n`);
}

export function listGifts() {
    return Object.entries(giftList).map(([id, gift]) => ({ id: Number(id), ...gift }));
}

export function saveGift(id, gift) {
    const key = String(id);

    customGifts.gifts[key] = gift;
    customGifts.deletedIds = customGifts.deletedIds.filter(deletedId => deletedId !== key);
    giftList[key] = gift;
    saveCustomGifts();

    return { id: Number(key), ...gift };
}

export function removeGift(id) {
    const key = String(id);

    if (!giftList[key]) {
        return false;
    }

    delete customGifts.gifts[key];
    delete giftList[key];

    if (builtInGiftList[key] && !customGifts.deletedIds.includes(key)) {
        customGifts.deletedIds.push(key);
    }

    saveCustomGifts();
    return true;
}
