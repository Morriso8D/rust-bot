import type { ArgsOf } from "discordx";
import { Discord, On, Client } from "discordx";
import * as config  from '@/config.json'
import { config as configJson } from '@/types/interfaces'

const configObj : configJson.json = Object(config)

@Discord()
export abstract class AppDiscord {
  @On("messageDelete")
  onMessage([message]: ArgsOf<"messageDelete">, client: Client) {
    console.log("Message Deleted", client.user?.username, message.content);
  }
  @On('guildMemberAdd')
  onMemberAdd([member]: ArgsOf<'guildMemberAdd'>, client: Client) {
    if(!configObj.discord?.give_role_on_join) return

    const role = member.guild.roles.cache.find(role => role.name === configObj.discord?.give_role_on_join?.role_name)
    if(role) member.roles.add(role)
    else console.error(new Error(`couldn't find role with name: ${configObj.discord?.give_role_on_join?.role_name}`))
  }
}