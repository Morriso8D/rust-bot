import { isMysqlKitResponse } from "@/helpers";
import { database } from "@/types/interfaces";
import { PaginationItem } from "@discordx/pagination";
import { EmbedFieldData, MessageEmbed } from "discord.js";

export function buildEmbedKits(kits: database.groupedKitWithItems[]) : PaginationItem[] | undefined{

    const pagination = kits.map((kitrow, index) => {

        const page = {
            content: `Page: ${index + 1} of ${kits.length}`,
            embeds: [
                new MessageEmbed()
                .setColor('AQUA')
                .setTitle(kitrow.name)
                .setDescription(`Usage: ${kitrow.usage} day(s)`)
            ]
        }

        if(kitrow.items.length && typeof kitrow.items[0].item === 'string'){
            const fields : EmbedFieldData[] = []
            kitrow.items.forEach((item)=>{
                fields.push({name: item.item, value: `x ${String(item.quantity)}`})
            })

            page.embeds[0].addFields(fields)
        }

        return page
    })

    return pagination
}