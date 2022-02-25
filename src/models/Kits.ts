import { isMysqlConnected } from "@/helpers";
import { database } from "@/types/interfaces";
import Model from "./Model";


class Kits extends Model{
    
    protected table: string = 'kits'

    constructor(){
        super()
    }
    
    public getWeekly() : Promise<[database.kit]>{
        return new Promise((acc, rej)=>{    
            if(!isMysqlConnected(this.conn)) return rej()
            this.conn.query('SELECT * FROM kits WHERE name = "weekly" LIMIT 1', (err, results) => {
                if(err) return rej()

                acc(results)
            })
        })
    }
    
    
}

export default Kits