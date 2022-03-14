import { Pool } from "mysql"
import { RedisClientType } from "redis"
import { database, reportMessage } from "./types/interfaces"

export function isRconObject(message: any) : message is object{
    if(typeof message === 'object') return true
    return false
}

export function isRconString(message: any) : message is string{
    if(typeof message !== 'string') return true
    return false
}

export function isRconUndefined(message: any) : message is undefined{
    if(typeof message !== 'undefined') return false

    console.error(new Error('received rconMessage of undefined'))
    return true
}

export function isDiscordClientUndefined(client: any) : client is undefined{
    if(typeof client !== 'undefined') return false
    return true
}

export function isRconReportMessage(message: any) : message is reportMessage{
    if(typeof message === 'object' && message.PlayerId && 
        message.PlayerName && message.TargetId && 
        message.TargetName && message.Subject && 
        message.Message && message.Type) return true

    return false
}

export function isMysqlConnected(conn: any) : conn is Pool{
    if(typeof (conn as Pool)?.config !== 'undefined') return true
    console.error(new Error('received mysql conn of undefined'))
    return false
}

export function isMysqlAlteredResponse(response: any) : response is database.alteredResponse{
    if(typeof (response as database.alteredResponse)?.affectedRows !== 'undefined') return true
    return false
}

export function isMysqlKitResponse(response: any) : response is database.kit[]{
    if(typeof(response[0] as database.kit)?.name !== 'undefined') return true
    return false
}

export function isMysqlKitWithItemResponse(response: any) : response is database.kitWithItem[]{
    if(typeof(response[0] as database.kitWithItem)?.item !== 'undefined') return true
    return false
}

export function isGroupedKitWithItems(response: any) : response is database.groupedKitWithItems[]{
    if(typeof(response[0] as database.groupedKitWithItems)?.items !== 'undefined') return true
    return false
}

export function isMysqlKitExistsResponse(response: any) : response is database.kitCount{
    if(typeof(response as database.kitCount)?.kit_count !== 'undefined') return true
    return false
}

export function isRedisConnected(client: any) : client is RedisClientType<any>{
    // if(typeof (client as RedisClientType<any>)?.CLIENT_GETNAME !== 'undefined') return true
    if(typeof client !== 'undefined') return true
    console.error(new Error('received redis client of undefined'))
    return false
}

export function WipeDaysRemaining(dayOfTheWeek: number, from : string | null = null) : number{
   let date

   if(from) date = new Date(from)
   else date = new Date()

    return (((dayOfTheWeek + 7 - date.getDay()) % 7) || 7)
}

export function nextWipe(dayOfTheWeek: number, from : string | null = null) : Date{
    let date

    if(from) date = new Date(from)
    else date = new Date()

    const remainingDays = WipeDaysRemaining(dayOfTheWeek, from)

    date.setDate(date.getDate() + remainingDays)
    return date;
}