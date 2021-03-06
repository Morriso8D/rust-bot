import { createPool, Pool } from 'mysql'
import WaitPort from 'wait-port'

class Mysql{

    public conn: Pool | undefined

    private static instance : Mysql

    private constructor(){
        
    }

    public static async singleton() {

            if(!Mysql.instance){
                Mysql.instance = new Mysql()
                await Mysql.instance.init()
            }
    
            return Mysql.instance
    }

    private async init() : Promise<void>{
        const   host = process.env.MYSQL_HOST,
                user = process.env.MYSQL_USER,
                password = process.env.MYSQL_PASSWORD,
                database = process.env.MYSQL_DB

        await WaitPort({host, port : 3306})

        this.conn = createPool({
            connectionLimit: 5,
            host,
            user,
            password,
            database
        })

        return new Promise((acc, rej) => {

            if(!this.conn) return rej(new Error('received mysql conn of undefined'))

            this.conn.query(
                'CREATE TABLE IF NOT EXISTS kit_logs (id int NOT NULL PRIMARY KEY AUTO_INCREMENT, user_id int, kit_id int, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)',
                err => {
                    if (err) return rej(err)
                },
            )
            this.conn.query(
                'CREATE TABLE IF NOT EXISTS users (id int NOT NULL PRIMARY KEY AUTO_INCREMENT, discord_id varchar(60) UNIQUE, username varchar(60), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)',
                err => {
                    if(err) return rej(err)
                }
            )
            this.conn.query(
                'CREATE TABLE IF NOT EXISTS kit_items (id int NOT NULL PRIMARY KEY AUTO_INCREMENT, kit_id int, item varchar(30), quantity int, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)',
                err => {
                    if(err) return rej(err)
                }
            )
            this.conn.query(
                'CREATE TABLE IF NOT EXISTS kits (id int NOT NULL PRIMARY KEY AUTO_INCREMENT, name varchar(120) UNIQUE, `usage` int, description varchar(120), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)',
                err => {
                    if(err) return rej(err)

                    console.log(`Connected to MySQL DB at host ${host}`);
                    acc();
                }
            )
        });
    }
}

export default Mysql