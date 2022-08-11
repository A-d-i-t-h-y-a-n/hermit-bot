const { Function } = require('../lib/')
async function isBotAdmins(m) {
const groupMetadata = m.isGroup ? await m.client.groupMetadata(m.chat).catch(e => {}) : ''
const participants = m.isGroup ? await groupMetadata.participants : ''
const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
return m.isGroup ? groupAdmins.includes(m.user_id) : false
}
Function({pattern: 'pp ?(.*)', fromMe: true, desc: 'set profile picture in any resolution', type: 'user'}, async (m) => {
if (!m.reply_message || !m.reply_message.image) return await m.reply('_Reply to a image._')
const media = await m.reply_message.downloadAndSaveMedia()
await m.updateProfilePicture(m.user_id, media)
await m.reply('_Successfully Profile Picture Updated_')
})

Function({pattern: 'gpp ?(.*)', fromMe: true, desc: 'set group icon in any resolution', type: 'group'}, async (m) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
const isbotAdmin = await isBotAdmins(m)
if (!isBotAdmins) return await m.reply("I'm not an admin")
if (!m.reply_message || !m.reply_message.image) return await m.reply('_Reply to a image._')
const media = await m.reply_message.downloadAndSaveMedia()
await m.updateProfilePicture(m.jid, media)
await m.reply('_Successfully Group icon Updated_')
})
