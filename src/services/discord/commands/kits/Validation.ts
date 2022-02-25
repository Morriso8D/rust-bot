import KitLogs from "@/models/KitLogs"
import dayjs from "dayjs"
import * as config from "@/config.json"
import { config as configJson, database } from '@/types/interfaces'

const kitLogs = new KitLogs()

export async function validateLastUse(discordId : string, kit : string) : Promise<boolean> {
    const row = (await kitLogs.getLastUse(discordId, kit))

    if(!row.length) return true // kit hasnt been used

    let validLastUse : boolean = false

    switch (row[0].name) {
        case 'weekly':
            validLastUse = validateWeekly(row)
            break;
    
        default:
            break;
    }

    return validLastUse
}

function validateWeekly(row : [database.kitLogs]){
    const created_at = row[0].created_at,
        lastUse = dayjs(created_at),
        now = dayjs(),
        configObj : configJson.json = Object(config)

    if(!configObj.wipe_day){
        console.error(new Error('received config.wipe_day of undefined'))
        return false
    }
    
    const nextWipe = lastUse.day(configObj.wipe_day+7) // next wipe after using the kit

    if(now.diff(nextWipe,'days') >= 0) return true

    return false
}