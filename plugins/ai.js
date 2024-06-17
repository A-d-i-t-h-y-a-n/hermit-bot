const {
	Function,
	dalle,
	bing
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

Function({
	pattern: 'bing ?(.*)',
	fromMe: true,
	desc: 'Microsoft bing ai',
	type: 'ai'
}, async (message, match) => {
	if (!match) return await message.reply('*Need a prompt!*\n_Example: bing what is the time now?_')
	const msg = await message.reply('_Thinking..._')
	const content = await bing(match)
	await msg.edit(content)
})