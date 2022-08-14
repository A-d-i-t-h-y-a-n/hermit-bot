// credit to mask sir
const {
	Function,
	isPublic,
	getJson
} = require("../lib/");
const fs = require('fs');
Function({
	pattern: 'readmore ?(.*)',
	fromMe: isPublic,
	desc: 'Readmore generator',
	type: 'misc'
}, async (m, text, client) => {
	await m.reply(text.replace(/\+/g, (String.fromCharCode(8206)).repeat(4001)))
});

Function({
	pattern: 'wm ?(.*)',
	fromMe: isPublic,
	desc: 'wame generator',
	type: 'misc'
}, async (m, text, client) => {
	if (!m.reply_message.sender || m.mention || text) return await m.reply('_Need a Participant_');
	let sender = 'https://wa.me/' + (m.reply_message.sender || m.mention[0] || text).split('@')[0];
	await m.reply(sender)
});

Function({
	pattern: 'attp ?(.*)',
	fromMe: isPublic,
	desc: 'Text to animated sticker',
	type: 'misc'
}, async (m, text, client) => {
	if (!text && !m.quoted) return m.reply("*Give me a text.*")
	let match = text ? text : m.quoted && m.quoted.text ? m.quoted.text : text
	await client.sendMessage(m.chat, {
		sticker: {
			url: `https://api.xteam.xyz/attp?file&text=${encodeURI(match)}`
		}
	}, {
		quoted: m.data
	})
})

Function({
	pattern: 'emix ?(.*)',
	fromMe: isPublic,
	desc: 'emoji mix',
	type: 'search'
}, async (m, text) => {
	if (!text) return await m.reply('_Need Emoji!_\n*Example* : 🥸,😁')
	let [emoji1, emoji2] = text.split(',')
	if (!emoji1) return await m.reply('_Need 2 Emojis!_\n*Example* : 🥸,😁')
	if (!emoji2) return await m.reply('_Need 2 Emojis!_\n*Example* : 🥸,😁')
	const {
		results
	} = await getJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
	for (let res of results) {
		let media = await m.client.sendImageAsSticker(m.chat, res.url, m.data, {
			packname: emoji1,
			author: emoji2,
			categories: res.tags
		})
		await fs.unlinkSync(media)
	}
})