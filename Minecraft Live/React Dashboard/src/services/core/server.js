// ==========================================
// E:\tiktok-minecraft\Minecraft Live\React Dashboard\src\services\core\server.js
// ==========================================
// Web server para ma-connect ang React
// dashboard sa iyong bot.
// ==========================================

import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

import { connectTikTok } from '../tiktok/connection.js';
import { setupGiftListener } from '../../components/gifts/giftActions.js';
import { listGifts, removeGift, saveGift } from '../../components/gifts/GiftManager.js';
import { setupSocialListener } from '../../components/tiktok/social.js';
import { setupChatListener } from '../../services/tiktok/chat.js';


import {
    connectMinecraft,
    disconnectMinecraft,
    isMinecraftConnected,
    onMinecraftEvent,
    onMinecraftStatus,
    sendCommand
} from '../minecraft/lcon.js';

import { setupZombieApocalypseServer } from '../../Zombie Apocalypse/zombieApocalypseServer.js';
import { setupZombieGiftListener } from '../../Zombie Apocalypse/zombieGiftListener.js';
import { setupZombieFollowListener } from '../../Zombie Apocalypse/zombieFollowListener.js';
import { setupZombieLikeListener } from '../../Zombie Apocalypse/zombieLikeListener.js';

import {
    setupMobBattleServer,
    isMobBattleRunning
} from './mobBattleServer.js';
import { setupMobBattleLoadoutServer } from './mobBattleLoadoutServer.js';
import { ensureMobBattleCatalogs } from './mobBattleCatalog.js';
// ==========================================
// APP SETUP
// ==========================================

const app = express();

app.use(cors());
app.use(express.json());

setupZombieApocalypseServer(app);
setupMobBattleServer(app);
setupMobBattleLoadoutServer(app);
ensureMobBattleCatalogs();


// ==========================================
// BOT STATE
// ==========================================

export const botState = {   

    tiktok: {
        connected: false,
        username: 'zaaaayiiii',
        roomId: null,
    },

    minecraft: {
        connected: false,
    },

    stats: {
        totalLikes: 0,
        totalFollows: 0,
        totalGifts: 0,
    }
};


// ==========================================
// BOT CONTROL STATE
// ==========================================

let botRunning = false;
let botStarting = false;
let listenersRegistered = false;


// ==========================================
// TIKTOK CHAT → MINECRAFT
// ==========================================

let giftChatFilter = false;

export function isGiftChatFilterEnabled() {
    return giftChatFilter;
}

export function setGiftChatFilter(enabled) {
    giftChatFilter = Boolean(enabled);

    broadcastToDashboard({
        type: 'gift_chat_filter',
        enabled: giftChatFilter
    });
}


// ==========================================
// DASHBOARD CLIENTS
// ==========================================

const dashboardClients = new Set();


// ==========================================
// MINECRAFT STATUS
// ==========================================

onMinecraftStatus((connected) => {

    console.log(
        `Dashboard: Minecraft status = ${connected ? 'CONNECTED' : 'DISCONNECTED'}`
    );

    botState.minecraft.connected = connected;

    broadcastToDashboard({
        type: connected
            ? 'minecraft_connected'
            : 'minecraft_disconnected'
    });

});


// ==========================================
// MINECRAFT EVENTS
// ==========================================

onMinecraftEvent((message, type) => {

    broadcastToDashboard({
        type: 'minecraft_log',
        message,
        logType: type
    });

});


// ==========================================
// BROADCAST TO DASHBOARD
// ==========================================

export function broadcastToDashboard(data) {

    const message = JSON.stringify(data);

    for (const client of dashboardClients) {

        if (client.readyState === 1) {
            client.send(message);
        }

    }

}


const mobCountFields = [
    'zombie', 'skeleton', 'creeper', 'enderman', 'mutantCreepers',
    'mutantZombies', 'mutantEndermen', 'mutantSkeletons', 'mutantOthers',
];

