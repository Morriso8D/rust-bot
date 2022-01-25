export interface rconCommand {
    Identifier: Number,
    Message: string | object,
    Name: 'WebRcon'
}

export type rconMessage = message | string

interface message{
    Message: string
    Type: string
    Identifier: number
    Stacktrace: string | null
}

export interface chatMessage{
    Channel: number
    Message: string
    UserId: string
    Username: string
    Color: string
    Time: number
}

export interface playerlist{
    SteamID: string
    OwnerSteamID: string
    DisplayName: string
    Ping: number
    Address: string
    ConnectedSeconds: number
    VoiationLevel: number
    CurrentLevel: number
    UnspentXp: number
    Health: number
}

export namespace config{

    export interface json{
        discord: discord | undefined
        cli: boolean | undefined
        rcon: rcon | undefined
    }

    interface rcon{
        commands: commands | undefined
    }
    interface commands{
        online: boolean | undefined
        wipe: wipe | undefined
    }
    interface wipe{
        day_of_the_week: number | undefined
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