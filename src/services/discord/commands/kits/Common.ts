import { playerlist } from "@/types/interfaces"
import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from "discord.js"
import Rcon from '@/services/rcon/Rcon'
import { isRconObject, isRconUndefined } from "@/helpers"

const rcon = Rcon.singleton()

export function buildPlayerlistMenuOptions(jsonPlayerlist: playerlist[]) : MessageActionRow{
    const menuOptions = jsonPlayerlist.map((player) => {
        return { label: player.DisplayName, value: player.SteamID }
    })
    return new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('kit-playerlist-menu')
                .setPlaceholder('No player selected')
                .addOptions(menuOptions)
        ) 
}

export  async function buildInvalidUsage(timeLeft: string, interaction : ButtonInteraction) : Promise<MessageEmbed>{

    return new MessageEmbed()
        .setColor('DARK_RED')
        .setTitle('Failed to redeem kit')
        .setDescription(`${interaction.member} this kit is available ${timeLeft}`)
}

export function buildKitEmbedConfirmation(playerName: string) : MessageEmbed{
    return new MessageEmbed()
            .setColor('#0099ff')
            .setDescription(`You are about to give a kit to: \`${playerName}\` Is that right?`)
            .setFooter({text: 'Click the button to redeem the kit'})
}

export function buildButtonConfirmation() : MessageActionRow {
    return new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel("Yes")
            .setEmoji("👍")
            .setStyle("SUCCESS")
            .setCustomId("kit-yes-btn")
        )
}

export async function getPlayerlist() : Promise<playerlist[] | undefined>{
        try {
            
            const playerlist = await rcon.sendAsync('playerlist', 29)

            if(isRconUndefined(playerlist)) return
            if(!isRconObject(playerlist)) return

            return JSON.parse(playerlist.Message)

        } catch (error) {
            console.error(error)
        }
}