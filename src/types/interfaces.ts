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

export interface reportMessage{
    PlayerId: string
    PlayerName: string
    TargetId: string
    TargetName: string
    Subject: string
    Message: string
    Type: string
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
        wipe_day: number | undefined
    }

    interface rcon{
        commands: commands | undefined
    }
    interface commands{
        online: boolean | undefined
        wipe: boolean | undefined
    }
    interface discord{
        guild_id: string
        kit_manager_role_id: string | undefined
        players_online: players_online | undefined
        logs: logs | undefined
        give_role_on_join: give_role_on_join | undefined
    }
    interface logs{
        chat_channel_id: string | undefined
        report_channel_id: string | undefined
    }
    interface players_online {
        chat_channel_id: string
    }
    interface give_role_on_join {
        role_name: string
    }
}

export namespace itemList{
    export interface json{
        "Display Name": string
        "Short Name": string
        "Item ID": number
        Description: string
        Stacksize: number
    }
}

export namespace database{
    export interface kitLogs{
        id: number
        user_id: number
        kit_id: number
        created_at: string
        updated_at: string
        name: string
    }
    export interface kit{
        id: number
        name: string
        usage: number
        description: string
        created_at: string
        updated_at: string
    }
    export interface kitWithItem extends kit{
        item: string
        quantity: number
    }
    export interface groupedKitWithItems extends kit{
        items: mappedItem[]
    }
    export interface mappedItem{
        item: string
        quantity: number
    }
    export interface alteredResponse{
        fieldCount: number
        affectedRows: number
        insertId: number
        serverStatus: number
        warningCount: number
        message: string
        protocol41: boolean
        changedRows: number
    }
    export interface kitCount{
        kit_count: number
    }
}