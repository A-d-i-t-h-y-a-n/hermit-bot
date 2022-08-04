const {Function,Imgur,isPublic} = require("../lib/");
Function({pattern: 'url ?(.*)', fromMe: isPublic, desc: 'Converts replied media to sticker', type: 'media'}, async (m, text, client) => {
if (!m.reply_message) return m.reply("_Reply to a video/image!_")
if (/image/.test(m.mine)) {
const media = await client.downloadAndSaveMediaMessage(m.reply_message)
const url = await Imgur(media)
await m.reply(url)
} else if (/video/.test(m.mine)) {
const media = await client.downloadAndSaveMediaMessage(m.reply_message)
const url = await Imgur(media)
await m.reply(url)
} else {return m.reply("_Reply to a video/image!_")
}})