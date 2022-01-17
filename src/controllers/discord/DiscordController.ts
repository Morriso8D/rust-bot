import Discord from "@/services/discord/Discord"

class DiscordController{

    private discord : Discord

    constructor(){
        console.log('building discord...')
        this.discord = Discord.singleton()
    }

    public async runPlayersOnline(){
        console.log('with players online...')
        this.discord.getClient()?.once('ready', () => {
            this.discord.setupPlayersOnline()
        })
    }

    public runChatLogging(channelId: string){
        console.log('with chat logging...')
    }
}

export default DiscordController