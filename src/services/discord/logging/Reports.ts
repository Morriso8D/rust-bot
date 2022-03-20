import { isRconObject, isRconReportMessage } from "@/helpers";
import { rconMessage, reportMessage } from "@/types/interfaces";
import { GuildBasedChannel, MessageEmbed } from "discord.js";
import { Client } from "discordx";
import Config from '@/services/config/Config'

const config = Config.singleton()

class Reports{

    public handler(message: rconMessage, client: Client | undefined){
        const reportMessage = this.parseRconMessage(message)
        if(!isRconReportMessage(reportMessage)) return
        const embedMessage = this.buildMessageEmebed(reportMessage)
        const channel = this.getDiscordChannel(client)
        if(!channel) return
        if(!channel.isText()){
            console.error(new Error(`channel is not text channel`))
            return
        }
        channel.send({embeds: [embedMessage]})
    }

    private parseRconMessage(message: rconMessage) : reportMessage | undefined{
        if(!isRconObject(message)) return

        try {

            return JSON.parse(message.Message)

        } catch (error) {

            console.error(error)
            return

        }
    }

    private buildMessageEmebed(reportMessage : reportMessage) : MessageEmbed{
        return new MessageEmbed()
        .setTitle(`Player Report`)
        .setColor('DARK_ORANGE')
        .setTimestamp()
        .setDescription(`Message: ${reportMessage.Message}`)
        .setFields([
            {name: 'Type', value: reportMessage.Type},
            {name: 'Subject', value: reportMessage.Subject},
            {name: 'Player Name', value: reportMessage.PlayerName},
            {name: 'Player ID', value: reportMessage.PlayerId},
            {name: 'Target Name', value: reportMessage.TargetName},
            {name: 'Target ID', value: reportMessage.TargetId},
        ])
    }

    private getDiscordChannel(client: Client | undefined) : GuildBasedChannel | undefined{
        if(!client){
            console.error(new Error(`received client of undefined`))
            return
        }

        const guild = client.guilds.cache.get(config.getGuildId())

        if(!guild){
            console.error(new Error(`received guild of undefined`))
            return
        }

        const channel = guild.channels.cache.get(config.getReportChannelId())

        if(!channel){
            console.error(new Error(`received channel of undefined`))
            return
        }

        return channel
    }
}

export default Reports