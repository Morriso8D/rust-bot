import { isMysqlConnected } from "@/helpers";
import Model from "./Model";



class KitItems extends Model{

    protected table: string = 'kit_items'
    
    constructor(){
        super()
    }

    public saveItem(kit_id: number, item: string, quantity: number) : Promise<unknown>{
        return new Promise((acc, rej)=>{
            if(!isMysqlConnected(this.conn)) return rej()
            this.conn.query('INSERT INTO kit_items (kit_id, item, quantity) VALUES(?,?,?)', [kit_id, item, quantity], (err, result)=>{
                if(err) rej(err)

                acc(result)
            })
        })
    }

    public deleteItem(kit_id: number, item: string) : Promise<unknown>{
        return new Promise((acc, rej)=>{
            if(!isMysqlConnected(this.conn)) return rej()
            this.conn.query('DELETE FROM kit_items WHERE kit_id = ? AND item = ?', [kit_id, item], (err, result)=>{
                if(err) rej(err)

                acc(result)
            })
        })
    }
}

export default KitItems