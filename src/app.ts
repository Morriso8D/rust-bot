import { bootstrap } from './bootstrap'
import Mysql from '@/services/mysql/Mysql'

bootstrap().then( (data) => {
    const built = data.join(', ')
    console.log(`running: ${built}`)
})