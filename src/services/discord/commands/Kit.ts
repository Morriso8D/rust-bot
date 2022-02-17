import KitLogs from '@/models/KitLogs'
import dayjs from 'dayjs'

abstract class Kit{

    protected kitLogs : KitLogs

    constructor(){
        this.kitLogs = new KitLogs
    }

    protected abstract validateLastUse(discordId : string, kit : string) : Promise<boolean>
}

export default Kit