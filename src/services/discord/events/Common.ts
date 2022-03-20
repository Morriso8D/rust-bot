import type { ArgsOf } from "discordx";
import { Discord, On, Client } from "discordx";
import Config from '@/services/config/Config'

const config = Config.singleton()

@Discord()
export abstract class AppDiscord {
  @On("messageDelete")
  onMessage([message]: ArgsOf<"messageDelete">, client: Client) {
    console.log("Message Deleted", client.user?.username, message.content)
  }
  
  @On('guildMemberAdd')
  onMemberAdd([member]: ArgsOf<'guildMemberAdd'>, client: Client) {
    const roleName = config.getRoleNameOnGuildJoin()

    if(!roleName) return

    const role = member.guild.roles.cache.find(role => role.name === roleName)
    if(role) member.roles.add(role)
    else console.error(new Error(`couldn't find role with name: ${roleName}`))
  }
}