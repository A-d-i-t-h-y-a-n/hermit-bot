const {Function,isPublic,addAudioMetaData,toAudio,getBuffer,getRandom,webp2mp4File,Take} = require('../lib/')
const {exec} = require("child_process")
const fs = require('fs')
const c = require ('../config')
Function({pattern: 'sticker ?(.*)', fromMe: isPublic, desc: 'Converts replied media to sticker', type: 'media'}, async (m, text, client) => {
if (!m.reply_message) return m.reply("_Reply to a photo or a short video!_")
if (/image/.test(m.mine)) {
let media = await client.sendImageAsSticker(m.chat, await m.reply_message.download(), m, { packname: c.STICKER_DATA.split(';')[0], author: c.STICKER_DATA.split(';')[1] })
await fs.unlinkSync(media)
} else if (/video/.test(m.mine)) {
if ((m.reply_message.msg || m.reply_message).seconds > 11) return m.reply('_Maximum 10 seconds!_')
let media = await client.sendVideoAsSticker(m.chat, await m.reply_message.download(), m, { packname: c.STICKER_DATA.split(';')[0], author: c.STICKER_DATA.split(';')[1] })
await fs.unlinkSync(media)
} else {return m.reply("_Reply to a photo or a short video!_")
}})
Function({pattern: 'mp3 ?(.*)', fromMe: isPublic, desc: 'Converts replied media to mp3 format', type: 'media'}, async (m, text, client) => {
if (/document/.test(m.mine) || !/video/.test(m.mine) && !/audio/.test(m.mine) || !m.reply_message) return m.reply('_Reply to a video/audio_')
let media = await m.reply_message.download()
let image = await getBuffer(c.AUDIO_DATA.split(';')[2])
let image_1 = await getBuffer('https://i.imgur.com/fj2WE83.jpeg')
let tumb = image || image_1
let writer = await addAudioMetaData(await toAudio(media, 'mp4'), tumb, c.AUDIO_DATA.split(';')[0], c.AUDIO_DATA.split(';')[1], 'Hermit Official')
await client.sendMessage(m.chat, { audio: Buffer.from(writer.arrayBuffer), mimetype: 'audio/mpeg' }, { quoted: m })
})
Function({pattern: 'take ?(.*)', fromMe: isPublic, desc: 'Change sticker or audio package name', type: 'media'}, async (m, text, client) => {
await Take(m, text, client)
})
Function({pattern: 'photo ?(.*)', fromMe: isPublic, desc: 'Converts non animated stickers to photo', type: 'media'}, async (m, text, client) => {
if (!m.reply_message || !/webp/.test(m.mine)) return m.reply("_Reply to a non animated sticker!_")
let media = await client.downloadAndSaveMediaMessage(m.reply_message)
let ran = await getRandom('.png')
exec(`ffmpeg -i ${media} ${ran}`, (err) => {
fs.unlinkSync(media)
if (err) return console.log(err)
let buffer = fs.readFileSync(ran)
client.sendMessage(m.chat, { image: buffer }, { quoted: m.quoted_message })
fs.unlinkSync(ran)
})})
Function({pattern: 'mp4 ?(.*)', fromMe: isPublic, desc: 'Converts animated stickers to video', type: 'media'}, async (m, text, client) => {
if (!m.reply_message || !/webp/.test(m.mine)) return m.reply("_Reply to a animated sticker!_")
let media = await client.downloadAndSaveMediaMessage(m.reply_message)
let webpToMp4 = await webp2mp4File(media)
await client.sendMessage(m.chat, { video: { url: webpToMp4.result }}, { quoted: m.quoted_message })
await fs.unlinkSync(media)
})

Function({pattern: 'gif ?(.*)', fromMe: isPublic, desc: 'Converts animated stickers to video', type: 'media'}, async (m, text, client) => {
if (!m.reply_message || !/webp/.test(m.mine)) return m.reply("_Reply to a animated sticker!_")
let media = await client.downloadAndSaveMediaMessage(m.reply_message)
let webpToMp4 = await webp2mp4File(media)
await client.sendMessage(m.chat, { video: { url: webpToMp4.result }, gifAttribution: 'TENOR', gifPlayback: true }, { quoted: m.quoted_message })
await fs.unlinkSync(media)
})
Function({pattern: 'attp ?(.*)', fromMe: isPublic, desc: 'Text to animated sticker', type: 'misc'}, async (m, text, client) => {
if(!text && !m.quoted) return m.reply("*Give me a text.*")
let match = text ? text : m.quoted && m.quoted.text ? m.quoted.text : text
await client.sendMessage(m.chat, { sticker: {url: `https://api.xteam.xyz/attp?file&text=${encodeURI(match)}`} }, { quoted: m})
}) 