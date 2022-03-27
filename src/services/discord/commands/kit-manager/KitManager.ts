import { CommandInteraction } from "discord.js"
import { Discord, Permission, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx"
import Config from '@/services/config/Config'
import Kits from "@/models/Kits"
import { Pagination, PaginationType } from "@discordx/pagination"
import { buildEmbedKits } from "./EmbedKits"

const   config = Config.singleton(),
        roleId = config.getKitManagerRoleId()

@Discord()
@Permission(false)
@Permission({id: roleId, type:'ROLE', permission: true})
@SlashGroup({ name: "kitmanager", description: "Manage permissions" })
@SlashGroup('kitmanager')
class AddKit{

    private kits = new Kits()

    @Slash('add', {description: 'Add a new kit'})
    async addHandler(
        @SlashOption('name', {description: 'kit\'s name'})
        name: string,
        @SlashOption('usage', {description: 'how often a kit can be redeemed (days)'})
        usage: number,
        @SlashOption('description', {description: '(maximum 120 characters)'})
        description: string,
        interaction : CommandInteraction
    ){
        await interaction.deferReply()
        
        try {

            const row = await this.kits.getKit(name)
            if(row.length) return interaction.editReply('⛔ kit name already exists')

            await this.kits.saveKit(name, usage, description)
            return interaction.editReply(`💾 \`${name}\` kit saved `)

        } catch (error) {
            console.log(error)
            return interaction.editReply('💀 oops! Something went wrong')
        }
    }

    @Slash('remove', {description: 'Remove a kit'})
    async removeHandler(
        @SlashOption('name', {description: 'kit\'s name'})
        name: string,
        interaction : CommandInteraction
    ){
        await interaction.deferReply()

        try {

            const response = await this.kits.deleteKit(name)
            if(response.affectedRows === 0) return interaction.editReply(`🤔 \`${name}\` kit couldn't be found`)
            if(response.affectedRows > 1) throw new Error('Invalid number of affected rows')
            return interaction.editReply('🗑️ kit removed')

        } catch (error) {
            console.log(error)
            return interaction.editReply('💀 oops! Something went wrong')
        }
        
    }

    @Slash('list', {description: 'List of kits'})
    async listHanlder(interaction : CommandInteraction){
        await interaction.deferReply()

        try {
            const response = await this.kits.getAllKitsWithItems()
            if(!response.size) return interaction.editReply('😒 couldn\'t find any kits...')
        
            const embeds = buildEmbedKits([...response.values()])

            if(!embeds) throw new Error('Failed to build embeds')

            const pagination = new Pagination(interaction, embeds, {
              onTimeout: () => {
                interaction.deleteReply();
              },
              start: {
                emoji: "🙂",
              },
              time: 30 * 1000,
              type: PaginationType.Button,
            });
        
            await pagination.send();

        } catch (error) {
            console.log(error)
            return interaction.editReply('💀 oops! Something went wrong')
        }
    }
}