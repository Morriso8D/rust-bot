import { isDiscordClientUndefined } from "@/helpers"
import Discord from "@/services/discord/Discord"
import { setupPlayersOnline } from "@/services/discord/embeds/playersonline"

class DiscordController{

    private discord : Discord

    constructor(){
        console.log('building discord...')
        this.discord = Discord.singleton()
    }

    public async runPlayersOnline(){
        console.log('with players online...')
        this.discord.getClient()?.once('ready', () => {

            const client = this.discord.getClient()
            if(!isDiscordClientUndefined(client)) setupPlayersOnline(client)

            else console.error(new Error('received discord client of undefined'))
        })
    }

    public runChatLogging(channelId: string){
        console.log('with chat logging...')
    }
}

export default DiscordController