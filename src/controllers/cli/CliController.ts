import Cli from '../../services/Cli'

class CliController{

    private cliService : Cli

    constructor(){
        console.log('building CLI...')
        this.cliService = Cli.singleton()
    }
}

export default CliController