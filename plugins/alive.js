const {Function,isPublic,sendAlive,RandomFancy} = require("../lib/");
const config = require('../config')
Function({pattern: 'ping ?(.*)', fromMe: isPublic, desc: 'Bot response in second.', type: 'misc'}, async (m, text, client) => {
  var start = new Date().getTime();
  var msg = await m.reply(await RandomFancy('Testing Speed..'));
  var end = new Date().getTime();
  await m.reply(await RandomFancy('Response in ' + (end - start) + 'msec'));
});

Function({pattern: 'alive ?(.*)', fromMe: isPublic, desc: 'Does bot work?', type: 'misc'}, async (m, text, client) => {
  await sendAlive(client, m, text);
});
Function({pattern: 'jid ?(.*)', fromMe: isPublic, desc: 'to get remoteJid' type: 'misc'}, async (m) => {
  await m.reply(m.jid)
});