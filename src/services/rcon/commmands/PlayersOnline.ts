import { isRconObject, isRconUndefined } from "@/helpers"
import { chatMessage, rconMessage } from "@/types/interfaces"
import Command from "./Command"


class PlayersOnline extends Command{

    constructor(){
        super()
        this.lastUse = null
    }

    public handler(message: rconMessage) : void{
        if(!this.validCommand(message)) return
        if(!this.validTimeFrame()) return
        this.runCommand()
    }

    protected validCommand(message: rconMessage) : boolean{
        if(!isRconObject(message)) return false

        const chatObj : chatMessage = JSON.parse(message.Message)
        const Message = chatObj.Message.toLowerCase()

        if(Message.startsWith('!pop') || Message.startsWith('!online') || Message.startsWith('!players')) return true

        return false
    }

    protected async runCommand(){

        this.lastUse = new Date().getTime()
        const playerlist = await this.rcon?.sendAsync('playerlist', 255)

        if(isRconUndefined(playerlist)) return
        if(!isRconObject(playerlist)) return

        const jsonPlayerlist = JSON.parse(playerlist.Message),
        plural = (jsonPlayerlist.length === 1) ? '' : 's'

        this.rcon.send(`say ${jsonPlayerlist.length} player${plural} online`)
    }
}

export default PlayersOnline