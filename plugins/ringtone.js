const {Function,ringtone,isPublic,prefix} = require("../lib/");
Function({pattern: 'ringtone ?(.*)', fromMe: isPublic, desc: 'download ringtone', type: 'download'}, async (message, match) => {
if (!match) return await message.reply('_Example : ringtone the box_')
const res = await ringtone(match)
const buttons = [];
for (var main = 0; main < res.length; main++) {
buttons.push({title: res[main].title, rowId: prefix+'sendFromUrl ' + res[main].audio})
}; 
const listMessage = {
text: 'And ' + buttons.length + ' More Results...',
title: res[0].title,
buttonText: 'Select Ringtone',
sections: [{title: 'Ringtone Downloader', rows: buttons}]
}
await message.client.sendMessage(message.jid, listMessage, { quoted: m.data })
})

Function({pattern: 'sendFromUrl ?(.*)', fromMe: isPublic, dontAddCommandList: true, desc: 'sendFromUrl', type: 'download'}, async (message, match) => {
if (!match) return await message.reply('*Missing Url! Failed to Download*')
await message.client.sendFromUrl(message.jid, match, '', m.data)
})