const {
	Function,
	addAudioMetaData,
	isUrl,
	getBuffer,
	prefix,
	getString,
	isPublic,
	yta,
	ytv,
	ytIdRegex,
	getJson
} = require('../lib/');
const ffmpeg = require('fluent-ffmpeg')
const yts = require("yt-search")
const config = require('../config');
const Lang = getString('scrapers');
const fs = require('fs');
Function({
	pattern: 'song ?(.*)',
	fromMe: isPublic,
	desc: Lang.SONG_DESC,
	type: 'download'
}, async (message, match, client) => {
	match = match || message.reply_message.text
	if (!match) return message.reply(Lang.NEED_TEXT_SONG)
	if (isUrl(match) && match.includes('youtu')) {
		let ytId = ytIdRegex.exec(match)
		let media
		try {
			media = await yta('https://youtu.be/' + ytId[1], '128kbps')
		} catch (error) {
			media = await getJson(apiUrl + 'api/yta/' + ytId[1])
		}
		if (media.filesize >= 10000) return await message.client.sendMessage(message.chat, {
			audio: {
				url: media.dl_link
			},
			mimetype: 'audio/mpeg'
		}, {
			quoted: message.data
		})
		let thumb = await getBuffer(media.thumb)
		let writer = await addAudioMetaData(await getBuffer(media.dl_link), thumb, media.title, `${config.BOT_INFO.split(";")[0]}`, 'Hermit Official')
		await message.client.sendMessage(message.chat, {
			audio: writer,
			mimetype: 'audio/mpeg'
		}, {
			quoted: message.data
		})
		return;
	}
	let search = await yts(match)
	if (search.all.length < 1) return await message.reply(Lang.NO_RESULT);
	let listbutton = [];
	let no = 1;
	for (var z of search.videos) {
		let button = {
			title: 'Result - ' + no++ + ' ',
			rows: [{
				title: z.title,
				rowId: prefix + 'song ' + z.url
			}]
		};
		listbutton.push(button)
	};
	const listMessage = {
		text: `And ${listbutton.length} More Results...`,
		title: search.videos[0].title,
		buttonText: 'Select song',
		sections: listbutton
	}
	await client.sendMessage(message.chat, listMessage, {
		quoted: message.data
	})
});

Function({
	pattern: 'video ?(.*)',
	fromMe: isPublic,
	desc: Lang.VIDEO_DESC,
	type: 'download'
}, async (message, match, client) => {
	match = match || message.reply_message.text
	if (!match) return message.reply('_Need youtube video link!_')
	match = match.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))
	if (!match) return message.reply('_Need youtube video link!_')
	let ytId = ytIdRegex.exec(match)
	let quality = message.match[1] ? message.match[1] : '360p'
	let media
	try {
		media = await ytv('https://youtu.be/' + ytId[1], quality)
	} catch (error) {
		media = await getJson(apiUrl + 'api/ytv/' + ytId[1] + '?quality=' + quality)
	}
	if (media.filesize >= 100000) return message.reply('_Unable to download video_')
	await client.sendMessage(message.chat, {
		video: await getBuffer(media.dl_link),
		mimetype: 'video/mp4',
		caption: media.title
	})
});

