import "reflect-metadata"
import { EmbedFieldData, Intents, Interaction, Message, MessageEmbed } from "discord.js"
import { Client } from 'discordx'
import { importx } from "@discordx/importer";
import * as config from "@/config.json"
import { config as configJson, playerlist } from '@/types/interfaces'
import Rcon from "@/services/rcon/Rcon";
import { isRconObject, isRconUndefined } from "@/helpers";

let instance : Discord | undefined

class Discord{

    private client : Client | undefined
    private token : string | undefined

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

        this.client.once('ready', async (client) => {
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
}

export default Discord