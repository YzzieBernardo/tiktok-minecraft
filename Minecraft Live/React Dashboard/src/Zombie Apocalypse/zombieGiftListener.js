// ==========================================
// ZOMBIE APOCALYPSE V2
// ZOMBIE GIFT LISTENER
// ==========================================
//
// Responsibilities:
// - Listen for TikTok gifts
// - Use the TikTok gift ID
// - Send the gift to Zombie Apocalypse processor
// - Allow Minecraft test command
// - Keep Zombie Apocalypse independent
//   from the existing gift system
// ==========================================

import { WebcastEvent } from 'tiktok-live-connector';

import {
    tiktok,
} from '../services/tiktok/connection.js';

import {
    processZombieGift,
} from './zombieSpawnProcessor.js';

import {
    registerZombieDeath,
} from './zombieSpawnManager.js';

import {
    onMinecraftMessage,
    sendCommand,
} from '../services/minecraft/lcon.js';

import {
    isZombieApocalypseRunning,
} from './zombieApocalypseServer.js';


// ==========================================
// SETUP LISTENER
// ==========================================

export function setupZombieGiftListener() {

    console.log(
        'Zombie Apocalypse V2: Gift listener starting...'
    );


    // ==========================================
    // MINECRAFT TEST GIFT COMMAND
    // ==========================================

    onMinecraftMessage(message => {

        console.log(
            'ZOMBIE GIFT LISTENER RECEIVED MESSAGE:',
            JSON.stringify(message)
        );


        let text =
            String(message || '').trim();

// Zombie death detection is performed
// after the Minecraft message has been cleaned.


        // ==========================================
        // REMOVE LCON STATUS CODE
        // ==========================================

            if (
                        text.startsWith('200:') ||
                        text.startsWith('201:')
                    ) {

                        text =
                            text.slice(4).trim();

                    }


        // ==========================================
        // DECODE JSON STRING
        // ==========================================

        try {

            if (
                text.startsWith('"') &&
                text.endsWith('"')
            ) {

                text =
                    JSON.parse(text);

            }

        } catch (error) {

            console.log(
                'Zombie Apocalypse V2: JSON decode skipped.'
            );

        }


        // ==========================================
        // REMOVE LCON LITERAL WRAPPER
        // ==========================================

        text =
            String(text || '').trim();


        if (
            text.startsWith('literal{') &&
            text.endsWith('}')
        ) {

            text =
                text.slice(8, -1);

        }


        // ==========================================
        // CLEAN ESCAPED CHARACTERS
        // ==========================================

       text =
            text
                .replace(/\\+</g, '<')
                .replace(/\\+>/g, '>')
                .trim();


        // ==========================================
        // FINAL TEXT
        // ==========================================

        console.log(
            `Zombie Apocalypse V2: Parsed Minecraft message: ${text}`
        );

// ==========================================
// DETECT ZOMBIE APOCALYPSE MOB DEATH
// ==========================================
//
// The datapack only sends this message when
// a Zombie Apocalypse tagged mob is killed.
//
// Example:
// ZOMBIE APOCALYPSE MOB KILLED
// ==========================================

const deathDetected =
    text.includes(
        'ZOMBIE APOCALYPSE MOB KILLED'
    );


if (deathDetected) {

    console.log(
        'Zombie Apocalypse V2: Zombie Apocalypse mob death detected.'
    );

    // ==========================================
    // REMOVE ONE ACTIVE MOB
    // ==========================================

    registerZombieDeath(1);

    return;

}

        // ==========================================
        // FIND ZOMBIE GIFT TEST COMMAND
        // ==========================================
        //
        // Example:
        //
        // <YzzieBoi> *zgift 5655
        //
        // ==========================================

const match =
    text.match(
        /<([^>]+)>\s+\*?zgift\s+(\d+)/i
    );


        if (!match) {

            return;

        }


        const donorName =
            match[1]?.trim() || 'Minecraft';


        const giftId =
            Number(match[2]);


        console.log(
            'Zombie Apocalypse V2: TEST COMMAND DETECTED'
        );

        console.log(
            `Donor: ${donorName}`
        );

        console.log(
            `Gift ID: ${giftId}`
        );


        // ==========================================
        // ZOMBIE APOCALYPSE ON / OFF
        // ==========================================

        if (!isZombieApocalypseRunning()) {

            console.log('');
            console.log('==============================');
            console.log('ZOMBIE APOCALYPSE V2');
            console.log('GIFT REJECTED');
            console.log(`Gift ID: ${giftId}`);
            console.log('Zombie Apocalypse: OFF');
            console.log('Please turn Zombie Apocalypse ON.');
            console.log('==============================');


            sendCommand(
                'say Please turn Zombie Apocalypse ON.'
            );


            return;

        }


        // ==========================================
        // PROCESS MINECRAFT TEST GIFT
        // ==========================================

        console.log('');
        console.log('==============================');
        console.log('ZOMBIE APOCALYPSE V2');
        console.log('MINECRAFT GIFT TEST');
        console.log(`Donor: ${donorName}`);
        console.log(`Gift ID: ${giftId}`);
        console.log('==============================');


        const result =
            processZombieGift(
                giftId,
                donorName,
                1
            );


        // ==========================================
        // RESULT
        // ==========================================

        if (!result?.success) {

            console.log(
                `Zombie Apocalypse V2: Minecraft Gift ${giftId} was ignored.`
            );

            return;

        }


        console.log(
            `Zombie Apocalypse V2: Minecraft Gift ${giftId} processed successfully.`
        );

    });


    // ==========================================
    // TIKTOK GIFTS
    // ==========================================

    tiktok.on(
        WebcastEvent.GIFT,
        data => {

            // ==========================================
            // GET TIKTOK GIFT ID
            // ==========================================

            const giftId =
                Number(data.giftId);


            // ==========================================
            // GET USERNAME
            // ==========================================

            const username =
                data.user?.uniqueId ||
                data.user?.displayId ||
                'Unknown';


            // ==========================================
            // GET QUANTITY
            // ==========================================

            const quantity =
                Math.max(
                    1,
                    Number(data.repeatCount ?? 1)
                );


            // ==========================================
            // LOG GIFT
            // ==========================================

            console.log('');
            console.log('==============================');
            console.log('ZOMBIE APOCALYPSE V2');
            console.log('TIKTOK GIFT DETECTED');
            console.log(`User: ${username}`);
            console.log(`Gift ID: ${giftId}`);
            console.log(`Quantity: ${quantity}`);
            console.log('==============================');


            // ==========================================
            // ZOMBIE APOCALYPSE ON / OFF
            // ==========================================

            if (!isZombieApocalypseRunning()) {

                console.log('');
                console.log('==============================');
                console.log('ZOMBIE APOCALYPSE V2');
                console.log('GIFT IGNORED');
                console.log(`Gift ID: ${giftId}`);
                console.log('Zombie Apocalypse: OFF');
                console.log('==============================');

                return;

            }


            // ==========================================
            // PROCESS GIFT
            // ==========================================

            const result =
                processZombieGift(
                    giftId,
                    username,
                    quantity
                );


            // ==========================================
            // RESULT
            // ==========================================

            if (!result?.success) {

                console.log(
                    `Zombie Apocalypse V2: Gift ${giftId} ignored.`
                );

                return;

            }


            console.log(
                'Zombie Apocalypse V2: Gift processed successfully.'
            );

        }
    );


    // ==========================================
    // LISTENER READY
    // ==========================================

    console.log(
        'Zombie Apocalypse V2: Gift listener ready.'
    );

}