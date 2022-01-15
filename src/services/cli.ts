import Rcon from './Rcon'
import { createInterface, Interface } from 'readline'

let instance : Cli | undefined

class Cli {

    private rcon : Rcon
    private readLine : Interface | undefined

    constructor(){
        this.rcon = Rcon.singleton()
        this.readLine = createInterface({
            input: process.stdin,
            output: process.stdout
        })
        this.bindEvents()
    }

    static singleton(){
        if(!instance) instance = new Cli

        return instance
    }

    private bindEvents(){
        this.messageHandler()
        this.readLineHandler()
    }

    private messageHandler(){
        this.rcon.on('messageJson', (message) => {
            console.log('JSON >>>')
            const { Message } = message
            console.log(JSON.parse(Message))
        })
    }

    private readLineHandler(){
        if(!this.readLine){
            console.error(new Error(`readLine is not defined`))
            return
        }
        
        this.readLine.on('line', (input) => {
            this.rcon.send(input, 999);
        })
    }
}

export default Cli