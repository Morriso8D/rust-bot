import { chatMessage, reportMessage } from "./types/interfaces"

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