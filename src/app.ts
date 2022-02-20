import { bootstrap } from './bootstrap'
import Mysql from '@/services/mysql/Mysql'
import WaitPort from 'wait-port'

bootstrap().then( (data) => {
    const built = data.join(', ')
    console.log(`running: ${built}`)
})

import { createClient } from 'redis';

(async () => {

    await WaitPort({host: process.env.REDIS_HOST, port : 6379})

    console.log(process.env.REDIS_URL, 'REDIS URL >>>>>>>>>>')
    const client = createClient({url: process.env.REDIS_URL});

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    await client.setEx('customer_name', 5, 'john doe');
    const value = await client.get('customer_name');

    console.log(value, '>>>>>>>>>>>>>>>>>>>')

    setTimeout(async () => {
        const name = await client.get('customer_name')

        console.log(name, '10 sec >>>>>>>>>>👍')
    }, 1000 * 12);
})();