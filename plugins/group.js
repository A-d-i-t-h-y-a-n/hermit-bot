const {Function,isUrl} = require('../lib/')
async function isBotAdmins(m, client) {
const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(e => {}) : ''
const participants = m.isGroup ? await groupMetadata.participants : ''
const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
return m.isGroup ? groupAdmins.includes(m.user_id) : false
}
Function({pattern: 'add ?(.*)', fromMe: true, type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return m.reply('_This command only works in group chats_')
if (!isBotAdmins(m, client)) return m.reply("I'm not an admin")
if(!text && !m.quoted) return m.reply('Enter the number you want to add')
let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if(!users) return reply('Enter the number you want to add')
let v = await client.onWhatsApp(users);
n = v.map((n_jid) => n_jid.jid);
if (!n.includes(users)) return m.reply("This number doesn't exists on whatsapp");
let vs = await client.GroupParticipantsUpdate(m, users)
if (vs == '403') {
await client.sendMessage(m.chat, { text: `_Couldn't add. Invite sent!_`, mentions: [users] })
} else if (vs == '408') {
await client.sendMessage(m.chat, { text: `_Couldn't add @${users.split('@')[0]} because they left the group recently. Try again later._`, mentions: [users] }, { quoted: m })
} else if (vs == '401') {
await client.sendMessage(m.chat, { text: `_Couldn't add @${users.split('@')[0]} because they blocked the bot number._`, mentions: [users] }, { quoted: m })
}else if (vs == '200') {
await client.sendMessage(m.chat, { text: `@${users.split('@')[0]}, Added to The Group`, mentions: [users] })
} else {
await client.sendMessage(m.chat, { text: vs})
}})
Function({pattern: 'kick ?(.*)', fromMe: true, type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return m.reply('_This command only works in group chats_')
if (!isBotAdmins(m, client)) return m.reply("I'm not an admin")
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
let v = await client.onWhatsApp(users);
n = v.map((n_jid) => n_jid.jid);
if (!n.includes(users)) return m.reply("This number doesn't exists on whatsapp");
await client.sendMessage(m.chat, { text: `@${users.split('@')[0]}, Kicked From The Group`, mentions: [users] })
await client.groupParticipantsUpdate(m.chat, [users], 'remove')
})

Function({pattern: 'promote ?(.*)', fromMe: true, type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return m.reply('_This command only works in group chats_')
if (!isBotAdmins(m, client)) return m.reply("I'm not an admin")
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (!users) return m.reply('Need a participant')
let v = await client.onWhatsApp(users);
n = v.map((n_jid) => n_jid.jid);
if (!n.includes(users)) return m.reply("This number doesn't exists on whatsapp");
await client.groupParticipantsUpdate(m.chat, [users], 'promote')
await client.sendMessage(m.chat, { text: `@${users.split('@')[0]}, Is promoted as admin!`, mentions: [users] })
})
Function({pattern: 'demote ?(.*)', fromMe: true, type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return m.reply('_This command only works in group chats_')
if (!isBotAdmins(m, client)) return m.reply("I'm not an admin")
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (!users) return m.reply('Need a participant')
let v = await client.onWhatsApp(users);
n = v.map((n_jid) => n_jid.jid);
if (!n.includes(users)) return m.reply("This number doesn't exists on whatsapp");
await client.groupParticipantsUpdate(m.chat, [users], 'promote')
await client.sendMessage(m.chat, { text: `@${users.split('@')[0]}, Is promoted as admin!`, mentions: [users] })
})
Function({pattern: 'mute ?(.*)', fromMe: true, type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return m.reply('_This command only works in group chats_')
if (!isBotAdmins(m, client)) return m.reply("I'm not an admin")
await client.groupSettingUpdate(m.chat, 'announcement')
m.reply("Group muted. Only admins can send messages")
})
Function({pattern: 'unmute ?(.*)', fromMe: true, type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return m.reply('_This command only works in group chats_')
if (!isBotAdmins) return m.reply("I'm not an admin")
await client.groupSettingUpdate(m.chat, 'not_announcement')
m.reply('Group opened.')
})
Function({pattern: 'join ?(.*)', fromMe: true, type: 'group'}, async (m, text, client) => {
if (!text) return m.reply('Enter the group link!')
if (!isUrl(m.match[0]) && !m.match[0].includes('whatsapp.com')) return m.reply('Invalid Link!')
let result = m.match[0].split('https://chat.whatsapp.com/')[1]
let res = await client.groupAcceptInvite(result)
if (!res) return m.reply('_Invalid Group Link!_')
if (res) return m.reply('_Joined!_')
})
Function({pattern: 'left ?(.*)', fromMe: true, type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return m.reply('_This command only works in group chats_')
await client.groupLeave(m.chat)
})