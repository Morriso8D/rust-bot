import { isRconObject } from "@/helpers";
import { rconMessage, chatMessage } from "@/types/interfaces";
import Command from "./Command";
import * as config from "@/config.json"
import { config as configJson } from '@/types/interfaces'


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
        const configObj : configJson.json = Object(config),
        nextWipe = this.nextWipe(configObj.wipe_day!),
        daysRemaining = this.daysRemaining(configObj.wipe_day!),
        plural = (daysRemaining !== 1) ? "s" : "",
        date = String(nextWipe.getDate()).padStart(2, '0'),
        month = String(nextWipe.getMonth() + 1).padStart(2, '0')

        this.rcon.send(`say next wipe is in: ${daysRemaining} day${plural} (${date}-${month})`)
    }

    private nextWipe(dayOfTheWeek: number) : Date{
        const now = new Date(),
        daysRemaining = this.daysRemaining(dayOfTheWeek)

        now.setDate(now.getDate() + daysRemaining)
        return now;
    }

    private daysRemaining(dayOfTheWeek: number) : number{
        const now = new Date()

        return (((dayOfTheWeek + 7 - now.getDay()) % 7) || 7)
    }
}

export default NextWipe