const {Function,Imgur,isPublic,Vector} = require("../lib/");
Function({pattern: 'url ?(.*)', fromMe: isPublic, desc: 'upload files to imgur.com', type: 'media'}, async (m, text, client) => {
if (!m.reply_message) return m.reply("_Reply to a video/image/audio!_")
if (/image/.test(m.mine)) {
const media = await m.reply_message.downloadAndSaveMedia()
const url = await Imgur(media)
await m.reply(url)
} else if (/video/.test(m.mine)) {
const media = await m.reply_message.downloadAndSaveMedia()
const url = await Imgur(media)
await m.reply(url)
} else if (/audio/.test(m.mine)) {
const media = await m.reply_message.downloadAndSaveMedia()
await Vector(media)
const url = await Imgur('./output.mp4')
await m.reply(url)
} else {return m.reply("_Reply to a video/image/audio!_")
}})