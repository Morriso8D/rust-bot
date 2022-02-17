import {
    ButtonInteraction,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    MessageSelectOptionData,
    SelectMenuInteraction,
} from "discord.js"
import { ButtonComponent, Discord, SelectMenuComponent, Slash } from "discordx"
import Rcon from '@/services/rcon/Rcon'
import { isRconObject, isRconUndefined } from "@/helpers"
import { database, playerlist } from "@/types/interfaces"
import Kit from "./Kit"

const rcon = Rcon.singleton()

@Discord()
class WeeklyKit extends Kit{

    constructor(){
        super()
    }
    
    private playerlist : playerlist[] | undefined
    

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
        await this.validateLastUse(interaction.user.id, selectedKit)
        console.log('after >>>>>>>>>>')

        const playerlist = await rcon.sendAsync('playerlist', 29)

        if(isRconUndefined(playerlist)) return
        if(!isRconObject(playerlist)) return

        this.playerlist = JSON.parse(playerlist.Message)

        if( !this.playerlist || this.playerlist.length === 0){
            interaction.editReply('Oops! Looks like no one\'s online right now')
            return
        }

        const   menuOptions = this.buildPlayerlistMenuOptions(this.playerlist),
                row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('kit-playerlist-menu')
                            .setPlaceholder('No player selected')
                            .addOptions(menuOptions)
                    )
        
        interaction.editReply({content: 'Who should receive the kit?', components: [row]})
    }

    @SelectMenuComponent('kit-playerlist-menu')
    async handlePlayerlistMenu(interaction: SelectMenuInteraction) : Promise<unknown>{

        await interaction.deferReply({ephemeral: true})

        const playerId = interaction.values[0]

        if(!playerId) return interaction.followUp('invalid player, try again')

        if(!this.playerlist){
            return interaction.followUp('no players online, please try again later')
        }

        const playerName = this.playerlist.find( (player) => player.SteamID === playerId)?.DisplayName

        if(!playerName) return interaction.followUp('invalid player selection, try again')

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setDescription("You are about to give a kit to: `"+playerName+"`. Is that right?")
            .setFooter({text: 'Click the button to reedem the kit'})
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel("Yes")
                .setEmoji("👍")
                .setStyle("SUCCESS")
                .setCustomId("kit-yes-btn")
            )

        interaction.editReply({embeds: [embed], components: [row]})
    }

    @ButtonComponent('kit-yes-btn')
    async handleYesBtn(interaction: ButtonInteraction){
        interaction.reply(`📦 ${interaction.member} just redeemed a kit!`)
    }

    private buildPlayerlistMenuOptions(jsonPlayerlist: playerlist[]) : MessageSelectOptionData[]{
        return jsonPlayerlist.map((player) => {
            return { label: player.DisplayName, value: player.SteamID }
        })
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

    protected async validateLastUse(discordId : string, kit : string) : Promise<boolean> {
        const lastUse = await this.kitLogs.getLastUse(discordId, kit)
        
        return false
    }
}