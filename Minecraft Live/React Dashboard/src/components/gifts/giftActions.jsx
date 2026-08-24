import { WebcastEvent } from 'tiktok-live-connector';
import { tiktok } from './connection.js';
import { giftList } from './giftList.js';
import {
    spawnMobForTeam,
    ensureTeamsExist
} from '../teams/teams.js';
import {
    onMinecraftMessage,
    sendCommand
} from '../minecraft/lcon.js';


// ==========================================
// SPAWN ONE GIFT
// ==========================================

export function triggerGift(
    giftId,
    donorName = 'Unknown'
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
    console.log(`Mobs: ${gift.mobs}`);
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
    console.log('==============================');


    // ==========================================
    // BALLISTIX BOMB
    // ==========================================

    if (gift.blast) {

        triggerBomb(gift);

        return;
    }


    // ==========================================
    // NORMAL ZOMBIES
    // ==========================================

    for (
        let i = 0;
        i < gift.zombie;
        i++
    ) {

        spawnMobForTeam(
            'zombie',
            gift.team
        );
    }


    // ==========================================
    // NORMAL SKELETONS
    // ==========================================

    for (
        let i = 0;
        i < gift.skeleton;
        i++
    ) {

        spawnMobForTeam(
            'skeleton',
            gift.team
        );
    }


    // ==========================================
    // NORMAL CREEPERS
    // ==========================================

    for (
        let i = 0;
        i < gift.creeper;
        i++
    ) {

        spawnMobForTeam(
            'creeper',
            gift.team
        );
    }


    // ==========================================
    // NORMAL ENDERMEN
    // ==========================================

    for (
        let i = 0;
        i < gift.enderman;
        i++
    ) {

        spawnMobForTeam(
            'enderman',
            gift.team
        );
    }


    // ==========================================
    // MUTANT CREEPERS
    // ==========================================

    for (
        let i = 0;
        i < gift.mutantCreepers;
        i++
    ) {

        spawnMobForTeam(
            'mutantmonsters:mutant_creeper',
            gift.team
        );
    }


    // ==========================================
    // MUTANT ZOMBIES
    // ==========================================

    for (
        let i = 0;
        i < gift.mutantZombies;
        i++
    ) {

        spawnMobForTeam(
            'mutantmonsters:mutant_zombie',
            gift.team
        );
    }


    // ==========================================
    // MUTANT ENDERMEN
    // ==========================================

    for (
        let i = 0;
        i < gift.mutantEndermen;
        i++
    ) {

        spawnMobForTeam(
            'mutantmonsters:mutant_enderman',
            gift.team
        );
    }


    // ==========================================
    // MUTANT SKELETONS
    // ==========================================

    for (
        let i = 0;
        i < gift.mutantSkeletons;
        i++
    ) {

        spawnMobForTeam(
            'mutantmonsters:mutant_skeleton',
            gift.team
        );
    }


    // ==========================================
    // OTHER MUTANTS
    // ==========================================

    // Wala pa tayong confirmed entity ID
    // para sa mutantOthers.
}


// ==========================================
// BALLISTIX BOMB
// ==========================================

function triggerBomb(bomb) {

    console.log('');
    console.log('==============================');
    console.log('BALLISTIX BOMB');
    console.log(`Bomb: ${bomb.name}`);
    console.log(`Blast: ${bomb.blast}`);
    console.log(`Fuse: ${bomb.fuse}`);
    console.log('Team: NEUTRAL');
    console.log('==============================');


    sendCommand(
        `summon ballistix:explosive ~ ~1 ~ ` +
        `{type:"ballistix:${bomb.blast}",Fuse:${bomb.fuse}}`
    );
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

        const match =
            message.match(/gift\s+(\d+)/i);


        if (!match) {

            return;
        }


        const giftId =
            Number(match[1]);


        console.log('');
        console.log('==============================');
        console.log('MINECRAFT TEST GIFT');
        console.log(`Gift ID: ${giftId}`);
        console.log('==============================');


        triggerGift(
            giftId,
            'Minecraft Test'
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

            console.log(
                `Mobs: ${gift.mobs}`
            );

            console.log(
                `Coins: ${gift.coins}`
            );


            console.log(
                `Mutants: ` +
                `Creeper ${gift.mutantCreepers}, ` +
                `Zombie ${gift.mutantZombies}, ` +
                `Enderman ${gift.mutantEndermen}, ` +
                `Skeleton ${gift.mutantSkeletons}, ` +
                `Other ${gift.mutantOthers}`
            );


            console.log(
                '=============================='
            );


            // ==========================================
            // TRIGGER GIFT
            // ==========================================

            triggerGift(
                data.giftId,
                username
            );
        }
    );
}