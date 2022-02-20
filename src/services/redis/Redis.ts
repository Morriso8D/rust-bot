import WaitPort from 'wait-port'
import { createClient, RedisClientType } from 'redis'
import { isRedisConnected } from '@/helpers'

let instance : Redis

class Redis{

    private client: RedisClientType<any> | undefined

    public constructor(){
    }

    public static async singleton() {
            if(!instance){
                instance = new Redis()
                await instance.init()
                return instance
            }
    
            return instance
    }

    private async init() : Promise<void>{

        return new Promise(async (acc, rej) => {
            try {

                await WaitPort({host: process.env.REDIS_HOST, port :  Number(process.env.REDIS_PORT) || 6379})

                this.client = createClient({url: process.env.REDIS_URL});

                this.bindHandlers()

                await this.client.connect()
                acc()

            } catch (err) {
                rej(err)
            }
        })
    }

    private bindHandlers(): void{
        this.client?.on('error', (err) => console.log('Redis Client Error', err))
    }

    public setEx(key: string, val: string, ex : number = 600) : Promise<void>{
        return new Promise(async (acc, rej) => {
            if(!isRedisConnected(this.client)) return rej()
            
            try {
                await this.client.setEx(key, ex, val)
                acc()
            } catch (err) {
                rej(err)
            }
        })
    }

    public get(key: string) : Promise<string | null>{
        return new Promise(async (acc, rej) => {
            if(!isRedisConnected(this.client)) return rej()

            try {
                const val = await this.client.get(key)
                acc(val)
            } catch (err) {
                rej(err)
            }
        })
    }
}

export default Redis