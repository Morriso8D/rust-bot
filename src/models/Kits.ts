import { isMysqlAlteredResponse, isMysqlConnected, isMysqlKitExistsResponse, isMysqlKitResponse, isMysqlKitWithItemResponse } from "@/helpers";
import { database } from "@/types/interfaces";
import KitWithItems from "./KitWithItems";
import Model from "./Model";


class Kits extends Model{
    
    protected table: string = "kits"

    constructor(){
        super()
    }
    
    public getKitWithItems(name: string) : Promise<Map<string, KitWithItems>>{
        return new Promise((acc, rej)=>{    
            if(!isMysqlConnected(this.conn)) return rej()
            this.conn.query('SELECT kits.*, items.item as item, items.quantity as quantity FROM kits LEFT JOIN kit_items as items ON kits.id = items.kit_id WHERE kits.name = ?', [name], (err, results) => {
                if(err) return rej(err)
                if(!isMysqlKitWithItemResponse(results)) return rej('Invalid mysql response')

                const groupedKitWithItems : Map<string, KitWithItems> = new Map()

                results.forEach((kit)=>{

                    let group = groupedKitWithItems.get(String(kit.id))

                    if(!group){
                        group = new KitWithItems(kit)
                    }

                    group?.addItem({item: kit.item, quantity: kit.quantity})
                    groupedKitWithItems.set(String(kit.id), group)
                })

                acc(groupedKitWithItems)
            })
        })
    }

    public getAllKitsWithItems() : Promise<Map<string, KitWithItems>>{
        return new Promise((acc, rej)=>{
            if(!isMysqlConnected(this.conn)) return rej()
            this.conn.query('SELECT kits.*, items.item as item, items.quantity as quantity from kits LEFT JOIN kit_items as items ON kits.id = items.kit_id', (err, results) => {
                if(err) return rej(err)
                if(!(results as Array<any>).length) acc(new Map()) // no kits
                if(!isMysqlKitWithItemResponse(results)) return rej('Invalid mysql response')

                const groupedKitWithItems : Map<string, KitWithItems> = new Map()

                results.forEach((kit)=>{

                    let group = groupedKitWithItems.get(String(kit.id))

                    if(!group){
                        group = new KitWithItems(kit)
                    }

                    group?.addItem({item: kit.item, quantity: kit.quantity})
                    groupedKitWithItems.set(String(kit.id), group)
                })

                acc(groupedKitWithItems)
            })
        })
    }

    public getKit(name: string) : Promise<[database.kit]>{
        return new Promise((acc, rej)=>{
            if(!isMysqlConnected(this.conn)) return rej()
            this.conn.query('SELECT * FROM kits WHERE name = ? LIMIT 1', [name], (err, results) => {
                if(err) return rej(err)

                acc(results)
            })
        })
    }

    public kitExists(name: string) : Promise<boolean>{
        return new Promise((acc, rej)=>{
            if(!isMysqlConnected(this.conn)) return rej()
            this.conn.query('SELECT count(kits.name) kit_count FROM kits WHERE name = ?', [name], (err, results) => {
                if(err) return rej(err)
                if(!isMysqlKitExistsResponse(results[0])) return rej('Invalid mysql response')
                if(results[0].kit_count !== 1) return acc(false)

                acc(true)
            })
        })
    }

    public saveKit(name: string, usage: number, description: string) : Promise<unknown>{
        return new Promise((acc, rej)=>{
            if(!isMysqlConnected(this.conn)) return rej()
            this.conn.query('INSERT INTO kits (name, `usage`, description) VALUES(?, ?, ?)', [name, usage, description], (err, results) => {
                if(err) return rej(err)

                acc(results)
            })
        })
    }

    public deleteKit(name: string) : Promise<database.alteredResponse>{
        return new Promise((acc, rej)=>{
            if(!isMysqlConnected(this.conn)) return rej()
            this.conn.query('DELETE FROM kits where name = ?', [name], (err, results) => {
                if(err) return rej(err)

                if(!isMysqlAlteredResponse(results)) return rej('Invalid response')

                acc(results)
            })
        })
    }
}

export default Kits