function toNonNegativeNumber(value) {
    return Math.max(0, Number(value) || 0);
}

function parseGift(id, data) {
    const giftId = Number(id);

    if (!Number.isInteger(giftId) || giftId <= 0) {
        throw new Error('TikTok Gift ID must be a positive whole number');
    }

    const name = String(data.name || '').trim();

    if (!name) {
        throw new Error('Gift name is required');
    }

    const gift = { name, coins: toNonNegativeNumber(data.coins) };
if (data.kind === 'bomb') {
    const blast = String(data.blast || '').trim();

    if (!blast) {
        throw new Error('Bomb blast type is required');
    }

    return {
        id: giftId,
        gift: {
            ...gift,
            blast,
            fuse: toNonNegativeNumber(data.fuse),
            quantity: Math.max(1, Number(data.quantity) || 1),
        },
    };
}

    if (!['A', 'B'].includes(data.team)) {
        throw new Error('Choose Red Team or Blue Team');
    }

    gift.team = data.team;

    for (const field of mobCountFields) {
        gift[field] = toNonNegativeNumber(data[field]);
    }

    return { id: giftId, gift };
}

// ==========================================
// GET STATUS
// ==========================================

app.get('/api/status', (req, res) => {

    res.json(botState);

});

// ==========================================
// GIFT LIST MANAGEMENT
// ==========================================

app.get('/api/gifts', (req, res) => {
    res.json(listGifts());
});

