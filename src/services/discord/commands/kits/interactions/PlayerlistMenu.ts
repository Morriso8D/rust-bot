import {
    ButtonInteraction,
    SelectMenuInteraction,
} from "discord.js"
import { ButtonComponent, Discord, SelectMenuComponent } from "discordx"
import Rcon from '@/services/rcon/Rcon'
import { playerlist } from "@/types/interfaces"
import { buildButtonConfirmation, buildKitEmbedConfirmation, getPlayerlist } from "../Common"
import { validateLastUse } from "../Validation"

const rcon = Rcon.singleton()


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

        const embed = buildKitEmbedConfirmation(playerName)
        
        const row = buildButtonConfirmation()

        interaction.editReply({embeds: [embed], components: [row]})
    }

    @ButtonComponent('kit-yes-btn')
    async handleYesBtn(interaction: ButtonInteraction){
        /**
         * TODO:
         * - fetch selectedKit from redis
         */
        // validate kit usage
        // if(!(await validateLastUse(interaction.user.id, selectedKit))) return interaction.editReply({embeds: [buildInvalidWeeklyUsage()]})

        
        
        interaction.reply(`📦 ${interaction.member} just redeemed a kit!`)
    }
}