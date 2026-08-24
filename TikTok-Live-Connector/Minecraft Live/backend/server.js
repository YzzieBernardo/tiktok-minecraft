// ==========================================
// bot\server.js
// ==========================================
// Bagong file ito.
// Web server para ma-connect ang React
// dashboard sa iyong bot.
// ==========================================

import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

import {
    startBot,
    stopBot,
    isBotRunning
} from './botProcess.js';

// ==========================================
// APP SETUP
// ==========================================

const app = express();

app.use(cors());
app.use(express.json());


// ==========================================
// BOT STATE
// ==========================================
// Ito ang live status ng buong bot.
// React magbabasa dito.
// Ang iyong existing files mag-uupdate nito.
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
// BROADCAST TO DASHBOARD
// ==========================================
// Tawagan mo ito kahit saan sa bot para
// mag-send ng live update sa React.
// ==========================================

const dashboardClients = new Set();

export function broadcastToDashboard(data) {
    const message = JSON.stringify(data);
    for (const client of dashboardClients) {
        if (client.readyState === 1) {
            client.send(message);
        }
    }
}


// ==========================================
// ROUTE: GET /api/status
// ==========================================
// React calls this on page load.
// ==========================================

app.get('/api/status', (req, res) => {
    res.json(botState);
});

// ==========================================
// BOT CONTROL
// ==========================================

app.get('/api/bot/status', (req, res) => {

    res.json({
        running: isBotRunning()
    });

});


app.post('/api/bot/start', (req, res) => {

    const result = startBot();

    broadcastToDashboard({
        type: 'bot_status',
        running: result.running
    });

    res.json(result);

});


app.post('/api/bot/stop', (req, res) => {

    const result = stopBot();

    broadcastToDashboard({
        type: 'bot_status',
        running: result.running
    });

    res.json(result);

});


// ==========================================
// ROUTE: POST /api/command
// ==========================================
// React sends Minecraft commands here.
// Body: { "command": "say Hello" }
// ==========================================

let minecraftCommandHandler = null;

export function onDashboardCommand(handler) {
    minecraftCommandHandler = handler;
}

app.post('/api/command', (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ error: 'No command' });
    }

    if (!minecraftCommandHandler) {
        return res.status(503).json({ error: 'Minecraft not connected' });
    }

    minecraftCommandHandler(command);
    res.json({ ok: true, command });
});


// ==========================================
// WEBSOCKET — LIVE UPDATES TO REACT
// ==========================================

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {

    dashboardClients.add(ws);
    console.log('Dashboard: Browser connected.');

    // Agad na i-send ang current state
    ws.send(JSON.stringify({
        type: 'state',
        data: botState
    }));

    ws.on('close', () => {
        dashboardClients.delete(ws);
        console.log('Dashboard: Browser disconnected.');
    });
});


// ==========================================
// START SERVER
// ==========================================

export function startServer() {
    httpServer.listen(3001, () => {
        console.log('Dashboard: http://localhost:3001');
    });
}