import { isRconObject } from '@/helpers'
import Rcon from '@/services/rcon/Rcon'
import { createInterface, Interface } from 'readline'


class Cli {

    private rcon : Rcon
    private static instance : Cli
    private readLine : Interface | undefined

    private constructor(){
        this.rcon = Rcon.singleton()
        this.readLine = createInterface({
            input: process.stdin,
            output: process.stdout
        })
        this.bindEvents()
    }

    static singleton(){
        if(!Cli.instance) Cli.instance = new Cli

        return Cli.instance
    }

    private bindEvents(){
        this.messageHandler()
        this.readLineHandler()
    }

    private messageHandler(){
        this.rcon.on('message', (message) => {
            // console.log('JSON >>>')
            // if(!isRconObject(message)) return
            // const { Message } = message
            // console.log(JSON.parse(Message))
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