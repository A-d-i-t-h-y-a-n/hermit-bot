const {
	Function,
	isPublic,
	instagram,
	postJson,
	getUrl
} = require('../lib/')
Function({
	pattern: 'insta ?(.*)',
	fromMe: isPublic,
	desc: 'Instagram post or reel downloader',
	type: 'download'
}, async (message, match, client) => {
	match = getUrl(match || message.reply_message.text)
	if (!match) return await message.reply('_*Need instagram link!*_')
	const response = await instagram(match)
	if  (response.length < 1) {
		const { result, status } = await postJson('https://hermit-md.vercel.app/api/instagram', { url: match})
		if (status) response = result
	}
	if (response.length < 1) return await message.reply("*No media found!*")
	for (let i of response) {
		await message.client.sendFromUrl(message.chat, i, message.reply_message.data || message.data)
	}
})

Function({
	pattern: 'story ?(.*)',
	fromMe: isPublic,
	desc: 'Instagram story downloader',
	type: 'download'
}, async (message, match) => {
	try {
		match = match || message.reply_message.text
		if (!match) return await message.reply("*Give me a url or username.*")
		if (match === "" || (!match.includes("/stories/") && match.startsWith("http"))) return await message.reply("*Give me a url or username.*")
		if (match.includes("/stories/")) {
			const index = match.indexOf("/stories/") + 9
			const lastIndex = match.lastIndexOf("/")
			match = match.substring(lastIndex, index)
		}
		const response = await postJson(apiUrl + 'api/story', {
			username: match
		})
		if (!response.status) return await message.reply("*No media found!*")
		for (let i of response.result) {
			if (i.includes('mp4')) {
				await message.send(i, 'video', {
					quoted: message.reply_message.data || message.data
				})
			} else {
				await message.send(i, 'image', {
					quoted: message.reply_message.data || message.data
				})
			}
		}
	} catch (error) {
		console.log(error)
		await message.send('*_Failed to download_*\n_Server meybe down_\n_Please try again later_')
	}
})