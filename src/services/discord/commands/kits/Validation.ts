import KitLogs from "@/models/KitLogs"
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from "dayjs"
import Config from '@/services/config/Config'
import { database } from '@/types/interfaces'
import { nextWipe } from "@/helpers"

dayjs.extend(relativeTime)

const   kitLogs = new KitLogs(),
        config = Config.singleton()

/**
 * 
 * @param discordId 
 * @param kit 
 * @returns true on valid usage, otherwise returns number of days until next usage
 */
export async function validateLastUse(discordId : string, kit : string) : Promise<{valid : boolean, timeLeft: string | null}> {
    const row = (await kitLogs.getLastUse(discordId, kit))
    if(!row.length) return {valid: true, timeLeft: null} // kit never used
    if(validLastUse(row[0])) return {valid: true, timeLeft: null}

    return {valid: false, timeLeft: getTimeLeft(row[0])}
}

/**
 * 
 * @param param0 
 * @returns days left until next available
 */
function getTimeLeft({created_at, usage} : database.kitLogs) : string{
    const lastUse = dayjs(created_at),
        nextAvailable = lastUse.add(usage, 'day')

    return nextAvailable.fromNow()
}

function validLastUse({created_at, usage} : database.kitLogs) : boolean{
    const   lastUse = dayjs(created_at),
            now = dayjs(),
            nextAvailable = lastUse.add(usage, 'day')

            console.log(now.isAfter(nextAvailable))

    if(now.isAfter(nextAvailable)) return true

    return false
}

function validateWeekly(row : [database.kitLogs]){
    const   created_at = row[0].created_at,
            lastUse = dayjs(created_at),
            now = dayjs(),
            wipeDay = config.getWipeDay()

    if(!wipeDay){
        console.error(new Error('received config.wipe_day of undefined'))
        return false
    }

    const nextwipe = nextWipe(wipeDay, lastUse.toString())

    if(now.diff(nextwipe, 'days') >= 0) return true

    return false
}