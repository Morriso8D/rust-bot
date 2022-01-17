import { isRconObject, isRconUndefined } from "@/helpers"
import { chatMessage, rconMessage } from "@/types/interfaces"
import Rcon from "../Rcon"


class PlayersOnline{

    private rcon : Rcon
    private lastUse: number | null

    constructor(){
        this.rcon = Rcon.singleton()
        this.lastUse = null
    }

    public handler(message: rconMessage) : void{
        if(!this.validCommand(message)) return
        if(!this.validTimeFrame()) return
        this.runCommand()
    }

    private validCommand(message: rconMessage) : boolean{
        if(!isRconObject(message)) return false

        const chatObj : chatMessage = JSON.parse(message.Message)
        const Message = chatObj.Message.toLowerCase()

        if(Message.startsWith('!pop') || Message.startsWith('!online') || Message.startsWith('!players')) return true

        return false
    }

    private validTimeFrame() : boolean{

        const currentTime = new Date().getTime()

        if(!this.lastUse) return true

        if(typeof this.lastUse === 'number' && currentTime >= this.lastUse + (1000 * 60)) return true

        return false
    }

    private async runCommand(){

        this.lastUse = new Date().getTime()
        const playerlist = await this.rcon?.sendAsync('playerlist', 255)

        if(isRconUndefined(playerlist)) return
        if(!isRconObject(playerlist)) return

        const jsonPlayerlist = JSON.parse(playerlist.Message)

        this.rcon.send(`say ${jsonPlayerlist.length} players online`)
    }
}

export default PlayersOnline