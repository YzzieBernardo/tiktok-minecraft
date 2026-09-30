import WebSocket from 'ws';

let ws = null;

const minecraftMessageHandlers = new Set();
let minecraftStatusHandler = null;
let minecraftEventHandler = null;

let requestCounter = 0;
const pendingRequests = new Map();


// ==========================================
// CONFIG
// ==========================================

const DEBUG_BRIDGE_URL = 'ws://127.0.0.1:9876';


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
        `Minecraft DebugBridge: ${connected ? 'CONNECTED' : 'DISCONNECTED'}`
    );

    if (minecraftStatusHandler) {
        minecraftStatusHandler(connected);
    }
}


// ==========================================
// GENERATE REQUEST ID
// ==========================================

function nextRequestId() {
    requestCounter += 1;
    return `minecraft-${Date.now()}-${requestCounter}`;
}


// ==========================================
// SEND DEBUGBRIDGE REQUEST
// ==========================================

function sendDebugBridgeRequest(type, payload = {}) {
    return new Promise((resolve, reject) => {

        if (!isMinecraftConnected()) {
            reject(
                new Error(
                    'Minecraft DebugBridge is disconnected.'
                )
            );

            return;
        }

        const id = nextRequestId();

        const request = {
            id,
            type,
            payload
        };

        const timeout = setTimeout(() => {

            pendingRequests.delete(id);

            reject(
                new Error(
                    `DebugBridge request timed out: ${type}`
                )
            );

        }, 10000);


        pendingRequests.set(id, {
            resolve,
            reject,
            timeout
        });


        try {

            console.log(
                'DebugBridge SEND:',
                JSON.stringify(request)
            );

            ws.send(
                JSON.stringify(request)
            );

        } catch (error) {

            clearTimeout(timeout);
            pendingRequests.delete(id);

            reject(error);
        }

    });
}


// ==========================================
// CONNECT MINECRAFT
// ==========================================

