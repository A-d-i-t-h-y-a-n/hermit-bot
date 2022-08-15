const {Function,isPublic,instagram,Story} = require('../lib/')
Function({pattern: 'insta ?(.*)', fromMe: isPublic, desc: 'Instagram post or reel downloader', type: 'download'}, async (m, text, client) => {
match = text || m.quoted.text || false
if(!match) return await m.reply('_*Need instagram link!*_')
if (match.includes("stories")) return await m.reply("_Use .story command!_")
var url = match.match(/(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/.+?)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/gm)
if (url == null) return await m.reply('_Need instagram link!_')
const res = await instagram(url[0])
if (res.length < 1) return await m.reply("*No media found!*")
for(let i of res){
await client.sendFromUrl(m.jid, i, m.data)
}
})
Function({pattern: 'story ?(.*)', fromMe: isPublic, desc: 'Instagram story downloader', type: 'download'}, async (m, text, client) => {
await Story(m, text)
})