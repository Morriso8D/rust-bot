import { playerlist } from "@/types/interfaces"
import { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from "discord.js"
import Rcon from '@/services/rcon/Rcon'
import { isRconObject, isRconUndefined } from "@/helpers"
import KitLogs from "@/models/KitLogs"

const rcon = Rcon.singleton()
const kitLogs = new KitLogs

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

export  function buildInvalidWeeklyUsage() : MessageEmbed{
    return new MessageEmbed()
        .setColor('DARK_RED')
        .setTitle('Failed to redeem kit')
        .setDescription("This kit can only be used once per map wipe")
}

export function buildKitEmbedConfirmation(playerName: string) : MessageEmbed{
    return new MessageEmbed()
            .setColor('#0099ff')
            .setDescription(`You are about to give a kit to: \`${playerName}\` Is that right?`)
            .setFooter({text: 'Click the button to reedem the kit'})
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

export async function saveKitLog(discordId : string, username: string, kit : string) : Promise<void> {
    const update = (await kitLogs.saveKit(discordId, username, kit))
}