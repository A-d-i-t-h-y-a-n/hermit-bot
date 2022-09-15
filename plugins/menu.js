const {
	Function,
	isPublic,
	Menu,
	RandomFancy,
	prefix,
	parsedUrl
} = require('../lib/');
const {
	BOT_INFO
} = require('../config')

Function({
	pattern: 'menu ?(.*)',
	fromMe: isPublic,
	type: 'info'
}, async (message, match, client) => {
	const menuMessage = await Menu(message)
	const msg = await RandomFancy(menuMessage)
	var img = await parsedUrl(BOT_INFO)
	if (img.length < 1) {
	img = ['https://i.imgur.com/qJUBCYm.jpeg']
	}
	const image = img[Math.floor(Math.random() * img.length)]
	const type = image.endsWith('mp4') ? 'video' : 'image'
	const buttonMessage = {
		[type]: {
			url: img
		},
		caption: `${msg}`,
		footer: `${BOT_INFO.split(";")[0] || ' '}`,
		buttons: [{
				buttonId: prefix + 'ping',
				buttonText: {
					displayText: 'Speed Test'
				},
				type: 1
			},
			{
				buttonId: prefix + 'list',
				buttonText: {
					displayText: 'List Commands'
				},
				type: 1
			}
		]
	}
	await message.client.sendMessage(message.chat, buttonMessage)
});
