const { Function } = require('../lib/')

Function({pattern: 'pp ?(.*)', fromMe: true, desc: 'set profile picture in any resolution', type: 'user'}, async (m) => {
if (!m.reply_message || !m.reply_message.image) return await m.reply('_Reply to a image._')
const media = await m.reply_message.downloadAndSaveMedia()
await m.updateProfilePicture(m.user_id, media)
await m.reply('_Successfully Profile Picture Updated_')
})

Function({pattern: 'gpp ?(.*)', fromMe: true, desc: 'set group icon in any resolution', type: 'group'}, async (m) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
if (!m.isBotAdmins) return await m.reply("I'm not an admin")
if (!m.reply_message || !m.reply_message.image) return await m.reply('_Reply to a image._')
const media = await m.reply_message.downloadAndSaveMedia()
await m.updateProfilePicture(m.jid, media)
await m.reply('_Successfully Group icon Updated_')
})