function saveGiftRoute(req, res) {
    try {
        const { id, gift } = parseGift(req.params.id || req.body.id, req.body);
        res.json({ ok: true, gift: saveGift(id, gift) });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
}

app.post('/api/gifts', saveGiftRoute);
app.put('/api/gifts/:id', saveGiftRoute);

app.delete('/api/gifts/:id', (req, res) => {
    if (!removeGift(req.params.id)) {
        return res.status(404).json({ ok: false, error: 'Gift not found' });
    }

    res.json({ ok: true });
});


// ==========================================
// GIFT CHAT FILTER SETTING
// ==========================================

app.post('/api/settings/gift-chat-filter', (req, res) => {

    const { enabled } = req.body;

    setGiftChatFilter(enabled);

    console.log(
        `Gift Chat Filter: ${
            giftChatFilter ? 'ON' : 'OFF'
        }`
    );

    res.json({
        ok: true,
        enabled: giftChatFilter
    });

});

// ==========================================
// BOT STATUS
// ==========================================

app.get('/api/bot/status', (req, res) => {

    res.json({
        running: botRunning
    });

});


// ==========================================
// START BOT
// ==========================================

app.post('/api/bot/start', async (req, res) => {

    if (botRunning || botStarting) {

        return res.json({
            running: true,
            message: 'Bot is already running or starting.'
        });

    }

    botStarting = true;

    try {

        console.log('==========================================');
        console.log('Starting bot from React dashboard...');
        console.log('==========================================');

            // ------------------------------------------
            // START LISTENERS ONCE
            // ------------------------------------------

       if (!listenersRegistered) {

    console.log(
        'Registering TikTok and Minecraft listeners...'
    );

    try {

        setupGiftListener();

        console.log(
            'Gift listener started.'
        );


        setupZombieGiftListener();

        console.log(
            'Zombie Apocalypse gift listener started.'
        );


        setupZombieFollowListener();

        console.log(
            'Zombie Apocalypse follow listener started.'
        );


        setupZombieLikeListener();

        console.log(
            'Zombie Apocalypse like listener started.'
        );


        setupSocialListener();

        console.log(
            'Social listener started.'
        );


        setupChatListener();

        console.log(
            'Chat listener started.'
        );


        // ==========================================
        // ONLY MARK REGISTERED AFTER EVERYTHING
        // SUCCEEDS
        // ==========================================

        listenersRegistered = true;

        console.log(
            'All listeners registered successfully.'
        );

    } catch (error) {

        console.error(
            'Listener registration failed:',
            error
        );

        listenersRegistered = false;

        throw error;
    }

}
        // ------------------------------------------
        // CONNECT TIKTOK
        // ------------------------------------------

        await connectTikTok();

        console.log('TikTok connection started.');


        // ------------------------------------------
        // BOT RUNNING
        // ------------------------------------------

        botRunning = true;

        broadcastToDashboard({
            type: 'bot_status',
            running: true
        });

        res.json({
            running: true,
            message: 'Bot started.'
        });

    } catch (error) {

        console.error(
            'Bot start error:',
            error
        );

        botRunning = false;

        res.status(500).json({
            running: false,
            error: error.message
        });

    } finally {

        botStarting = false;

    }

});


// ==========================================
// STOP BOT
// ==========================================

app.post('/api/bot/stop', async (req, res) => {

    console.log('Stopping bot from React dashboard...');

    botRunning = false;

    botState.tiktok.connected = false;
    botState.tiktok.roomId = null;

    broadcastToDashboard({
        type: 'bot_status',
        running: false
    });

    broadcastToDashboard({
        type: 'tiktok_disconnected'
    });

    res.json({
        running: false,
        message: 'Bot stopped.'
    });

});


// ==========================================
// MINECRAFT LCON STATUS
// ==========================================

app.get('/api/minecraft/status', (req, res) => {

    res.json({
        connected: isMinecraftConnected()
    });

});


// ==========================================
// MINECRAFT CONNECT
// ==========================================

app.post('/api/minecraft/connect', (req, res) => {

    connectMinecraft();

    res.json({
        connected: isMinecraftConnected()
    });

});


// ==========================================
// MINECRAFT DISCONNECT
// ==========================================

app.post('/api/minecraft/disconnect', (req, res) => {

    disconnectMinecraft();

    res.json({
        connected: isMinecraftConnected()
    });

});


// ==========================================
// ROUTE: POST /api/command
// ==========================================
// React sends Minecraft commands here.
// Body: { "command": "say Hello" }
// ==========================================

let minecraftCommandHandler = sendCommand;

export function onDashboardCommand(handler) {

    minecraftCommandHandler = handler;

}


app.post('/api/command', (req, res) => {

    const { command } = req.body;

    if (!command) {

        return res.status(400).json({
            ok: false,
            error: 'No command'
        });

    }

    if (!isMinecraftConnected()) {

        return res.status(503).json({
            ok: false,
            error: 'Minecraft LCon is disconnected'
        });

    }

    const success = minecraftCommandHandler(command);

    if (!success) {

        return res.status(503).json({
            ok: false,
            error: 'Failed to send command to Minecraft'
        });

    }

    console.log(
        `Dashboard command sent to Minecraft: ${command}`
    );

    res.json({
        ok: true,
        command
    });

});


// ==========================================
// WEBSOCKET — LIVE UPDATES TO REACT
// ==========================================

const httpServer = createServer(app);

const wss = new WebSocketServer({
    server: httpServer
});


wss.on('connection', (ws) => {

    dashboardClients.add(ws);

    console.log(
        'Dashboard: Browser connected.'
    );


    // ------------------------------------------
    // SEND CURRENT STATE
    // ------------------------------------------

        ws.send(JSON.stringify({
            type: 'state',
            data: {
                ...botState,

                settings: {
                    giftChatFilter
                }
            }
        }));

    // ------------------------------------------
    // BROWSER DISCONNECTED
    // ------------------------------------------

    ws.on('close', () => {

        dashboardClients.delete(ws);

        console.log(
            'Dashboard: Browser disconnected.'
        );

    });

});


// ==========================================
// START SERVER
// ==========================================

export function startServer() {

    httpServer.listen(3001, () => {

        console.log(
            'Dashboard: http://localhost:3001'
        );

    });

}
