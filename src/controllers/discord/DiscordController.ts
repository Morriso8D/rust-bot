import { isDiscordClientUndefined, isRconObject } from "@/helpers"
import Discord from "@/services/discord/Discord"
import { setupPlayersOnline } from "@/services/discord/embeds/playersonline"
import Reports from "@/services/discord/logging/Reports"
import Rcon from "@/services/rcon/Rcon"

class DiscordController{

    private discord : Discord
    private reportLoggingBool : boolean = false
    private rcon : Rcon
    private reportLogging : Reports

    constructor(){
        console.log('building discord...')
        this.discord = Discord.singleton()
        this.rcon = Rcon.singleton()
        this.reportLogging = new Reports
        this.bindEvents()
    }

    private bindEvents() : void{
        this.rcon.on('message', (message) => {
            if(!isRconObject(message)) return
            if(message.Type === 'Report'){
                if(this.reportLoggingBool) this.reportLogging.handler(message, this.discord.getClient())
            }
        })
    }

    public async runPlayersOnline(){
        console.log('with players online...')
        this.discord.getClient()?.once('ready', () => {

            const client = this.discord.getClient()
            if(!isDiscordClientUndefined(client)) setupPlayersOnline(client)

            else console.error(new Error('received discord client of undefined'))
        })
    }

    public runChatLogging(){
        console.log('with chat logging...')
    }

    public runReportLogging(){
        console.log('with report logging...')
        this.reportLoggingBool = true
    }
}

export default DiscordController