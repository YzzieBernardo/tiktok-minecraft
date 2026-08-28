import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let botProcess = null;

// ==========================================
// START BOT
// ==========================================

export function startBot() {

    // Already running
    if (botProcess) {
        return {
            running: true,
            message: 'Bot is already running.'
        };
    }

    const botPath = path.join(__dirname, 'index.js');

    botProcess = spawn(
        process.execPath,
        [botPath],
        {
            stdio: 'inherit',
            windowsHide: false
        }
    );

    console.log('Bot process started.');

    botProcess.on('exit', (code, signal) => {

        console.log(
            `Bot process stopped. Code: ${code}, Signal: ${signal}`
        );

        botProcess = null;
    });

    botProcess.on('error', error => {

        console.error(
            'Bot process error:',
            error.message
        );

        botProcess = null;
    });

    return {
        running: true,
        message: 'Bot started.'
    };
}


// ==========================================
// STOP BOT
// ==========================================

export function stopBot() {

    if (!botProcess) {
        return {
            running: false,
            message: 'Bot is already stopped.'
        };
    }

    console.log('Stopping bot process...');

    botProcess.kill();

    return {
        running: false,
        message: 'Bot stopped.'
    };
}


// ==========================================
// BOT STATUS
// ==========================================

export function isBotRunning() {

    return botProcess !== null;
}