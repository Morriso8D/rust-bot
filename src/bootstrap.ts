import { readFileSync } from 'fs'

try {
    
    const config : JSON = JSON.parse(readFileSync('./config.json', 'utf8'))

    console.log(config)

} catch (err){

    console.error(err)

}