export interface rconCommand {
    Identifier: Number,
    Message: string | object,
    Name: 'WebRcon'
}

export type rconMessage = message | string

interface message{
    Message: any
}

export namespace config{

    export interface json{
        discord: discord | undefined
        cli: boolean | undefined
    }

    interface discord{
        guild_id: string
        players_online: players_online | undefined
        logs: logs | undefined
    }
    interface logs{
        chat_channel_id: string | undefined
    }
    interface players_online {
        chat_channel_id: string
    }
}