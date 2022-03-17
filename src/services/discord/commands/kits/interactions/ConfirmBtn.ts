import KitLogs from "@/models/KitLogs";
import Kits from "@/models/Kits";
import CommandStore from "@/models/Store/CommandStore";
import Rcon from "@/services/rcon/Rcon";
import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { buildInvalidUsage } from "../Common";
import { validateLastUse } from "../Validation";

const commandStore = new CommandStore()
const kitLogs = new KitLogs()
const kits = new Kits()
const rcon = Rcon.singleton()

@Discord()
class ConfirmBtn {
     
    @ButtonComponent('kit-yes-btn')
    async handleYesBtn(interaction: ButtonInteraction){
        await interaction.deferReply()
        
        try {

            const   selectedKit = await commandStore.getSelectedKit(interaction.user.id),
                giveTo = await commandStore.getSelectedPlayer(interaction.user.id)

            if(!selectedKit || !giveTo) return interaction.editReply({content: `🤔 something went wrong... Try again later`})

            const validation = await validateLastUse(interaction.user.id, selectedKit)

            if(validation.valid === false && validation.timeLeft) return interaction.editReply({embeds: [ await buildInvalidUsage(validation.timeLeft, interaction)]})

            await kitLogs.saveKit(interaction.user.id, interaction.user.username, selectedKit)
            
            const  kitresponse = await kits.getKitWithItems(selectedKit),
                    kit = [...kitresponse.values()]

            for(let value of kit[0].items){
                const command = `inventory.giveto ${giveTo} ${value.item} ${value.quantity}`
                await rcon.sendAsync(command, 212)
            }
            
            interaction.editReply(`📦 ${interaction.member} just redeemed a kit using \`/kits\``)
            
        } catch (error) {
            console.log(error)
            interaction.editReply(`🤔 something went wrong. Message an admin for help`)
        }
    }
}