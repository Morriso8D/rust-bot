"use strict";
// import { client } from 'websocket'
// import { rconCommand } from '.'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const rcon = new client()
// const rcon_secret = process.env.RCON_SECRET
// const rcon_ip = process.env.RCON_IP
// const rcon_port = process.env.RCON_PORT
// rcon.on('connectFailed', (error) => {
//     console.log(`connection failed: ${error}`)
// })
// rcon.on('connect', (connection) => {
//     console.log('connected')
//     connection.on('message', (message) => {
//         if(message.type === 'utf8'){
//             const { utf8Data } = message
//             try {
//                 console.log(JSON.parse(utf8Data))
//             } catch (error) {
//                 console.log(utf8Data)
//             }
//         }
//     })
//     connection.on('close', () => {
//         console.log('connection closed')
//     })
//     connection.on('error', (error) => {
//         console.log(`connection error: ${error.toString()}`)
//     })
//     const payload : rconCommand = {
//         Identifier: -1,
//         Message: 'playerlist',
//         Name: 'WebRcon'
//     };
//     connection.sendUTF(JSON.stringify(payload))
// })
// rcon.connect(`ws://${rcon_ip}:${rcon_port}/${rcon_secret}`)
const rcon_1 = __importDefault(require("./services/rcon"));
const rcon = rcon_1.default.singleton();
setTimeout(() => {
    rcon.send('playerlist', 2);
}, 1000);
//# sourceMappingURL=app.js.map