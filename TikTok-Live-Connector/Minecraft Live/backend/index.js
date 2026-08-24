import { connectTikTok } from './tiktok/connection.js';
import { setupGiftListener } from './tiktok/gifts.js';
;import { startServer } from './server.js';

// ==========================================
// BOT STARTUP
// ==========================================

setupGiftListener();

connectTikTok()

startServer();