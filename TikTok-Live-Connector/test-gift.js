import WebSocket from 'ws';
import { TikTokLiveConnection, WebcastEvent } from 'tiktok-live-connector';

// ===============================
// MINECRAFT LCON
// ===============================

const ws = new WebSocket('ws://localhost:8115');

ws.on('open', () => {
    console.log('Connected to LCon!');
});

ws.on('message', data => {
    console.log('Minecraft:', data.toString());
});

ws.on('error', error => {
    console.error('LCon error:', error.message);
});

ws.on('close', () => {
    console.log('LCon connection closed.');
});


// ===============================
// TEST SPAWN
// ===============================

function spawnZombie() {
    if (ws.readyState !== WebSocket.OPEN) {
        console.log('LCon is not connected.');
        return;
    }

    ws.send('[server]summon minecraft:zombie ~ ~ ~');

    console.log('TEST: Zombie spawned!');
}


// ===============================
// TIKTOK LIVE
// ===============================

const tiktokUsername = 'zaaaayiiii';

const tiktok = new TikTokLiveConnection(tiktokUsername);


// ===============================
// TIKTOK CONNECTION
// ===============================

tiktok.connect()
    .then(state => {
        console.log(
            `Connected to TikTok LIVE! Room ID: ${state.roomId}`
        );

        console.log('Waiting for gifts...');
    })
    .catch(error => {
        console.error('TikTok connection error:', error);
    });


// ===============================
// GIFT EVENT
// ===============================

tiktok.on(WebcastEvent.GIFT, data => {

    console.log('');
    console.log('==============================');
    console.log('GIFT RECEIVED');
    console.log('User:', data.user?.uniqueId);
    console.log('Gift ID:', data.giftId);
    console.log('==============================');

    spawnZombie();
});