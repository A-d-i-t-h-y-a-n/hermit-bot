const {Function,isPublic,getUrl} = require("../lib/");
Function({pattern: 'ss ?(.*)', fromMe: isPublic, desc: 'Take website screenshot', type: 'download'}, async (message, match) => {
match = getUrl(match || message.reply_message.text)
if (!match) return await message.send('_Need a Url_\n*Example : ss https://hermit.koyeb.app/*')
await message.send('https://hermit-api.koyeb.app/screenshot?url=' + match, 'image')
})
Function({pattern: 'fullss ?(.*)', fromMe: isPublic, desc: 'Take website Full screenshot', type: 'download'}, async (message, match) => {
match = getUrl(match || message.reply_message.text)
if (!match) return await message.send('_Need a Url_\n*Example : fullss https://hermit.koyeb.app/*')
await message.send('https://hermit-api.koyeb.app/screenshot?full=true&url=' + match, 'image')
})