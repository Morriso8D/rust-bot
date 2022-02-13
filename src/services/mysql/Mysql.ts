import { createPool } from 'mysql'
import WaitPort from 'wait-port'

let instance : Mysql | undefined

class Mysql{

    public constructor(){
        this.init().then(() => {
            console.log('db built')
        })
    }

    public static singleton() : Mysql {
        if(!instance) instance = new Mysql
        return instance
    }

    public async init() : Promise<void>{
        const   host = process.env.MYSQL_HOST,
                user = process.env.MYSQL_USER,
                password = process.env.MYSQL_PASSWORD,
                database = process.env.MYSQL_DB

        await WaitPort({host, port : 3306})

        const pool = createPool({
            connectionLimit: 5,
            host,
            user,
            password,
            database
        })

        return new Promise((acc, rej) => {
            pool.query(
                'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)',
                err => {
                    if (err) return rej(err);
    
                    console.log(`Connected to mysql db at host ${host}`);
                    acc();
                },
            );
        });
    }
}

export default Mysql