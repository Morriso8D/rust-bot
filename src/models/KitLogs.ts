import { isMysqlConnected } from "@/helpers";
import { database } from "@/types/interfaces";
import Model from "./Model";
import Users from "./Users";


class KitLogs extends Model{

    protected table = 'kit_logs'
    protected users : Users
    
    constructor(){
        super()
        this.users = new Users()
    }

    public getLastUse(discordId : string, kit : string) : Promise<[database.kitLogs]>{
        return new Promise( (resolve, reject) => {
            if(!isMysqlConnected(this.conn)) return reject()
            this.conn.query('SELECT kl.*, k.name, k.usage from kit_logs as kl LEFT JOIN users as u ON u.discord_id = ? LEFT JOIN kits as k ON k.name = ? WHERE kl.user_id = u.id AND kl.kit_id = k.id ORDER BY kl.updated_at DESC LIMIT 1', 
            [discordId, kit], (error, results) => {

                if(error) reject(error)

                resolve(results)
            })
        })
    }

    public saveKit(discordId : string, username: string, kit: string) : Promise<unknown>{
        return new Promise( async (resolve, reject) => {
            if(!isMysqlConnected(this.conn)) return reject()

            try {
                await this.users.saveUser(discordId, username)
            } catch (error) {
                reject(error)
            }

            this.conn.query('INSERT INTO kit_logs (user_id, kit_id) SELECT u.id, k.id FROM users as u RIGHT JOIN kits as k ON k.name = ? WHERE u.discord_id = ?', 
            [kit, discordId], (error, results) => {

                if(error) reject(error)

                resolve(results)
            })
        })
    }
}

export default KitLogs