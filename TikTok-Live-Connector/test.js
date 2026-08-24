import { TikTokLiveConnection, WebcastEvent } from './dist/index.js';

const username = 'Yzzie';

const connection = new TikTokLiveConnection(username, {});

connection.connect()
    .then(state => {
        console.log(`Connected to ${state.roomId}`);
    })
    .catch(error => {
        console.error('Connection failed:', error);
    });

connection.on(WebcastEvent.GIFT, data => {
    console.log('🎁 GIFT RECEIVED');
    console.log(data);
});