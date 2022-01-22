import { isRconObject } from "@/helpers"
import Rcon from "@/services/rcon/Rcon"
import PlayersOnline from "@/services/rcon/commmands/PlayersOnline"
import NextWipe from "@/services/rcon/commmands/NextWipe"


class RconController{

    private rcon : Rcon
    private onlineCommand : boolean = false
    private nextWipeCommand : boolean = false
    private playersOnline : PlayersOnline = new PlayersOnline
    private nextWipe : NextWipe = new NextWipe

    constructor(){
        this.rcon = Rcon.singleton()
        this.bindEvents()
    }

    private bindEvents() : void{
        this.rcon.on('message', (message) => {
           if(!isRconObject(message)) return
           if(message.Type === 'Chat'){
            // run commands
                if(this.onlineCommand) this.playersOnline.handler(message)
                if(this.nextWipe) this.nextWipe.handler(message)
            }

           
        })
    }

    public runOnlineCommand() : void{
        console.log('building rcon online command...')
        this.onlineCommand = true
    }

    public runNextWipeCommand() : void{
        console.log('building next wipe command...')
        this.nextWipeCommand = true
    }
}

export default RconController