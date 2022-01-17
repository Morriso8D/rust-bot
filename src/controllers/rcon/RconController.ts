import { isRconObject } from "@/helpers"
import Rcon from "@/services/rcon/Rcon"
import PlayersOnline from "@/services/rcon/commmands/PlayersOnline"


class RconController{

    private rcon : Rcon
    private onlineCommand : boolean = false
    private playersOnline : PlayersOnline = new PlayersOnline

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
            }

           
        })
    }

    public runOnlineCommand() : void{
        console.log('building rcon online command...')
        this.onlineCommand = true
    }
}

export default RconController