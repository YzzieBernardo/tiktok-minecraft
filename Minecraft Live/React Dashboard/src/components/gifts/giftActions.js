import { WebcastEvent } from 'tiktok-live-connector';
import { tiktok } from '../../services/tiktok/connection.js';
import { giftList } from './GiftManager.js';

import {
    botState,
    broadcastToDashboard
} from '../../services/core/server.js';


import {
    spawnMobForTeam,
    ensureTeamsExist
} from '../../data/teams/teams.js';
import {
    onMinecraftMessage,
    sendCommand
} from '../../services/minecraft/lcon.js';

const mobTypes = [
    ['zombie', 'zombie'],
    ['skeleton', 'skeleton'],
    ['creeper', 'creeper'],
    ['enderman', 'enderman'],
    ['mutantCreepers', 'mutantmonsters:mutant_creeper'],
    ['mutantZombies', 'mutantmonsters:mutant_zombie'],
    ['mutantEndermen', 'mutantmonsters:mutant_enderman'],
    ['mutantSkeletons', 'mutantmonsters:mutant_skeleton'],
];

function spawnGiftMobs(gift) {
    for (const [countKey, mobType] of mobTypes) {
        for (let count = 0; count < (gift[countKey] ?? 0); count++) {
            spawnMobForTeam(mobType, gift.team);
        }
    }
}

// ==========================================
// SPAWN ONE GIFT
// ==========================================

export function triggerGift(
    giftId,
    donorName = 'Unknown',
    quantity = 1
) {

    const gift = giftList[Number(giftId)];

    if (!gift) {

        console.log(
            `Unknown gift ID: ${giftId}`
        );

        return;
    }


    console.log('');
    console.log('==============================');
    console.log('GIFT TRIGGERED');
    console.log(`Gift ID: ${giftId}`);
    console.log(`Gift: ${gift.name}`);
    console.log(`User: ${donorName}`);
    console.log(`Team: ${gift.team}`);
    const totalMobs =
        (gift.zombie ?? 0) +
        (gift.skeleton ?? 0) +
        (gift.creeper ?? 0) +
        (gift.enderman ?? 0) +
        (gift.mutantCreepers ?? 0) +
        (gift.mutantZombies ?? 0) +
        (gift.mutantEndermen ?? 0) +
        (gift.mutantSkeletons ?? 0) +
        (gift.mutantOthers ?? 0);

    console.log(`Mobs: ${totalMobs}`);
    console.log(
        `Mutant Creepers: ${gift.mutantCreepers}`
    );
    console.log(
        `Mutant Zombies: ${gift.mutantZombies}`
    );
    console.log(
        `Mutant Endermen: ${gift.mutantEndermen}`
    );
    console.log(
        `Mutant Skeletons: ${gift.mutantSkeletons}`
    );
    console.log(
        `Mutant Others: ${gift.mutantOthers}`
    );
    console.log(`Coins: ${gift.coins}`);
    console.log('==============================')

        // ==========================================
        // MINECRAFT CHAT MESSAGE
        // ==========================================

sendCommand(
    `say ${donorName} sent ${gift.name} | Team: ${gift.team} | Mobs: ${totalMobs} | Coins: ${gift.coins ?? 0}`
);


    // ==========================================
    // UPDATE GIFT STATS
    // ==========================================

        botState.stats.totalGifts++;

        broadcastToDashboard({
            type: 'gift',
            user: donorName,
            giftName: gift.name,
            giftId: giftId,
            team: gift.team,
            coins: gift.coins ?? 0,
            mobs: totalMobs
        });


    // ==========================================
    // BALLISTIX BOMB
    // ==========================================
        if (gift.blast) {
            triggerBomb(gift, gift.quantity);
            return;
        }


    spawnGiftMobs(gift);


    // ==========================================
    // OTHER MUTANTS
    // ==========================================

    // Wala pa tayong confirmed entity ID
    // para sa mutantOthers.
}


// ==========================================
// BALLISTIX BOMB
// ==========================================