export function connectMinecraft() {

    // Already connected
    if (ws?.readyState === WebSocket.OPEN) {

        notifyEvent(
            'Minecraft DebugBridge: Already connected.',
            'minecraft'
        );

        return;
    }


    // Connection already in progress
    if (ws?.readyState === WebSocket.CONNECTING) {

        notifyEvent(
            'Minecraft DebugBridge: Connection already in progress.',
            'minecraft'
        );

        return;
    }


    notifyEvent(
        `Minecraft DebugBridge: Connecting to ${DEBUG_BRIDGE_URL}...`,
        'minecraft'
    );


    ws = new WebSocket(
        DEBUG_BRIDGE_URL
    );


    const connectionTimeout = setTimeout(() => {

        if (ws && ws.readyState === WebSocket.CONNECTING) {

            notifyEvent(
                'Minecraft DebugBridge: Connection timeout — no WebSocket handshake.',
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
            'Minecraft DebugBridge: Connected.',
            'minecraft'
        );

        notifyStatus();
    });


    // ==========================================
    // MESSAGE
    // ==========================================

    ws.on('message', data => {

        const rawMessage = data.toString();

        console.log('');
        console.log('================================');
        console.log('DEBUGBRIDGE MESSAGE RECEIVED');
        console.log('RAW:', rawMessage);
        console.log('READY STATE:', ws?.readyState);
        console.log('CONNECTED:', isMinecraftConnected());
        console.log('================================');


        let message;

        try {

            message = JSON.parse(rawMessage);

        } catch (error) {

            console.error(
                'DebugBridge returned non-JSON data:',
                rawMessage
            );

            return;
        }


        // ==========================================
        // RESOLVE PENDING REQUEST
        // ==========================================

        if (message?.id) {

            const pending =
                pendingRequests.get(
                    String(message.id)
                );


            if (pending) {

                clearTimeout(
                    pending.timeout
                );

                pendingRequests.delete(
                    String(message.id)
                );


                // Detect DebugBridge error responses
                if (
                    message.error ||
                    message.payload?.error
                ) {

                    const errorMessage =
                        message.error ||
                        message.payload?.error ||
                        'Unknown DebugBridge error.';


                    pending.reject(
                        new Error(
                            String(errorMessage)
                        )
                    );

                } else {

                    pending.resolve(
                        message
                    );

                }

            }

        }


        // ==========================================
        // FORWARD MESSAGE TO EXISTING APP HANDLERS
        // ==========================================

        for (const handler of minecraftMessageHandlers) {

            try {

                handler(message);

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

        console.error('');
        console.error('================================');
        console.error('MINECRAFT DEBUGBRIDGE WEBSOCKET ERROR');
        console.error('ERROR MESSAGE:', error.message);
        console.error('ERROR CODE:', error.code);
        console.error('ERROR:', error);
        console.error('================================');


        notifyEvent(
            `Minecraft DebugBridge error: ${error.message}`,
            'like'
        );

    });


    // ==========================================
    // CLOSED
    // ==========================================

    ws.on('close', (code, reason) => {

        console.log('');
        console.log('================================');
        console.log('MINECRAFT DEBUGBRIDGE WEBSOCKET CLOSED');
        console.log('CLOSE CODE:', code);
        console.log(
            'CLOSE REASON:',
            reason?.toString() || '(empty)'
        );
        console.log('================================');


        notifyEvent(
            `Minecraft DebugBridge: Connection closed. Code=${code} Reason=${reason?.toString() || '(empty)'}`,
            'like'
        );


        // Reject any requests still waiting
        for (const [id, pending] of pendingRequests) {

            clearTimeout(
                pending.timeout
            );

            pending.reject(
                new Error(
                    'Minecraft DebugBridge connection closed.'
                )
            );

            pendingRequests.delete(id);
        }


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
            'Minecraft DebugBridge: Already disconnected.',
            'like'
        );

        return;
    }


    notifyEvent(
        'Minecraft DebugBridge: Disconnecting...',
        'minecraft'
    );


    ws.close();

}


// ==========================================
// REGISTER MESSAGE HANDLER
// ==========================================

export function onMinecraftMessage(handler) {
    minecraftMessageHandlers.add(handler);

    return () => {
        minecraftMessageHandlers.delete(handler);
    };
}


// ==========================================
// ESCAPE STRING FOR GROOVY
// ==========================================

function escapeGroovyString(value) {

    return String(value ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n');
}


// ==========================================
// SEND COMMAND
// ==========================================
//
// Keeps the same public API:
//
// sendCommand("say hello")
//
// Internally:
// JavaScript
//   ↓
// DebugBridge execute
//   ↓
// player.connection.sendCommand()
//   ↓
// Minecraft
// ==========================================

export function sendCommand(command) {

    const text =
        String(command || '')
            .trim();


    if (!text) {

        notifyEvent(
            'Minecraft: Cannot send empty command.',
            'like'
        );

        return false;
    }


    if (!isMinecraftConnected()) {

        notifyEvent(
            'Minecraft: Cannot send command. DebugBridge is disconnected.',
            'like'
        );

        return false;
    }


    const escapedCommand =
        escapeGroovyString(
            text.replace(/^\/+/, '')
        );


    const code =
        `player.connection.sendCommand('${escapedCommand}'); return 'OK'`;


    sendDebugBridgeRequest(
        'execute',
        {
            code
        }
    )
        .then(response => {

            console.log(
                'Minecraft command executed:',
                text,
                response
            );

        })
        .catch(error => {

            console.error(
                'Minecraft command failed:',
                text,
                error
            );


            notifyEvent(
                `Minecraft command failed: ${error.message}`,
                'like'
            );

        });


    console.log(
        `Minecraft: ${text}`
    );


    return true;
}

// ==========================================
// GET MINECRAFT PLAYER POSITION
// ==========================================
//
// Uses DebugBridge execute.
//
// Returns:
//
// {
//     x,
//     y,
//     z
// }
// ==========================================

export async function getMinecraftPlayerPosition(player = '@p') {

    if (!isMinecraftConnected()) {

        throw new Error(
            'Minecraft DebugBridge is disconnected.'
        );
    }

    // IMPORTANT:
    // Do NOT use ${x}, ${y}, ${z} inside this
    // JavaScript template literal.
    //
    // JavaScript would try to evaluate them BEFORE
    // the Groovy code reaches DebugBridge.
    //
    // Instead, let Groovy build the string.

    const code = `
def x = player.getX()
def y = player.getY()
def z = player.getZ()
return x.toString() + "," + y.toString() + "," + z.toString()
`;

    try {

        const response =
            await sendDebugBridgeRequest(
                'execute',
                {
                    code
                }
            );

        console.log(
            'Minecraft Position DebugBridge Response:',
            response
        );

        const result =
            response?.payload?.result ??
            response?.payload?.output ??
            response?.result ??
            response?.output ??
            response?.payload;

        const text =
            typeof result === 'string'
                ? result
                : result?.value !== undefined
                    ? String(result.value)
                    : JSON.stringify(result);

        console.log(
            'Minecraft Position Raw Value:',
            text
        );

        const match =
            text.match(
                /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/
            );

        if (!match) {

            throw new Error(
                `Could not parse Minecraft position from DebugBridge response: ${text}`
            );
        }

        const x = Number(match[1]);
        const y = Number(match[2]);
        const z = Number(match[3]);

        if (
            !Number.isFinite(x) ||
            !Number.isFinite(y) ||
            !Number.isFinite(z)
        ) {

            throw new Error(
                'Minecraft position contained invalid coordinates.'
            );
        }

        console.log(
            `Minecraft Position: X=${x}, Y=${y}, Z=${z}`
        );

        return {
            x,
            y,
            z
        };

    } catch (error) {

        console.error(
            'Minecraft Position Error:',
            error
        );

        throw error;
    }
}

// ==========================================
// SEND MINECRAFT CHAT
// ==========================================
//
// Keeps the same public API:
//
// sendMinecraftChat("Hello")
//
// Internally uses Minecraft's client connection.
// ==========================================

export function sendMinecraftChat(message) {

    const text =
        String(message ?? '');


    if (!isMinecraftConnected()) {

        notifyEvent(
            'Minecraft: Cannot send chat. DebugBridge is disconnected.',
            'minecraft'
        );

        return false;
    }


    if (!text.trim()) {

        notifyEvent(
            'Minecraft: Cannot send empty chat message.',
            'like'
        );

        return false;
    }


    const escapedMessage =
        escapeGroovyString(
            text
        );


    const code =
        `player.connection.sendChat('${escapedMessage}'); return 'OK'`;


    sendDebugBridgeRequest(
        'execute',
        {
            code
        }
    )
        .then(response => {

            console.log(
                'Minecraft Chat Sent:',
                text,
                response
            );

        })
        .catch(error => {

            console.error(
                'Minecraft Chat Error:',
                error
            );


            notifyEvent(
                `Minecraft chat failed: ${error.message}`,
                'like'
            );

        });


    console.log(
        `Minecraft Chat: ${text}`
    );


    return true;
}