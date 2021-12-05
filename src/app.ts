import RCON from './services/rcon'

const rcon = RCON.singleton()

rcon.on('connect', () => {

    rcon.send('playerlist', 2)

    rcon.on('message', (message) => {

        console.log(message)

    })

})
