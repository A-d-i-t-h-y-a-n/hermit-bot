const {Function,isPublic} = require("../lib/");
Function({pattern: 'delete ?(.*)', fromMe: isPublic, desc: 'delete message that sended by bot', type: 'misc'}, async (m, text, client) => {
client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } })
})