import { connectTikTok } from './tiktok/connection.js';
import { setupGiftListener } from './tiktok/gifts.js';

setupGiftListener();

connectTikTok();