import Rcon from "@/services/rcon/Rcon"
import { Client } from "discordx"
import Config from '@/services/config/Config'
import { playerlist } from '@/types/interfaces'
import { isRconObject, isRconUndefined } from "@/helpers"
import { EmbedFieldData, Message, MessageEmbed } from "discord.js"

let embedMessage : Message | undefined
const config = Config.singleton()

async function _embedPlayersOnline(playerList: playerlist[], client : Client, serverName : string): Promise<void>{

    if(!client){
        console.error(new Error('received client of undefined'))
        return
    }

    const guild = client.guilds.cache.get(config.getGuildId())
        
    if(!guild){
        console.error(new Error('received guild of undefined'))
        return
    }

    const channel = guild.channels.cache.get(config.getPlayersOnlineChannelId())

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

        embeds = _buildMessageEmbeds(playerList, serverName)
        
    }

    else embeds = [new MessageEmbed()
        .setColor('#00d26a')
        .setTitle(serverName)
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

function _buildMessageEmbeds(playerList: playerlist[], serverName: string) : MessageEmbed[]{

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
            .setTitle(serverName)
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

    const rcon = Rcon.singleton()

    setInterval(async () => {
        try {

            const playerlist = await rcon.sendAsync('playerlist', 255)
            const servername = await rcon.sendAsync('server.hostname', 255)

            if(isRconUndefined(servername)) return
            if(!isRconObject(servername)) return
            if(isRconUndefined(playerlist)) return
            if(!isRconObject(playerlist)) return

            const {Message} = playerlist,
                {Message: serverStringWithCommand } = servername,
                serverString = serverStringWithCommand.split('server.hostname: "')[1].replace('"', '')
        
            const jsonPlayerlist = JSON.parse(Message)

            if(!client){
                console.error('received client of undefined')
                return
            }

            const guild = client.guilds.cache.get(config.getGuildId())

            if(!guild){
                console.error(new Error('received guild of undefined'))
                return
            }

            const channel = guild.channels.cache.get(config.getPlayersOnlineChannelId())

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

            _embedPlayersOnline(jsonPlayerlist, client, serverString)
            
        } catch (error) {
            console.log(error)
        }

    }, (60000 * 5))
}