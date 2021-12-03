"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
// require('dotenv').config()
const rcon = new websocket_1.client();
rcon.on('connectFailed', (error) => {
    console.log(`connection failed: ${error}`);
});
rcon.on('connect', (connection) => {
    console.log('connected');
    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            const { utf8Data } = message;
            try {
                console.log(JSON.parse(utf8Data));
            }
            catch (error) {
                console.log(utf8Data);
            }
        }
    });
    connection.on('close', () => {
        console.log('connection closed');
    });
    connection.on('error', (error) => {
        console.log(`connection error: ${error.toString()}`);
    });
    const payload = {
        Identifier: -1,
        Message: 'playerlist',
        Name: 'WebRcon'
    };
    connection.sendUTF(JSON.stringify(payload));
});
rcon.connect('ws://136.244.96.208:28016/xyRnXnRkJ4hzd664');
console.log(process.env.DB_HOST);
//# sourceMappingURL=app.js.map