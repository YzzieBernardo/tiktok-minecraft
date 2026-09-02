import { WebcastEvent } from 'tiktok-live-connector';

import { tiktok } from './connection.js';

import {
    isGiftChatFilterEnabled,
    broadcastToDashboard
} from '../core/server.js';

import {
    sendMinecraftChat
} from '../minecraft/lcon.js';


// ==========================================
// SETUP TIKTOK CHAT LISTENER
// ==========================================

export function setupChatListener() {

    console.log(
        'CHAT LISTENER: Registering TikTok CHAT event...'
    );


    // ==========================================
    // TIKTOK CHAT
    // ==========================================

    tiktok.on(
        WebcastEvent.CHAT,
        data => {

            // ==========================================
            // GET USERNAME
            // ==========================================

            const username =
                data.user?.uniqueId ||
                data.user?.displayId ||
                'Unknown';


            // ==========================================
            // GET MESSAGE
            // ==========================================

            const message =
                data.content ||
                data.comment ||
                data.text ||
                data.message ||
                '';

                const normalizedMessage =
    String(message)
        .replace(/\s+/g, ' ')
        .trim();


            // ==========================================
            // IGNORE EMPTY MESSAGE
            // ==========================================

            if (!message.trim()) {

                return;

            }


            console.log('');

            console.log(
                '=============================='
            );

            console.log(
                'TIKTOK CHAT'
            );

            console.log(
                `User: ${username}`
            );

            console.log(
                `Message: ${message}`
            );

            console.log(
                '=============================='
            );


            // ==========================================
            // GIFT + NUMBER FILTER
            // ==========================================

       const giftNumberPattern =
    /^\s*\*?\s*(?:z)?gift\s*\+?\s*\d+\s*$/i;


const isGiftNumberMessage =
    giftNumberPattern.test(normalizedMessage);


            if (
                isGiftChatFilterEnabled() &&
                isGiftNumberMessage
            ) {

                console.log(
                    `CHAT FILTERED: ${username}: ${message}`
                );

                return;

            }


            // ==========================================
            // SEND TO MINECRAFT CHAT
            // ==========================================

            sendMinecraftChat(
                `<${username}> ${message}`
            );


            // ==========================================
            // SEND TO DASHBOARD
            // ==========================================

            broadcastToDashboard({

                type: 'chat',

                user: username,

                message: message

            });

        }
    );

}