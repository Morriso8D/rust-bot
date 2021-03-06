import * as config  from './config.json'
import Mysql from '@/services/mysql/Mysql'
import Redis from '@/services/redis/Redis'
import { config as configJson } from './types/interfaces'

export async function bootstrap() : Promise<string[]>{
    
    const configObj : configJson.json = Object(config)
    let built: string[] = []

    /**
     * bootstrap Redis
     */
    await Redis.singleton()
    built.push('Redis')


    /**
     * bootstrap MySQL
     */
    await Mysql.singleton()
    built.push('MySQL')

    /**
     * bootstrap discord
     */
    if(configObj.discord){
        const discord = await new (await import('./controllers/discord/DiscordController')).default()
        if(configObj.discord.players_online) discord.runPlayersOnline()
        if(configObj.discord.logs && configObj.discord.logs.chat_channel_id) discord.runChatLogging()
        if(configObj.discord.logs && configObj.discord.logs.report_channel_id) discord.runReportLogging()
        built.push('Discord')
    }

    /**
     * bootstrap CLI
     */
    if(configObj.cli){
        await new (await import('./controllers/cli/CliController')).default()
        built.push('CLI')
    }


    /**
     * bootstrap RCON
     */
    if(configObj.rcon){
        const rcon = await new (await import('./controllers/rcon/RconController')).default()
        if(configObj.rcon.commands?.online) rcon.runOnlineCommand()
        if(configObj.rcon.commands?.wipe) rcon.runNextWipeCommand()
    }

    return built
}