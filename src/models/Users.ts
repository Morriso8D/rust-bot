import { isMysqlConnected } from "@/helpers";
import Model from "./Model";

class Users extends Model{

    protected table = 'users';

    constructor(){
        super()
    }

    public saveUser(discordId: string, username: string) : Promise<unknown>{
        return new Promise( (resolve, reject) => {
            if(!isMysqlConnected(this.conn)) return reject
            this.conn.query('INSERT IGNORE INTO users (discord_id, username) VALUES(?, ?)', 
            [discordId, username], (error, results) => {
                if(error) reject(error)

                resolve(results)
            })
        })
    }

}

export default Users