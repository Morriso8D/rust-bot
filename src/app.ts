import { bootstrap } from './bootstrap'

bootstrap().then( (data) => {
    const built = data.join(', ')
    console.log(`running: ${built}`)
})
