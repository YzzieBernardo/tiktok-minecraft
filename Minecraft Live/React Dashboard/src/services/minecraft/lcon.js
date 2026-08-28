import WebSocket from 'ws';

let ws = null;

let minecraftMessageHandler = null;
let minecraftStatusHandler = null;
let minecraftEventHandler = null;


// ==========================================
// STATUS
// ==========================================

export function isMinecraftConnected() {
    return ws !== null && ws.readyState === WebSocket.OPEN;
}


// ==========================================
// STATUS EVENT
// ==========================================

export function onMinecraftStatus(handler) {
    minecraftStatusHandler = handler;
}


// ==========================================
// EVENT LOG
// ==========================================

export function onMinecraftEvent(handler) {
    minecraftEventHandler = handler;
}


function notifyEvent(message, type = '') {

    console.log(message);

    if (minecraftEventHandler) {
        minecraftEventHandler(message, type);
    }
}


// ==========================================
// NOTIFY STATUS
// ==========================================

function notifyStatus() {

    const connected = isMinecraftConnected();

    console.log(
        `Minecraft LCon: ${connected ? 'CONNECTED' : 'DISCONNECTED'}`
    );

    if (minecraftStatusHandler) {
        minecraftStatusHandler(connected);
    }
}


// ==========================================
// CONNECT MINECRAFT
// ==========================================

export function connectMinecraft() {

    // Already connected
    if (ws?.readyState === WebSocket.OPEN) {

        notifyEvent(
            'Minecraft LCon: Already connected.',
            'minecraft'
        );

        return;
    }


    // Connection already in progress
    if (ws?.readyState === WebSocket.CONNECTING) {

        notifyEvent(
            'Minecraft LCon: Connection already in progress.',
            'minecraft'
        );

        return;
    }


    // ==========================================
    // START CONNECTION
    // ==========================================

    notifyEvent(
        'Minecraft LCon: Connecting to ws://localhost:8115...',
        'minecraft'
    );


   ws = new WebSocket('ws://127.0.0.1:8115');

        const connectionTimeout = setTimeout(() => {

    if (ws && ws.readyState === WebSocket.CONNECTING) {

        notifyEvent(
            'Minecraft LCon: Connection timeout — no WebSocket handshake.',
            'like'
        );

        ws.terminate();
        ws = null;

        notifyStatus();
    }

}, 5000);


    // ==========================================
    // CONNECTED
    // ==========================================

  ws.on('open', () => {

    clearTimeout(connectionTimeout);

    notifyEvent(
        'Minecraft LCon: Connected.',
        'minecraft'
    );

    notifyStatus();
});


    // ==========================================
    // MESSAGE
    // ==========================================

ws.on('message', data => {

    const message = data.toString();

    console.log(
        'Minecraft:',
        message
    );

    console.log(
        'LCon RAW MESSAGE:',
        JSON.stringify(message)
    );

    if (minecraftMessageHandler) {
        minecraftMessageHandler(message);
    }
});


    // ==========================================
    // ERROR
    // ==========================================

    ws.on('error', error => {

    clearTimeout(connectionTimeout);

    notifyEvent(
        `Minecraft LCon error: ${error.message}`,
        'like'
    );

});


    // ==========================================
    // CLOSED
    // ==========================================

    ws.on('close', () => {

        notifyEvent(
            'Minecraft LCon: Connection closed.',
            'like'
        );


        ws = null;

        notifyStatus();

    });

}


// ==========================================
// DISCONNECT MINECRAFT
// ==========================================

export function disconnectMinecraft() {

    if (!ws) {

        notifyEvent(
            'Minecraft LCon: Already disconnected.',
            'like'
        );

        return;
    }


    notifyEvent(
        'Minecraft LCon: Disconnecting...',
        'minecraft'
    );


    const socket = ws;

    socket.close();

    // Huwag agad gawing null dito.
    // Hayaan ang "close" event ang mag-clear nito.
}


// ==========================================
// REGISTER MESSAGE HANDLER
// ==========================================

export function onMinecraftMessage(handler) {
    minecraftMessageHandler = handler;
}


// ==========================================
// SEND COMMAND
// ==========================================

export function sendCommand(command) {

    if (!ws || ws.readyState !== WebSocket.OPEN) {

        notifyEvent(
            'Minecraft: Cannot send command. LCon is disconnected.',
            'like'
        );

        return false;
    }


    ws.send(`[server]${command}`);

    console.log(
        `Minecraft: ${command}`
    );

    return true;
}


// ==========================================
// SEND MINECRAFT CHAT
// ==========================================

export function sendMinecraftChat(message) {

    if (!ws || ws.readyState !== WebSocket.OPEN) {

        notifyEvent(
            'Minecraft: Cannot send chat. LCon is disconnected.',
            'minecraft'
        );

        return false;
    }

    ws.send(`[chat]${message}`);

    console.log(
        `Minecraft Chat: ${message}`
    );

    return true;
}