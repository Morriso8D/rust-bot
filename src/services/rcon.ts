import { client, connection } from 'websocket'
import { EventEmitter } from 'events'
import { rconCommand } from 'types/common/interfaces'

let instance : RCON | null

declare interface RCON {
    on(event: 'message', cb: (message: JSON | string) => void): this
    on(event: 'connect', cb: () => void): this
    on(event: 'disconnect'): void
}

class RCON extends EventEmitter{

    private rcon_ip : string | undefined
    private rcon_secret : string | undefined
    private rcon_port : string | undefined
    private websocket : client
    private connection : connection | null

    constructor(){
        super()

        this.rcon_ip = process.env.RCON_IP
        this.rcon_secret = process.env.RCON_SECRET
        this.rcon_port = process.env.RCON_PORT
        this.connection = null
        this.websocket = new client()
        
        this.setupEvents()
        this.websocket.connect(this.computeEndpoint())

    }

    static singleton() : RCON {
        
        if(!instance){

            instance = new RCON()

        }

        return instance

    }

    public send(command : string, identifier : number = -1 ) : void {

        const payload : rconCommand = {
            Identifier: identifier,
            Message: command,
            Name: 'WebRcon'
        }

        if(this.connection == null){
            console.log('typeof var "connection" is null')
            return
        }

        this.connection.sendUTF(JSON.stringify(payload))

    }

    public reconnect() : void {

        this.websocket.connect(this.computeEndpoint())

    }

    private setupEvents() : void {

        this.websocket.on('connectFailed', (error) => {

            console.log(`connection failed: ${error}`)

        })

        this.websocket.on('connect', (connection) => {

            console.log(`connected to: ${this.rcon_ip}:${this.rcon_port}`)

            this.connection = connection
            
            this.emit('connect')

            connection.on('message', (message) => {
                
                if(message.type === 'utf8'){

                    const { utf8Data } = message

                    let response : JSON | string
        
                    try {
    
                        response = JSON.parse(utf8Data)

                        this.emit('message', response)
        
                    } catch (error) {
        
                        // response is a string

                        response = utf8Data

                        this.emit('message', response)
                        
                    }
                }

            })

            connection.on('close', () => {

                console.log('connection closed')
                
                this.emit('disconnect')
                this.connection = null
        
            })
        
            connection.on('error', (error) => {
        
                console.log(`connection error: ${error.toString()}`)

            })

        })

    }

    private computeEndpoint() : string{

        return `ws://${this.rcon_ip}:${this.rcon_port}/${this.rcon_secret}`
    }
}

export default RCON