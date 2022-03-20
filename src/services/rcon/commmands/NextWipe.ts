import { isRconObject } from "@/helpers";
import { rconMessage, chatMessage } from "@/types/interfaces";
import Command from "./Command";
import Config from '@/services/config/Config'
import { nextWipe, WipeDaysRemaining } from '@/helpers'

const config = Config.singleton()

class NextWipe extends Command{

    constructor(){
        super()
    }

    public handler(message: rconMessage){
        if(!this.validCommand(message)) return
        if(!this.validTimeFrame()) return
        this.runCommand()
    }

    protected validCommand(message: rconMessage) : boolean{
        if(!isRconObject(message)) return false

        const chatObj : chatMessage = JSON.parse(message.Message),
        Message = chatObj.Message.toLowerCase()

        if(!Message.startsWith('!wipe')) return false

        return true
    }

    public runCommand(): void {
        
        this.lastUse = new Date().getTime()
        const wipeDay = config.getWipeDay()
        
        if(!wipeDay){
            console.error(new Error('received wipeDay of undefined'))
            return
        }
        const   nextwipe = nextWipe(wipeDay),
                daysremaining = WipeDaysRemaining(wipeDay),
                plural = (daysremaining !== 1) ? "s" : "",
                date = String(nextwipe.getDate()).padStart(2, '0'),
                month = String(nextwipe.getMonth() + 1).padStart(2, '0')

        this.rcon.send(`say next wipe is in: ${daysremaining} day${plural} (${date}-${month})`)
    }
}

export default NextWipe