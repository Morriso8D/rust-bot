import { isRconObject, isRconUndefined } from "@/helpers";
import KitLogs from "@/models/KitLogs";
import Kits from "@/models/Kits";
import CommandStore from "@/models/Store/CommandStore";
import Rcon from "@/services/rcon/Rcon";
import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { buildInvalidWeeklyUsage } from "../Common";
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
        
        const   selectedKit = await commandStore.getSelectedKit(interaction.user.id),
                giveTo = await commandStore.getSelectedPlayer(interaction.user.id)

        if(!selectedKit || !giveTo) return interaction.editReply({content: `🤔 something went wrong... Try again later`})

        // validate kit usage
        // TODO:
        // - make the returned embed dynamically change based on the validation period (weekly, daily etc)
        if(!(await validateLastUse(interaction.user.id, selectedKit))) return interaction.editReply({embeds: [buildInvalidWeeklyUsage()]})

        await kitLogs.saveKit(interaction.user.id, interaction.user.username, selectedKit)
        // TODO:
        // getWeekly() to be replaced with a dynamic function which isn't time-period specific
        const   kit = await kits.getWeekly(),
                items = kit[0].items.split(',')

        let commandCount = 0

        items.forEach(async(value)=>{
            const command = `inventory.giveto ${giveTo} ${value}`,
            response = await rcon.sendAsync(command, 212)
            if(isRconUndefined(response)) return
            if(!isRconObject(response)) return
            console.log(response.Message)
            
            if(response.Message.indexOf('giving') !== -1) commandCount++
        })

        if(commandCount !== items.length) interaction.editReply(`🤔 something went wrong. Message an admin for help`)
        
        interaction.editReply(`📦 ${interaction.member} just redeemed a kit!`)
    }
}