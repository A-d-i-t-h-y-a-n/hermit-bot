const {Function,ringtone,isPublic} = require("../lib/");
Function({pattern: 'ringtone ?(.*)', fromMe: isPublic, desc: 'download ringtone', type: 'download'}, async (message, match) => {
if (!match) return await message.reply('_Example : ringtone the box_')
const tone = await ringtone(match)
const res = tone[Math.floor(Math.random() * tone.length)]
await message.client.sendMessage(message.jid, { audio: { url: res.audio }, fileName: res.title+'.mp3', mimetype: 'audio/mpeg' }, { quoted: message.data })
})