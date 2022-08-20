const {Function,parsedJid} = require("../lib/");

Function({pattern: 'forward ?(.*)', fromMe: true, desc: 'forward replied msg', type: 'misc'}, async (message, match) => {
if (!message.reply_message) return await message.reply('_Reply to a message_')
for (let jid of parsedJid(match)) {
await message.client.forwardMessage(jid, m.quoted_message)}
})

Function({pattern: 'save ?(.*)', fromMe: true, desc: 'forward replied msg to u', type: 'misc'}, async (message, match) => {
if (!message.reply_message) return await message.reply('_Reply to a message_')
await message.client.forwardMessage(message.client.user.id, m.quoted_message)
})