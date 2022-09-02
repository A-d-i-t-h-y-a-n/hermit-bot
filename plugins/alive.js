const {Function,isPublic,sendAlive,RandomFancy} = require("../lib/");
const config = require('../config')
Function({pattern: 'ping ?(.*)', fromMe: isPublic, desc: 'Bot response in second.', type: 'info'}, async (m, text, client) => {
  var start = new Date().getTime();
  var msg = await m.reply('*Testing Speed..*');
  var end = new Date().getTime();
  await m.reply('⟪ *Response in ' + (end - start) + ' msec* ⟫');
});

Function({pattern: 'alive ?(.*)', fromMe: isPublic, desc: 'Does bot work?', type: 'info'}, async (m, text, client) => {
  await sendAlive(client, m, text);
});
Function({pattern: 'jid ?(.*)', fromMe: isPublic, desc: 'to get remoteJid', type: 'whatsapp'}, async (m) => {
  await m.reply(m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.chat)
});
