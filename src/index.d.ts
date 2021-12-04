export interface rconCommand {
    Identifier: Number,
    Message: string | object,
    Name: 'WebRcon'
}

export declare interface RCON{
    on(event: 'message', cb: (connection: JSON | string) => void): this
}