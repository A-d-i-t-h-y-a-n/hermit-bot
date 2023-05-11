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
	yt,
	ytIdRegex,
	getJson,
	sendwithLinkpreview
} = require('../lib/');
const { downloadYouTubeVideo, downloadYouTubeAudio, mixAudioAndVideo, combineYouTubeVideoAndAudio } = require('../lib/youtubei.js');
const ffmpeg = require('fluent-ffmpeg')
const yts = require("yt-search")
const config = require('../config');
const Lang = getString('scrapers');
const fs = require('fs');

const send = async (message, file, id) => config.SONG_THUMBNAIL ? await sendwithLinkpreview(message.client, message, file,  'https://www.youtube.com/watch?v=' + id) : await message.client.sendMessage(message.chat, { audio: file, mimetype: 'audio/mpeg' }, { quoted: message.data });

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
		const media = await downloadYouTubeAudio(ytId[1])
		if (media.bitrate >= 10000) return await send(message, await fs.readFileSync(media.file), ytId[1])
		const thumb = await getBuffer(media.thumb)
		const writer = await addAudioMetaData(await fs.readFileSync(media.file), thumb, media.title, `${config.BOT_INFO.split(";")[0]}`, 'Hermit Official')
		return await send(message, writer, ytId[1])
	}
	const search = await yts(match)
	if (search.all.length < 1) return await message.reply(Lang.NO_RESULT);
	const listbutton = [];
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
		title: search.videos[0].title,
		buttonText: 'Select song',
		sections: listbutton
	}
	await message.send(`And ${listbutton.length} More Results...`, 'text', {
		quoted: message.data,
		...listMessage
	})
});

Function({
	pattern: 'video ?(.*)',
	fromMe: isPublic,
	desc: Lang.VIDEO_DESC,
	type: 'download'
}, async (message, match, client) => {
	match = match || message.reply_message.text
	if (!match) return message.reply('*Need Youtube video url or query*')
	if (isUrl(match) && match.includes('youtu')) {
		const id = ytIdRegex.exec(match)
		const result = await ytv('https://youtu.be/' + id[1], '360p');
		if (!result) return await message.reply('_Failed to download_')
		return await message.send(result.dl_link, 'video', { quoted: message.data, caption: result.title });
	}
	const search = await yts(match)
	if (search.all.length < 1) return await message.reply(Lang.NO_RESULT);
	const listbutton = [];
	var num = 1;
	for (let x of search.videos) {
		let button = {
			title: 'Result - ' + num++ + ' ',
			rows: [{
				title: x.title,
				rowId: prefix + 'video ' + x.url
			}]
		};
		listbutton.push(button)
	};
	const listMessage = {
		title: search.videos[0].title,
		buttonText: 'Select video',
		sections: listbutton
	}
	return await message.send(`And ${listbutton.length} More Results...`, 'text', { quoted: message.data, ...listMessage });
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
		const result = await downloadYouTubeAudio(ytId[1])
		if (result.bitrate >= 10000) return await message.client.sendMessage(message.jid, { audio: await fs.readFileSync(result.file), mimetype: 'audio/mpeg'}, {quoted: message.data})
		const thumbnail = await getBuffer(result.thumb)
		const file = await addAudioMetaData(await fs.readFileSync(result.file), thumbnail, result.title, `${config.BOT_INFO.split(";")[0]}`, 'Hermit Official')
		return await message.client.sendMessage(message.jid, {audio: file, mimetype: 'audio/mpeg'}, {quoted: message.data})
	}
	const search = await yts(match)
	if (search.all.length < 1) return await message.reply('_Not Found_');
	const result = await downloadYouTubeAudio(search.videos[0].videoId)
	const thumbnail = await getBuffer(result.thumb)
	if (result.bitrate >= 10000) return await message.client.sendMessage(message.jid, {audio: await fs.readFileSync(result.file), mimetype: 'audio/mpeg'}, {quoted: message.data})
	const file = await addAudioMetaData(await fs.readFileSync(result.file), thumbnail, result.title, `${config.BOT_INFO.split(";")[0]}`, 'Hermit Official')
	return await message.client.sendMessage(message.jid, {audio: await fs.readFileSync(result.file), mimetype: 'audio/mpeg'}, {quoted: message.data})
});

Function({
	pattern: 'ytv ?(.*)',
	fromMe: isPublic,
	desc: 'download videos from youtube',
	type: 'download'
}, async (message, match, client) => {
	try {
		match = match || message.reply_message.text
		if (!match) return message.reply('_Need url or video name!_\n*Example: .ytv url/video name*')
		if (isUrl(match) && match.includes('youtu')) {
			const ytId = ytIdRegex.exec(match)
			var quality = match.match('\\{([a-z0-9]+)\\}')
			if (quality) {
				quality = quality[1]
			}
			const resol = quality || '360p'
			let result
			try {
				result = await yt('https://youtu.be/' + ytId[1], resol, 'mp4', resol.endsWith('p') ? resol.replace(/p/g, '') : resol, 'en412')
			} catch (error) {
				result = await getJson(apiUrl + 'api/ytv/' + ytId[1] + '?quality=' + resol)
			}
			if (result.filesize > 100000) {
				const url = await getJson('https://tinyurl.com/api-create.php?url=' + result.dl_link)
				return await message.reply('*Failed to Download*\n_File size is more is than 100MB_\nClick this url to download manually : ' + url)
			}
			if (quality) {
				return await message.send(result.dl_link, 'video', {
					caption: result.title,
					quoted: message.data
				})
			}
			const sections = [{
				title: result.title,
				rows: [{
						title: '1080p',
						description: result.list['1080p'] || 'Not Available',
						rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {1080p}`
					},
					{
						title: '720p',
						description: result.list['720p'] || 'Not Available',
						rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {720p}`
					},
					{
						title: '480p',
						description: result.list['480p'] || 'Not Available',
						rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {480p}`
					},
					{
						title: '360p',
						description: result.list['360p'] || 'Not Available',
						rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {360p}`
					},
					{
						title: '240p',
						description: result.list['240p'] || 'Not Available',
						rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {240p}`
					},
					{
						title: '144p',
						description: result.list['144p'] || 'Not Available',
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
		let result
		try {
			result = await yt('https://youtu.be/' + search.videos[0].videoId, '360p', 'mp4', '360', 'en412')
		} catch (error) {
			result = await getJson(apiUrl + 'api/ytv/' + search.videos[0].videoId)
		}
		if (result.filesize > 100000) {
			const url = await getJson('https://tinyurl.com/api-create.php?url=' + result.dl_link)
			return await message.reply('*Failed to Download*\n_File size is more is than 100MB_\nClick this url to download manually : ' + url)
		}
		return await message.send(result.dl_link, 'video', {
			caption: result.title,
			quoted: message.data
		})
	} catch (error) {
		await message.send('*Failed to download*\n_try .video cmd_')
	}
});