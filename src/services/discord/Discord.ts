import "reflect-metadata"
import { Intents, Interaction, Message } from "discord.js"
import { Client } from 'discordx'
import { importx } from "@discordx/importer";

let instance : Discord | undefined

class Discord{

    private client : Client | undefined
    private token : string | undefined

    constructor(){
        this.token = process.env.DISCORD_TOKEN
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
            // If you only want to use global commands only, comment this line
            botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
        });

        this.client.once('ready', async (client) => {

            if(!this.client){
                console.error(new Error('received discord client of undefined'))
                return
            }

            // make sure all guilds are in cache
            await this.client.guilds.fetch()

            // init all application commands
            await this.client.initApplicationCommands({
                guild: { log: true },
                global: { log: true },
            })

            // init permissions; enabled log to see changes
            await this.client.initApplicationPermissions(true)

            console.log('>> Discord started')
        })
        
        this.bindEvents()
        this.client.login(this.token)
    }

    private async importDependencies(){
        await importx(__dirname + "/{events,commands}/**/*.{ts,js}");
    }

    private bindEvents(){
        if(!this.client){
            console.error(new Error('recieved discord client of undefined'))
            return
        }
        this.client.on('interactionCreate', (interaction: Interaction) => {
            this.client?.executeInteraction(interaction)
        })
        this.client.on("messageCreate", (message: Message) => {
            this.client?.executeCommand(message);
        });
    }

    public getClient() : Client | undefined {
        return this.client
    }
}

export default Discord