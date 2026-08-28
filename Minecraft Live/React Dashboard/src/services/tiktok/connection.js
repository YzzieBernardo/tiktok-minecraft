import { TikTokLiveConnection } from 'tiktok-live-connector';
import { botState, broadcastToDashboard } from '../core/server.js'

const tiktokUsername = 'zaaaayiiii';

export const tiktok = new TikTokLiveConnection(
    tiktokUsername,
    {}
);

export async function connectTikTok() {
    try {
        const connectionState = await tiktok.connect();

        console.log(`TikTok connected! Room ID: ${connectionState.roomId}`);
        console.log('TikTok is ready.');

        botState.tiktok.connected = true;
        botState.tiktok.roomId = connectionState.roomId;

        broadcastToDashboard({
            type: 'tiktok_connected',
            roomId: connectionState.roomId
        });

        return connectionState;

    } catch (error) {
        console.error('TikTok connection error:', error);

        botState.tiktok.connected = false;

        broadcastToDashboard({
            type: 'tiktok_disconnected'
        });

        throw error;
    }
}