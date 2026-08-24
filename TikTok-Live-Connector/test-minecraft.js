import WebSocket from 'ws';
import { TikTokLiveConnection, WebcastEvent } from 'tiktok-live-connector';
import readline from 'readline';

// ===============================
// MINECRAFT LCON
// ===============================

const ws = new WebSocket('ws://localhost:8115');

// ===============================
// MOB COMMANDS
// ===============================

const MOBS = {
    zombie: 'summon minecraft:zombie',
    skeleton: 'summon minecraft:skeleton',
    mutantZombie: 'summon mutantmonsters:mutant_zombie',
    mutantSkeleton: 'summon mutantmonsters:mutant_skeleton',
    mutantCreeper: 'summon mutantmonsters:mutant_creeper',
    mutantEnderman: 'summon mutantmonsters:mutant_enderman'
};

function summon(command) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(`[server]${command}`);
        console.log(`Minecraft: ${command}`);
    } else {
        console.log('Minecraft: LCon is not connected.');
    }
}

ws.on('open', () => {
    console.log('Connected to LCon!');
});

ws.on('message', data => {
    console.log('Minecraft:', data.toString());
});

ws.on('error', error => {
    console.error('LCon connection error:', error.message);
});

ws.on('close', () => {
    console.log('LCon connection closed.');
});




// ===============================
// MANUAL TEST MENU
// ===============================

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('');
console.log('==============================');
console.log('MINECRAFT MOB TEST MENU');
console.log('==============================');
console.log('1 = Zombie');
console.log('2 = Skeleton');
console.log('3 = Mutant Zombie');
console.log('4 = Mutant Skeleton');
console.log('5 = Mutant Creeper');
console.log('6 = Mutant Enderman');
console.log('==============================');
console.log('Type a number and press ENTER.');
console.log('');

rl.on('line', input => {
    const choice = input.trim();

    switch (choice) {

        case '1':
            summon('summon minecraft:zombie');
            break;

        case '2':
            summon('summon minecraft:skeleton');
            break;

        case '3':
            summon('summon mutantmonsters:mutant_zombie');
            break;

        case '4':
            summon('summon mutantmonsters:mutant_skeleton');
            break;

        case '5':
            summon('summon mutantmonsters:mutant_creeper');
            break;

        case '6':
            summon('summon mutantmonsters:mutant_enderman');
            break;

        default:
            console.log('Unknown option. Use 1-6.');
            break;
    }
});


// ===============================
// TIKTOK LIVE
// ===============================

const tiktokUsername = 'zaaaayiiii';

const tiktok = new TikTokLiveConnection(tiktokUsername, {});


// ===============================
// TIKTOK CONNECTION
// ===============================

tiktok.connect()
    .then(state => {
        console.log(`Connected to TikTok LIVE! Room ID: ${state.roomId}`);
        console.log('TikTok is ready.');
    })
    .catch(error => {
        console.error('TikTok connection error:', error);
    });


// ===============================
// TIKTOK GIFT
// ===============================

tiktok.on(WebcastEvent.GIFT, data => {

    console.log('');
    console.log('==============================');
    console.log('TIKTOK GIFT DETECTED');
    console.log('==============================');
    console.log('User:', data.user?.uniqueId);
    console.log('Gift ID:', data.giftId);
    console.log('==============================');

    // TEST ONLY:
    // Any gift will spawn 1 zombie.
    summon('summon minecraft:zombie');
});