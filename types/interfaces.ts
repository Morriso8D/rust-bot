export interface rconCommand {
    Identifier: Number,
    Message: string | object,
    Name: 'WebRcon'
}

export type rconMessage = JSON | string

export namespace config{

    export interface json{
        discord: discord | undefined
        cli: boolean | undefined
    }

    interface discord{
        players_online: boolean | undefined
        logs: logs | undefined
    }
    interface logs{
        chat_channel_id: string | undefined
    }
}