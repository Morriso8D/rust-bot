import Rcon from "@/services/rcon/Rcon";
import { CommandInteraction, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction } from "discord.js";
import { Discord, SelectMenuComponent, Slash } from "discordx";
import { buildInvalidWeeklyUsage, buildPlayerlistMenuOptions, getPlayerlist } from "../Common";
import { validateLastUse } from "../Validation";

const rcon = Rcon.singleton()

@Discord()
class Kits {

    @Slash('kits')
    async kits(interaction: CommandInteraction){
        await interaction.deferReply({ephemeral: true})

        const menuOptions = this.buildKitsMenuOptions(),
        row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('kits-menu')
                    .setPlaceholder('No kit selected')
                    .addOptions(menuOptions)
            )
        
        interaction.editReply({content: 'Select a kit', components: [row]})
    }

    @SelectMenuComponent('kits-menu')
    async handleKitsMenu(interaction: SelectMenuInteraction) : Promise<unknown>{

        await interaction.deferReply({ephemeral: true})

        const selectedKit = interaction.values[0]

        if(!selectedKit) return await interaction.followUp('invalid kit, please try again')

        // validate kit usage
        if(!(await validateLastUse(interaction.user.id, selectedKit))) return interaction.editReply({embeds: [buildInvalidWeeklyUsage()]})

        const playerlist = await getPlayerlist()

        if( !playerlist || playerlist.length === 0){
            return interaction.editReply('Oops! Looks like no one\'s online right now')
        }

        const row = buildPlayerlistMenuOptions(playerlist)
                
        interaction.editReply({content: 'Who should receive the kit?', components: [row]})
    }

    private buildKitsMenuOptions() : MessageSelectOptionData[]{
        return [
            {
                label: 'Weekly',
                value: 'weekly',
                description: 'A primitive weekly wipe kit'
            }
        ]
    }
}