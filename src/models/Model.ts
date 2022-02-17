import { isMysqlConnected } from "@/helpers"
import Mysql from "@/services/mysql/Mysql"
import { Pool } from "mysql"


abstract class Model{

    protected conn: Pool | undefined
    protected abstract table: string

    constructor() {
       this.init()
    }

    private init(){
        Mysql.singleton().then((mysql) => {
            this.conn = mysql.conn
        }).catch(error => {console.error(error)})
    }

    public getAll() : Promise<unknown>{
        return new Promise((resolve, reject) => {
            if(!isMysqlConnected(this.conn)) return reject()
            this.conn.query('SELECT * FROM ?', [this.table], (error, results) => {
                if(error) reject(error)

                resolve(results)
            })
        })
    }
}

export default Model