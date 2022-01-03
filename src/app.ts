import RCON from './services/rcon/rcon'
import { createInterface } from 'readline'

import { bootstrap } from './bootstrap'

bootstrap().then( (data) => {
    const built = data.join(', ')
    console.log(`running: ${built}`)
})

// const rcon = RCON.singleton()

// const readline = createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

// rcon.on('connect', async () => {

//     rcon.send('playerlist', 2)

//     rcon.on('message', (message) => {

//         console.log(message)

//     })

//     const response = await rcon.sendAsync('info', 34335)
//     console.log(response)

    
    

//     readline.on('line', (input) => {
//         rcon.send(input, 999);
//     })
// })
