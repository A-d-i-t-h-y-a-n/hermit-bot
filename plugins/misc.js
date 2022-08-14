// credit to mask sir
const {
	Function,
	isPublic
} = require("../lib/");

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
	let sender = 'https://wa.me/' + (m.reply_message.sender || m.mention[0] || text).split('@')[0];
	await m.reply(sender)
});
