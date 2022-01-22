import { rconMessage } from "@/types/interfaces"
import Rcon from "../Rcon"


abstract class Command{

    protected lastUse: number | null
    protected rcon: Rcon

    constructor(){
        this.lastUse = null
        this.rcon = Rcon.singleton()
    }

    public abstract handler(message: rconMessage) : void

    protected abstract runCommand() : void

    protected abstract validCommand(message: rconMessage) : boolean

    protected validTimeFrame() : boolean{
        const currentTime = new Date().getTime()

        if(!this.lastUse) return true

        if(typeof this.lastUse === 'number' && currentTime >= this.lastUse + (1000 * 60)) return true

        return false
    }
}

export default Command