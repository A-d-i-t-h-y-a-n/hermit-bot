const {addAudioMetaData,isUrl,getBuffer,generateListYTS,getString,Function,isPublic,yta,ytv,ytIdRegex,sendwithLinkpreview,sendQualityList,y2mate,fromBuffer} = require('../lib/');
const ffmpeg = require('fluent-ffmpeg')
const yts = require("yt-search")
const config = require('../config');
const Lang = getString('scrapers');
const fs = require('fs');
Function({pattern: 'song ?(.*)', fromMe: isPublic, desc: Lang.SONG_DESC, type: 'download'}, async (m, text, client) => { 
if(!text) return m.reply(Lang.NEED_TEXT_SONG)
if (isUrl(text) && text.includes('youtu')) {
let ytId = ytIdRegex.exec(text)
let media = await yta('https://youtu.be/' + ytId[1], '128kbps')
let thumb = await getBuffer(media.thumb)
if (media.filesize >= 10000) return await sendwithLinkpreview(client, m.data, media.dl_link, 'https://www.youtube.com/watch?v=' + ytId[1])
let title = media.title.replaceAll(' ', '+').replaceAll('/', '');
ffmpeg(media.dl_link)
        .save('./' + title + '.mp3')
        .on('end', async () => {
let writer = await addAudioMetaData(fs.readFileSync('./' + title + '.mp3'), thumb, media.title, `${config.BOT_INFO.split(";")[0]}`, 'Hermit Official')
fs.unlinkSync('./' + title + '.mp3')
await sendwithLinkpreview(client, m.data, Buffer.from(writer.arrayBuffer), 'https://www.youtube.com/watch?v=' + ytId[1])
});
return;
}
let search = await yts(text)
if (search.all.length < 1) return await m.reply(Lang.NO_RESULT);
let list = await generateListYTS(search)
const listMessage = {
text: `And ${list.length} More Results...`,
title: search.videos[0].title,
buttonText: 'Select song',
sections: list
}
await client.sendMessage(m.chat, listMessage, { quoted: m.data })
});

Function({pattern: 'video ?(.*)', fromMe: isPublic, desc: Lang.VIDEO_DESC, type: 'download'}, async (m, text, client) => { 
let ytmp4text = text || m.quoted.text || false
let textvideo = ytmp4text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))
if(!textvideo) return m.reply(Lang.NEED_VIDEO)
let ytId = ytIdRegex.exec(textvideo)
let quality = m.match[1] ? m.match[1] : '360p'
let media = await ytv('https://youtu.be/' + ytId[1], quality)
if (media.filesize >= 100000) return m.reply('_Unable to download video_')
await client.sendMessage(m.chat, { video: await fromBuffer(media.dl_link), mimetype: 'video/mp4', caption: media.title})
});