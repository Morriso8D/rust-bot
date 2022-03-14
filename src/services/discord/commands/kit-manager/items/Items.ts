import KitItems from "@/models/KitItems"
import Kits from "@/models/Kits"
import ItemList from "@/services/item-list/ItemList"
import { CommandInteraction } from "discord.js"
import { Discord, Slash, SlashGroup, SlashOption } from "discordx"

@Discord()
@SlashGroup({name: 'item', root: 'kitmanager', description: 'manage items within kits'})
@SlashGroup('item', 'kitmanager')
class Items{

    private kits = new Kits()
    private kitItems = new KitItems()
    private itemListService = ItemList.singleton()

    @Slash('add', {description: 'Add an item to a kit'})
    async addItemHandler(
        @SlashOption('kit', {description:'kit\'s name'})
        kitName : string,
        @SlashOption('item', {description:'item short-name'})
        item : string,
        @SlashOption('quantity', {description:'multiply item by (x)'})
        quantity : number,
        interaction: CommandInteraction
    ){
        await interaction.deferReply()

        try {
            const kit = await this.kits.getKit(kitName)

            if(!kit.length) return interaction.editReply(`⛔ kit name \`${kitName}\` doesn't exist`)
            if(!this.itemListService.hasShortName(item)) return this.sendInvalidItemResponse(item, interaction)

            await this.kitItems.saveItem(kit[0].id, item, quantity)
            return interaction.editReply(`💾 item saved`)

        } catch (error) {
            console.log(error)
            interaction.editReply('💀 oops! Something went wrong')
        }
    }

    @Slash('remove', {description:'Remove an item from a kit'})
    async removeItemHandler(
        @SlashOption('kit', {description:`kit's name`})
        kitName: string,
        @SlashOption('item', {description:`item short-name`})
        item: string,
        interaction : CommandInteraction
    ){
        await interaction.deferReply()

        try {
            const kit = await this.kits.getKit(kitName)

            if(!kit.length) return interaction.editReply(`⛔ kit name \`${kitName}\` doesn't exist`)
            if(!this.itemListService.hasShortName(item)) return this.sendInvalidItemResponse(item, interaction)

            await this.kitItems.deleteItem(kit[0].id, item)
            return interaction.editReply(`🗑️ item removed`)

        } catch (error) {
            console.log(error)
            interaction.editReply('💀 oops! Something went wrong')
        }
    }

    private sendInvalidItemResponse(item: string, interaction : CommandInteraction){
        const possibleMatches = this.itemListService.filterShortName(item)
        if(!possibleMatches.length) return interaction.editReply(`⛔ invalid item short-name: \`${item}\``)
        // send possible matches
        const matchStringArr = possibleMatches.map((item)=>{return `\`${item["Short Name"]}\``})
        return interaction.editReply(`⛔ invalid item short-name: \`${item}\`. Did you mean: \n ${matchStringArr.join(' ')}`)
    }
}