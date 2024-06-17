const {
	Function,
	dalle
} = require("../lib/");

Function({
	pattern: 'dalle ?(.*)',
	fromMe: true,
	desc: 'Dall-E ai image generation',
	type: 'ai'
}, async (message, match) => {
	if (!match) return await message.reply('*Need a prompt!*\n_Example: dalle starry sky over the city_')
	await message.send('*Generating image...*\n_It may take a while_')
	const image = await dalle(match)
	await message.send(image, 'image')
})