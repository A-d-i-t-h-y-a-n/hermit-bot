const {Function,setAntiFake,antiFakeList,prefix} = require('../lib/')

Function({pattern: 'antifake ?(.*)', fromMe: true, desc: 'set antifake', type: 'group'}, async (m, match) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
if (!match) return await m.client.sendMessage(m.chat, { text: 'Antifake Manager', templateButtons: [{quickReplyButton: {displayText: 'OFF', id: prefix + 'antifake off'}},{quickReplyButton: {displayText: 'LIST', id: prefix + 'antifake list'}},{quickReplyButton: {displayText: 'ON', id: prefix + 'antifake on'}}]})
if (match == 'list') {
const List = await antiFakeList(m.jid)
if (!List) return await m.reply("_You don't set the Antifake yet.!_\n__To set:__ ```.antifake 1,44,972...```")
return await m.reply(await antiFakeList(m.jid))
}
if (match == 'on' || match == 'off') {
await setAntiFake(m.jid, match)
return await m.reply(`_Antifake ${match == 'on' ? 'Activated' : 'Deactivated'}_`)
}
await setAntiFake(m.jid, match)
return await m.reply('_Antifake Updated_')
})
