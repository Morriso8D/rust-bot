import Rcon from "@/services/rcon/Rcon"
import { Client } from "discordx"
import * as config from "@/config.json"
import { config as configJson, playerlist } from '@/types/interfaces'
import { isRconObject, isRconUndefined } from "@/helpers"
import { EmbedFieldData, Message, MessageEmbed } from "discord.js"

let embedMessage : Message | undefined

async function _embedPlayersOnline(playerList: playerlist[], client : Client): Promise<void>{

    if(!client){
        console.error(new Error('received client of undefined'))
        return
    }

    const configObj : configJson.json = Object(config),
        guild = client.guilds.cache.get(configObj.discord!.guild_id)
        
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

    let embeds : MessageEmbed[] =  []
    
    if(playerList.length > 0){

        // TESTING
        for(let i = 0; i<60; i++){
            playerList.push(playerList[0])
        }

        embeds = _buildMessageEmbeds(playerList)
        
    }

    else embeds = [new MessageEmbed()
        .setColor('#00d26a')
        .setTitle('EU Cronch | Vanilla | Solo Duo Trio')
        .setDescription('Players Online:')
        .addField('No one\'s online', ':(')
        .setTimestamp()]
    
    if(embedMessage){
        // edit previous message
        embedMessage.edit({embeds: embeds})
    }else{
        // delete history and start fresh
        channel.messages.fetch({limit: 10}).then(messages => {
            messages.forEach(message => {
                message.delete()
            })
        })

        embedMessage = await channel.send({embeds: embeds})
    }

}

function _buildMessageEmbeds(playerList: playerlist[]) : MessageEmbed[]{

    // chunk fields into groups of 25
    const chunkedArray = playerList.reduce((resultArray: EmbedFieldData[][], item, index) => { 
        const chunkIndex = Math.floor(index / 25)
      
        if(!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [] // start a new chunk
        }
      
        resultArray[chunkIndex].push({name: item.DisplayName, value: `${Math.ceil(item.ConnectedSeconds / 60)} mins`, inline: true})
      
        return resultArray
    }, [])

    const chunkedEmbed = chunkedArray.map((chunk, index) => {
        if(index === 0){
            return new MessageEmbed()
            .setColor('#00d26a')
            .setTitle('EU Cronch | Vanilla | Solo Duo Trio')
            .setDescription('Players online:')
            .addFields(chunk)
            .setFooter({text:`Page ${index + 1}`})
            .setTimestamp()
        }

        else return new MessageEmbed()
        .setColor('#00d26a')
        .setDescription('Players online:')
        .addFields(chunk)
        .setFooter({text:`Page ${index + 1}`})
        .setTimestamp()
    })

    return chunkedEmbed
}

export function setupPlayersOnline(client : Client) : void{

    const configObj : configJson.json = Object(config)

    const rcon = Rcon.singleton()

    setInterval(async () => {
        const playerlist = await rcon.sendAsync('playerlist', 255)

        if(isRconUndefined(playerlist)) return
        if(!isRconObject(playerlist)) return

        const {Message} = playerlist
        
        const jsonPlayerlist = JSON.parse(Message)

        if(!client){
            console.error('received client of undefined')
            return
        }

        const guild = client.guilds.cache.get(config.discord.guild_id)

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

        channel.edit({name: `🟢│${jsonPlayerlist.length}-online`, topic: `last updated: ${date}`}).then(()=>{
            console.log(date,'>> playerlist updated')
        }).catch((reason)=>{
            console.error(reason)
        })

        _embedPlayersOnline(jsonPlayerlist, client)

    }, (60000 * 5))
}