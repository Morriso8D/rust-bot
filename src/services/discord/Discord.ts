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
    private rcon : Rcon | undefined
    private embedMessage : Message | undefined

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

    private async embedPlayersOnline(playerList: playerlist[]): Promise<void>{

        if(!this.client){
            console.error(new Error('received client of undefined'))
            return
        }

        const configObj : configJson.json = Object(config),
            guild = this.client.guilds.cache.get(configObj.discord!.guild_id)
            
        if(!guild){
            console.error(new Error('received guild of undefined'))
            return
        }

        const channel = guild.channels.cache.get(configObj.discord!.players_online!.chat_channel_id)

        if(!channel){
            console.error(new Error('received channel of undefined'))
            return
        }

         
        if(!channel.isText()){
            console.error(new Error('channel is not a text channel'))
            return
        }

        let fields : EmbedFieldData[] = [] 

       if(playerList.length > 0){
            playerList.forEach((player) => {
                fields.push({name: player.DisplayName, value: `${player.ConnectedSeconds / 60} mins`, inline: true})
            })
       }else{
           fields.push({name: 'No one\'s online', value: ':('})
       }

        const embed = new MessageEmbed()
        .setColor('#00d26a')
        .setTitle('EU Cronch | Vanilla | Solo Duo Trio')
        .setDescription('Players online:')
        .addFields(fields)
        .setTimestamp()

        

        if(this.embedMessage){
            // edit previous message
            this.embedMessage.edit({embeds: [embed]})
        }else{
            // delete history and start fresh
            channel.messages.fetch({limit: 10}).then(messages => {
                messages.forEach(message => {
                    message.delete()
                })
            })

            this.embedMessage = await channel.send({embeds: [embed]})
        }

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

            this.embedPlayersOnline(jsonPlayerlist)

        }, (60000 * 5))
    }
}

export default Discord