export interface rconCommand {
    Identifier: Number,
    Message: string | object,
    Name: 'WebRcon'
}

export type rconMessage = JSON | string