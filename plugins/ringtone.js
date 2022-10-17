const {
	Function,
	ringtone,
	isPublic,
	prefix,
	parsedUrl
} = require("../lib/");
Function({
	pattern: 'ringtone ?(.*)',
	fromMe: isPublic,
	desc: 'download ringtone',
	type: 'download'
}, async (message, match) => {
	if (!match) return await message.reply('_Example : ringtone the box_')
	const res = await ringtone(match)
	const buttons = [];
	for (var main = 0; main < res.length; main++) {
		buttons.push({
			title: res[main].title,
			rowId: prefix + 'upload ' + res[main].audio
		})
	};
	const listMessage = {
		text: 'And ' + buttons.length + ' More Results...',
		title: res[0].title,
		buttonText: 'Select Ringtone',
		sections: [{
			title: 'Ringtone Downloader',
			rows: buttons
		}]
	};
	await message.client.sendMessage(message.jid, listMessage, {
		quoted: m.data
	})
})

Function({
	pattern: 'upload ?(.*)',
	fromMe: isPublic,
	desc: 'sendFromUrl',
	type: 'download'
}, async (message, match) => {
	match = match || message.reply_message.text
	if (!match) return await message.reply('_Missing Url!_')
	const Url = await parsedUrl(match)
	for (let url of Url) {
		await message.client.sendFromUrl(message.jid, url, message.data)
	}
})