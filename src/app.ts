import { bootstrap } from './bootstrap'

bootstrap().then( (data) => {
    const built = data.join('\n>> ')
    console.log(`running: \n>> ${built}`)
})