Function({
	pattern: 'yta ?(.*)',
	fromMe: isPublic,
	desc: 'download audios from youtube',
	type: 'download'
}, async (message, match, client) => {
	match = match || message.reply_message.text
	if (!match) return message.reply('_Need url or song name!_\n*Example: .yta url/song name*')
	if (isUrl(match) && match.includes('youtu')) {
		const ytId = ytIdRegex.exec(match)
		let result
		try {
			result = await yta('https://youtu.be/' + ytId[1], '128kbps')
		} catch (error) {
			result = await getJson(apiUrl + 'api/yta/' + ytId[1])
		}
		if (result.filesize >= 10000) return await message.client.sendMessage(message.jid, {
			audio: await getBuffer(result.dl_link),
			mimetype: 'audio/mpeg'
		}, {
			quoted: message.data
		})
		const thumbnail = await getBuffer(result.thumb)
		const file = await addAudioMetaData(await getBuffer(result.dl_link), thumbnail, result.title, `${config.BOT_INFO.split(";")[0]}`, 'Hermit Official')
		return await message.client.sendMessage(message.jid, {
			audio: file,
			mimetype: 'audio/mpeg'
		}, {
			quoted: message.data
		})
	}
	const search = await yts(match)
	if (search.all.length < 1) return await message.reply('_Not Found_');
	const result = await yta(search.videos[0].url, '128kbps')
	const thumbnail = await getBuffer(result.thumb)
	if (result.filesize >= 10000) return await message.client.sendMessage(message.jid, {
		audio: await getBuffer(result.dl_link),
		mimetype: 'audio/mpeg'
	}, {
		quoted: message.data
	})
	const file = await addAudioMetaData(await getBuffer(result.dl_link), thumbnail, result.title, `${config.BOT_INFO.split(";")[0]}`, 'Hermit Official')
	return await message.client.sendMessage(message.jid, {
		audio: file,
		mimetype: 'audio/mpeg'
	}, {
		quoted: message.data
	})
});

Function({
	pattern: 'ytv ?(.*)',
	fromMe: isPublic,
	desc: 'download videos from youtube',
	type: 'download'
}, async (message, match, client) => {
	match = match || message.reply_message.text
	if (!match) return message.reply('_Need url or video name!_\n*Example: .ytv url/video name*')
	if (isUrl(match) && match.includes('youtu')) {
		const ytId = ytIdRegex.exec(match)
		var quality = match.match('\\{([a-z0-9]+)\\}')
		if (quality) {
			quality = quality[1]
		}
		let result
		try {
			result = await ytv('https://youtu.be/' + ytId[1], quality || '360p')
		} catch (error) {
			result = await getJson(apiUrl + 'api/ytv/' + ytId[1] + '?quality=' + quality)
		}
		if (result.filesize > 100000) {
			const url = await getJson('https://tinyurl.com/api-create.php?url=' + result.dl_link)
			return await message.reply('*Failed to Download*\n_File size is more is than 100MB_\nClick this url to download manually : ' + url)
		}
		var isfile = match.match('\\{([a-z0-9]+)\\}')
		if (quality) {
			return await message.client.sendMessage(message.jid, {
				video: await getBuffer(result.dl_link),
				mimetype: 'video/mp4',
				caption: result.title
			}, {
				quoted: message.data
			})
		}
		const sections = [{
			title: result.title,
			rows: [{
					title: '1080p',
					description: result.list['1080p'],
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {1080p}`
				},
				{
					title: '720p',
					description: result.list['720p'],
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {720p}`
				},
				{
					title: '480p',
					description: result.list['480p'],
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {480p}`
				},
				{
					title: '360p',
					description: result.list['360p'],
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {360p}`
				},
				{
					title: '240p',
					description: result.list['240p'],
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {240p}`
				},
				{
					title: '144p',
					description: result.list['144p'],
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {144p}`
				}
			]
		}]
		const listMessage = {
			text: 'Select The Quality Below',
			title: result.title,
			buttonText: 'Select Quality',
			sections: sections
		}
		return await message.client.sendMessage(message.jid, listMessage);
	}
	const search = await yts(match)
	if (search.all.length < 1) return await message.reply('_Not Found_');
	const result = await ytv(search.videos[0].url, '360p')
	if (result.filesize > 100000) {
		const url = await getJson('https://tinyurl.com/api-create.php?url=' + result.dl_link)
		return await message.reply('*Failed to Download*\n_File size is more is than 100MB_\nClick this url to download manually : ' + url)
	}
	return await message.client.sendMessage(message.jid, {
		video: await getBuffer(result.dl_link),
		mimetype: 'video/mp4',
		caption: result.title
	}, {
		quoted: message.data
	})
});