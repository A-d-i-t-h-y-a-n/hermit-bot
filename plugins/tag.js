const {Function} = require('../lib/')
Function({pattern: 'tag ?(.*)', fromMe: true, type: 'group'}, async (m, text, client) => {
const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(e => {}) : ''
const participants = m.isGroup ? await groupMetadata.participants : ''
if (text == 'all') {
let msg = ''
let count = 1
for (let participant of participants) {
msg += `${count++} @${participant.id.split('@')[0]}\n`
}
await m.reply(msg, m.chat, {mentions: participants.map(a => a.id) })
} else if (text == 'admin' || text == 'admins') {
let admins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
let msg = ''
let count = 1
for (let admin of admins) {
msg += `${count++} @${admin.id.split('@')[0]}\n`
}
await m.reply(msg, m.chat, { mentions: admins.map(a => a.id)})
}
if (text || m.reply_message.text) return await m.reply(text || m.reply_message.text, m.chat, {mentions: participants.map(a => a.id) })
if (!m.reply_message) return await m.reply('_Example : \ntag all\ntag admin\ntag text\nReply to a message_')
await client.forwardMessage(m.chat, m.quoted_message, {contextInfo: { mentionedJid: participants.map(a => a.id)}})
})
