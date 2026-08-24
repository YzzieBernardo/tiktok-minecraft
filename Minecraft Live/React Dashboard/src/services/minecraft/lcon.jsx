import WebSocket from 'ws';
import { botState, broadcastToDashboard } from '../server.js';

const ws = new WebSocket('ws://localhost:8115');

let minecraftMessageHandler = null;


// ==========================================
// REGISTER MINECRAFT MESSAGE HANDLER
// ==========================================

export function onMinecraftMessage(handler) {
    minecraftMessageHandler = handler;
}


// ==========================================
// SEND COMMAND TO MINECRAFT
// ==========================================

export function sendCommand(command) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(`[server]${command}`);
        console.log(`Minecraft: ${command}`);
        return;
    }

    console.log('Minecraft: Waiting for LCon...');

    ws.once('open', () => {
        ws.send(`[server]${command}`);
        console.log(`Minecraft: ${command}`);
    });
}


// ==========================================
// LCON CONNECTED
// ==========================================

ws.on('open', () => {
    console.log('Minecraft: LCon connected.');

    // ✅ I-update ang dashboard
    botState.minecraft.connected = true;
    broadcastToDashboard({ type: 'minecraft_connected' });
});

// ==========================================
// MINECRAFT MESSAGE RECEIVED
// ==========================================

ws.on('message', data => {
    const message = data.toString();

    console.log('Minecraft:', message);

    // Pass the Minecraft message to whoever registered a handler.
    if (minecraftMessageHandler) {
        minecraftMessageHandler(message);
    }
});


// ==========================================
// ERROR
// ==========================================

ws.on('error', error => {
    console.error('Minecraft LCon error:', error.message);
});


// ==========================================
// CONNECTION CLOSED
// ==========================================

ws.on('close', () => {
    console.log('Minecraft: LCon connection closed.');

    // ✅ I-update ang dashboard
    botState.minecraft.connected = false;
    broadcastToDashboard({ type: 'minecraft_disconnected' });
});