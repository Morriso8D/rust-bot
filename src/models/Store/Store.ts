import Redis from "@/services/redis/Redis"


abstract class Store{

    protected store : Redis | undefined

    constructor(){
        this.init()
    }

    public init() : Promise<void>{
        return new Promise(async(acc, rej) => {
            this.store = await Redis.singleton()
            acc()
        })
    }
}

export default Store