import config from '@/config.json'
import { config as configInterface } from '@/types/interfaces'


class Config{

    private static instance : Config
    private all : configInterface.json

    public static singleton() : Config{

        if(!Config.instance){
            Config.instance = new Config()
        }

        return Config.instance
    }

    constructor(){
        this.all = config as configInterface.json
    }

    getAll() : configInterface.json {
        return this.all
    }

    getKitManagerRoleId() : string {
        return this.all.discord?.kit_manager_role_id || ''
    }

    getGuildId() : string {
        return this.all.discord?.guild_id || ''
    }

    getReportChannelId() : string {
        return this.all.discord?.logs?.report_channel_id || ''
    }

    getPlayersOnlineChannelId() : string {
        return this.all.discord?.players_online?.chat_channel_id || ''
    }

    getRoleNameOnGuildJoin() : string | undefined {
        return this.all.discord?.give_role_on_join?.role_name
    }

    getCliStatus() : boolean {
        return (this.all.cli) ? true : false
    }

    getRconCmdOnlineStatus() : boolean {
        return (this.all.rcon?.commands?.online) ? true : false
    }

    getRconCmdWipeStatus() : boolean {
        return (this.all.rcon?.commands?.wipe) ? true : false
    }

    getWipeDay() : number | undefined {
        return this.all.wipe_day
    }
}

export default Config