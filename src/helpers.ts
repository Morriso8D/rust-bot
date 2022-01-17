import { chatMessage } from "./types/interfaces"

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