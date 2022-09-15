const {Function,isPublic,Menu,RandomFancy,prefix} = require('../lib/');
const {BOT_INFO} = require('../config')

Function({pattern: 'menu ?(.*)', fromMe: isPublic, dontAddCommandList: false, type: 'info'}, async (m, text, client) => {
const message= await RandomFancy(await Menu(m))
await client.sendMessage(m.chat, {
image: {url: `${BOT_INFO.split(";")[3]}` },
caption: `${message}`,
footer: `${BOT_INFO.split(";")[0]}`,
templateButtons: [{quickReplyButton: {displayText: 'Speed Test', id: prefix + 'ping'}},{quickReplyButton: {displayText: 'List Commands', id: prefix + 'list'}}]
})
});
