import {
    SelectMenuInteraction,
} from "discord.js"
import { Discord, SelectMenuComponent } from "discordx"
import { buildButtonConfirmation, buildKitEmbedConfirmation, getPlayerlist } from "../Common"
import CommandStore from "@/models/Store/CommandStore"

let commandStore = new CommandStore()

@Discord()
class PlayerlistMenu{

    @SelectMenuComponent('kit-playerlist-menu')
    async handlePlayerlistMenu(interaction: SelectMenuInteraction) : Promise<unknown>{

        await interaction.deferReply({ephemeral: true})

        const playerId = interaction.values[0]

        if(!playerId) return interaction.followUp('invalid player, try again')

        const playerlist = await getPlayerlist()

        if(!playerlist || playerlist.length  === 0){
            return interaction.followUp('no players online, please try again later')
        }

        const playerName = playerlist.find( (player) => player.SteamID === playerId)?.DisplayName

        if(!playerName) return interaction.followUp('invalid player selection, try again')

        commandStore.saveSelectedPlayer(playerName, interaction.user.id)

        const embed = buildKitEmbedConfirmation(playerName)
        
        const row = buildButtonConfirmation()

        interaction.editReply({embeds: [embed], components: [row]})
    }
}