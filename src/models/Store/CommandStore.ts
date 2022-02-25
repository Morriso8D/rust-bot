import { isRedisConnected } from "@/helpers"
import Store from "./Store"

class CommandStore extends Store{

    protected selectedPlayer_prefix = 'selected_player_'
    protected kitSelected_prefix = 'selected_kit_'

    /**
     * saves the player selected from the playerlist menu
     */
    public saveSelectedPlayer(targetPlayer: string, userDiscordId : string) : Promise<void>{

        return new Promise(async(acc, rej) => {
            const   key = `${this.selectedPlayer_prefix}${userDiscordId}`

            if(!isRedisConnected(this.store)) return rej()
            await this.store.setEx(key, targetPlayer)
            acc()
        })
    }

    public saveSelectedKit(userDiscordId : string, kit : string) : Promise<void>{
        return new Promise(async(acc, rej) => {
            const key = `${this.kitSelected_prefix}${userDiscordId}`

            if(!isRedisConnected(this.store)) return rej()
            await this.store.setEx(key, kit)
            acc()
        })
    }

    public getSelectedPlayer(userDiscordId : string) : Promise<string | null>{
        return new Promise(async(acc, rej) => {
            const key = `${this.selectedPlayer_prefix}${userDiscordId}`

            if(!isRedisConnected(this.store)) return rej()
            const val = await this.store.get(key)
            acc(val)
        })
    }

    public getSelectedKit(userDiscordId : string) : Promise<string | null>{
        return new Promise(async(acc,rej) => {
            const key = `${this.kitSelected_prefix}${userDiscordId}`

            if(!isRedisConnected(this.store)) return rej()
            const val = await this.store.get(key)
            acc(val)
        })
    }
}

export default CommandStore