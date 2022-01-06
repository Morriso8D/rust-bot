import * as config  from '../config.json'
import { config as configJson } from 'types/interfaces'

export async function bootstrap() : Promise<string[]>{
    
    const configObj : configJson.json = Object(config)
    let built: string[] = []

    /**
     * bootstrap discord
     */
    if(configObj.discord){
        const discord = await new (await import('./controllers/discord/DiscordController')).default()
        if(configObj.discord.players_online) discord.runPlayersOnline()
        if(configObj.discord.logs && configObj.discord.logs.chat_channel_id) discord.runChatLogging(configObj.discord.logs.chat_channel_id)
        built.push('discord')
    }

    /**
     * bootstrap CLI
     */
    if(configObj.cli){
        await new (await import('./controllers/cli/CliController')).default()
        built.push('CLI')
    }

    return built
}