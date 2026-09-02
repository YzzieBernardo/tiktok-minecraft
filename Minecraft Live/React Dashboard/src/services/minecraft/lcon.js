
import WebSocket from 'ws';

let ws = null;

const minecraftMessageHandlers = new Set();
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

    console.log('');
    console.log('================================');
    console.log('LCon MESSAGE RECEIVED');
    console.log('RAW:', JSON.stringify(message));
    console.log('READY STATE:', ws?.readyState);
    console.log('CONNECTED:', isMinecraftConnected());
    console.log('================================');
    for (const handler of minecraftMessageHandlers) {

        try {

            console.log(
                'Calling Minecraft message handler...'
            );

            handler(message);

            console.log(
                'Minecraft message handler finished.'
            );

        } catch (error) {

            console.error(
                'Minecraft message handler ERROR:',
                error
            );

        }

    }

});

    // ==========================================
    // ERROR
    // ==========================================
ws.on('error', error => {

    clearTimeout(connectionTimeout);

    console.log('');
    console.log('================================');
    console.log('MINECRAFT LCON WEBSOCKET ERROR');
    console.log('ERROR MESSAGE:', error.message);
    console.log('ERROR CODE:', error.code);
    console.log('ERROR:', error);
    console.log('================================');

    notifyEvent(
        `Minecraft LCon error: ${error.message}`,
        'like'
    );

});

    // ==========================================
    // CLOSED
    // ==========================================

ws.on('close', (code, reason) => {

    console.log('');
    console.log('================================');
    console.log('MINECRAFT LCON WEBSOCKET CLOSED');
    console.log('CLOSE CODE:', code);
    console.log(
        'CLOSE REASON:',
        reason?.toString() || '(empty)'
    );
    console.log('================================');

    notifyEvent(
        `Minecraft LCon: Connection closed. Code=${code} Reason=${reason?.toString() || '(empty)'}`,
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
    minecraftMessageHandlers.add(handler);
}


// ==========================================
// SEND COMMAND
// ==========================================
export function sendCommand(command) {

    const text =
        String(command || '').trim();


    if (!text) {

        notifyEvent(
            'Minecraft: Cannot send empty command.',
            'like'
        );

        return false;
    }


    if (!isMinecraftConnected()) {

        notifyEvent(
            'Minecraft: Cannot send command. LCon is disconnected.',
            'like'
        );

        return false;
    }


    try {

        ws.send(
            `[server]${text}`
        );

        console.log(
            `Minecraft: ${text}`
        );

        return true;

    } catch (error) {

        console.error(
            'Minecraft: Failed to send command:',
            error
        );

        return false;

    }
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