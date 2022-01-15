import "reflect-metadata"
import { Intents, Interaction, Message } from "discord.js"
import { Client } from 'discordx'
import { importx } from "@discordx/importer";
import * as config from "@/config.json"
import { config as configJson } from '@/types/interfaces'
import Rcon from "../Rcon";
import { isRconObject, isRconUndefined } from "@/helpers";

let instance : Discord | undefined

class Discord{

    private client : Client | undefined
    private token : string | undefined
    private rcon : Rcon | undefined

    constructor(){
        this.token = process.env.DISCORD_TOKEN
        // this.bindEvents()
        this.importDependencies()
        this.connect()
    }

    public static singleton() : Discord{
        if(!instance) instance = new Discord
        return instance
    }

    private connect(){
        if(!this.token){
            console.error(new Error('discord token is undefined'))
            return
        }

        this.client = new Client({
            intents: [
              Intents.FLAGS.GUILDS,
              Intents.FLAGS.GUILD_MEMBERS,
              Intents.FLAGS.GUILD_MESSAGES,
              Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
              Intents.FLAGS.GUILD_VOICE_STATES,
            ],
            silent: false
        });

        this.client.once('ready', async () => {
            // make sure all guilds are in cache
            await this.client?.guilds.fetch()

            // init all application commands
            await this.client?.initApplicationCommands()

            // init permissions; enabled log to see changes
            await this.client?.initApplicationPermissions()

            console.log('>> Discord started')
        })

        this.client.login(this.token)
    }

    private async importDependencies(){
        await importx(__dirname + "/{events,commands}/**/*.{ts,js}");
    }

    private bindEvents(){
        if(!this.client){
            console.error(new Error('client isnt undefined'))
            return
        }
    }

    public getClient() : Client | undefined {
        return this.client
    }

    public setupPlayersOnline(): void{

        const configObj : configJson.json = Object(config)

        this.rcon = Rcon.singleton()

        setInterval(async () => {
            const playerlist = await this.rcon?.sendAsync('playerlist', 255)

            if(isRconUndefined(playerlist)) return
            if(!isRconObject(playerlist)) return

            const {Message} = playerlist
            
            const jsonPlayerlist = JSON.parse(Message)

            if(!this.client){
                console.error('received client of undefined')
                return
            }

            const guild = this.client.guilds.cache.get(config.discord.guild_id)

            if(!guild){
                console.error(new Error('received guild of undefined'))
                return
            }

            const channel = guild.channels.cache.get(configObj.discord!.players_online!.chat_channel_id)

            if(!channel){
                console.error(new Error('received channel of undefined'))
                return
            }

            const date = new Date().toLocaleTimeString()

            console.log(date)

            channel.edit({name: `🟢│${jsonPlayerlist.length}-online`, topic: `last updated: ${date}`}).then(()=>{
                console.log('UPDATED')
            }).catch((reason)=>{
                console.error(reason)
            })

        }, (60000 * 5))
    }
}

export default Discord