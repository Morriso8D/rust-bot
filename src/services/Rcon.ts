import { client, connection } from 'websocket'
import { EventEmitter } from 'events'
import { rconCommand, rconMessage } from 'types/interfaces'

let instance : Rcon | null

interface Rcon {
    on(event: 'message', cb: (message: rconMessage ) => void): this
    on(event: 'connect', cb: () => void): this
    on(event: 'disconnect'): void
}

class Rcon extends EventEmitter{

    private rcon_ip : string | undefined
    private rcon_secret : string | undefined
    private rcon_port : string | undefined
    private websocket : client
    private connection : connection | undefined

    constructor(){
        super()

        this.rcon_ip = process.env.RCON_IP
        this.rcon_secret = process.env.RCON_SECRET
        this.rcon_port = process.env.RCON_PORT
        this.websocket = new client()
        
        this.bindEvents()
        this.websocket.connect(this.computeEndpoint())

    }

    static singleton() : Rcon {
        
        if(!instance){

            instance = new Rcon()

        }

        return instance

    }

    public send(command : string, identifier : number = -1 ) : void {

        if(!this.connection){
            console.log('typeof var "connection" is null')
            return
        }

        const payload : rconCommand = {
            Identifier: identifier,
            Message: command,
            Name: 'WebRcon'
        }

        console.log(payload)

        this.connection.sendUTF(JSON.stringify(payload))

    }

    public async sendAsync(command: string, identifier: number = -1 ) : Promise<rconMessage> {

        if(!this.connection) return new Promise( (reject) => reject('connection undefined'))

        this.send(command, identifier)

        return new Promise( (resolve, reject) => {
            this.connection!.once('message', (resp) => resolve(resp))
            this.connection!.once('error', (err) => reject(err))
        })

    }

    public reconnect() : void {

        this.websocket.connect(this.computeEndpoint())

    }

    private bindEvents() : void {

        this.websocket.on('connectFailed', (error) => {

            console.log(`connection failed: ${error}`)

        })

        this.websocket.on('connect', (connection) => {

            console.log(`connected to: ${this.rcon_ip}:${this.rcon_port}`)

            this.connection = connection
            
            this.emit('connect')
            this.handleMessage(connection)
            this.handleClose(connection)
            this.handleConnectionError(connection)
        })

    }

    private handleMessage(connection: connection) : void{
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
    }

    private handleClose(connection: connection) : void{
        connection.on('close', () => {

            console.log('connection closed')
            
            this.emit('disconnect')

            this.connection = undefined
    
        })
    }

    private handleConnectionError(connection: connection) : void{
        connection.on('error', (error) => {
        
            console.log(`connection error: ${error.toString()}`)

        })
    }

    private computeEndpoint() : string{

        return `ws://${this.rcon_ip}:${this.rcon_port}/${this.rcon_secret}`
    }
}

export default Rcon