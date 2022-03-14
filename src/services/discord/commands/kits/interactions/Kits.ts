import { isMysqlKitResponse } from "@/helpers"
import Kits from "@/models/Kits"
import CommandStore from "@/models/Store/CommandStore"
import { CommandInteraction, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction } from "discord.js"
import { Discord, SelectMenuComponent, Slash } from "discordx"
import { buildPlayerlistMenuOptions, getPlayerlist } from "../Common"

const commandStore = new CommandStore()

@Discord()
class KitsInteraction {

    private kits = new Kits()

    @Slash('kits', {description: 'Redeem a kit'})
    async handleKits(interaction: CommandInteraction){
        try {
            await interaction.deferReply({ephemeral: true})
            const menuOptions = await this.buildKitsMenuOptions(),
            row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('kits-menu')
                        .setPlaceholder('No kit selected')
                        .addOptions(menuOptions)
                )
        
            interaction.editReply({content: 'Select a kit', components: [row]})
            
        } catch (error) {
            console.log(error)
            interaction.editReply(`💀 oops! Something went wrong`)
        }
    }

    @SelectMenuComponent('kits-menu')
    async handleKitsMenu(interaction: SelectMenuInteraction) : Promise<unknown>{

        await interaction.deferReply({ephemeral: true})

        const selectedKit = interaction.values[0]

        if(!selectedKit) return await interaction.followUp('invalid kit, please try again')

        const playerlist = await getPlayerlist()

        if( !playerlist || playerlist.length === 0){
            return interaction.editReply('Oops! Looks like no one\'s online right now')
        }

        await commandStore.saveSelectedKit(interaction.user.id, selectedKit)

        const row = buildPlayerlistMenuOptions(playerlist)
                
        interaction.editReply({content: 'Who should receive the kit?', components: [row]})
    }

    private async buildKitsMenuOptions() : Promise<MessageSelectOptionData[]>{

        const kits = await this.kits.getAll()
        if(!isMysqlKitResponse(kits)) throw new Error('Invalid mysql response')

        return kits.map(kit=>{
            return {
                label: kit.name,
                value: kit.name,
                description: kit.description
            }
        })
    }
}