const {Function,isPublic,Menu,RandomFancy} = require('../lib/');
const {BOT_INFO} = require('../config')

Function({pattern: 'menu ?(.*)', fromMe: isPublic, dontAddCommandList: false, type: 'misc'}, async (m, text, client) => {
const message= await RandomFancy(await Menu(m))
await client.sendMessage(m.chat, {
image: {url: `${BOT_INFO.split(";")[3]}` },
caption: `${message.trim()}`,
footer: `${BOT_INFO.split(";")[0]}`,
templateButtons: [{urlButton: {displayText: 'Github', url: 'https://github.com/A-d-i-t-h-y-a-n/hermit-md'}},{urlButton: {displayText: 'Contact Owner', url: `https://wa.me/${BOT_INFO.split(";")[2]}`}},{quickReplyButton: {displayText: 'Speed Test', id: 'ping'}},{quickReplyButton: {displayText: 'List Commands', id: 'list'}}]
})
});