function triggerBomb(bomb, quantity = 1) {
    const count = Math.max(1, Number(quantity) || 1);

    console.log('');
    console.log('==============================');
    console.log('BALLISTIX BOMB');
    console.log(`Bomb: ${bomb.name}`);
    console.log(`Blast: ${bomb.blast}`);
    console.log(`Fuse: ${bomb.fuse}`);
    console.log(`Quantity: ${count}`);
    console.log('Team: NEUTRAL');
    console.log('==============================');

    for (let i = 0; i < count; i++) {
        sendCommand(
            `summon ballistix:explosive ~ ~1 ~ ` +
            `{type:"ballistix:${bomb.blast}",Fuse:${bomb.fuse}}`
        );
    }
}


// ==========================================
// TIKTOK GIFT LISTENER
// ==========================================

export function setupGiftListener() {

    // ==========================================
    // CREATE TEAMS
    // ==========================================

    ensureTeamsExist();


    // ==========================================
    // MINECRAFT TEST GIFT
    //
    // Example:
    //
    // gift 5655
    // ==========================================

onMinecraftMessage(message => {

    const text = String(message || '').trim();

    // Only react to actual Minecraft chat messages.
    // LCon responses such as 200:"empty" are ignored.
    const match = text.match(/(?:<([^>]+)>\s*)?gift\s+(\d+)/i);

    if (!match) {
        return;
    }

    const donorName = match[1]?.trim() || 'Minecraft Player';
    const giftId = Number(match[2]);

    console.log('');
    console.log('==============================');
    console.log('MINECRAFT TEST GIFT');
    console.log(`Gift ID: ${giftId}`);
    console.log('==============================');

    triggerGift(
        giftId,
        donorName
    );
});


    // ==========================================
    // REAL TIKTOK GIFTS
    // ==========================================

    tiktok.on(
        WebcastEvent.GIFT,
        data => {

            const gift =
                giftList[data.giftId];


            const username =
                data.user?.uniqueId ||
                data.user?.displayId ||
                'Unknown';


            console.log('');
            console.log('==============================');
            console.log('TIKTOK GIFT DETECTED');
            console.log(`User: ${username}`);
            console.log(`Gift ID: ${data.giftId}`);


            // ==========================================
            // UNKNOWN GIFT
            // ==========================================

            if (!gift) {

                console.log(
                    'Unknown gift ' +
                    '(not in giftList) — ignoring.'
                );

                console.log(
                    '=============================='
                );

                return;
            }

            // ==========================================
            // GIFT INFORMATION
            // ==========================================

            console.log(
                `Matched: ${gift.name}`
            );

            console.log(
                `Team: ${gift.team}`
            );

        const zombieCount = gift.zombie ?? 0;
        const skeletonCount = gift.skeleton ?? 0;
        const creeperCount = gift.creeper ?? 0;
        const endermanCount = gift.enderman ?? 0;

        const mutantCreeperCount = gift.mutantCreepers ?? 0;
        const mutantZombieCount = gift.mutantZombies ?? 0;
        const mutantEndermanCount = gift.mutantEndermen ?? 0;
        const mutantSkeletonCount = gift.mutantSkeletons ?? 0;
        const mutantOtherCount = gift.mutantOthers ?? 0;

        const totalMobs =
            zombieCount +
            skeletonCount +
            creeperCount +
            endermanCount +
            mutantCreeperCount +
            mutantZombieCount +
            mutantEndermanCount +
            mutantSkeletonCount +
            mutantOtherCount;

        console.log(`Mobs: ${totalMobs}`);

        console.log(`  Zombies: ${zombieCount}`);
        console.log(`  Skeletons: ${skeletonCount}`);
        console.log(`  Creepers: ${creeperCount}`);
        console.log(`  Endermen: ${endermanCount}`);

        console.log(`  Mutant Creepers: ${mutantCreeperCount}`);
        console.log(`  Mutant Zombies: ${mutantZombieCount}`);
        console.log(`  Mutant Endermen: ${mutantEndermanCount}`);
        console.log(`  Mutant Skeletons: ${mutantSkeletonCount}`);
        console.log(`  Other Mutants: ${mutantOtherCount}`);

        console.log(
            `Coins: ${gift.coins}`
        );

        console.log(
            '=============================='
        );

            // ==========================================
            // TRIGGER GIFT
            // ==========================================

       triggerGift(
    data.giftId,
    username,
    Number(data.repeatCount ?? 1)
);
        }
    );
}
