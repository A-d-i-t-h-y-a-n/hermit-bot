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
	sendwithLinkpreview,
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
}, async (m, text, client) => {
	text = text || m.reply_message.text
	if (!text) return m.reply(Lang.NEED_TEXT_SONG)
	if (isUrl(text) && text.includes('youtu')) {
		let ytId = ytIdRegex.exec(text)
		let media = await yta('https://youtu.be/' + ytId[1], '128kbps')
		let thumb = await getBuffer(media.thumb)
		if (media.filesize >= 10000) return await sendwithLinkpreview(client, m, media.dl_link, 'https://www.youtube.com/watch?v=' + ytId[1])
				let writer = await addAudioMetaData(await getBuffer(media.dl_link), thumb, media.title, `${config.BOT_INFO.split(";")[0]}`, 'Hermit Official')
				await sendwithLinkpreview(client, m, writer, 'https://www.youtube.com/watch?v=' + ytId[1])
		return;
	}
	let search = await yts(text)
	if (search.all.length < 1) return await m.reply(Lang.NO_RESULT);
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
	await client.sendMessage(m.chat, listMessage, {
		quoted: m.data
	})
});

Function({
	pattern: 'video ?(.*)',
	fromMe: isPublic,
	desc: Lang.VIDEO_DESC,
	type: 'download'
}, async (m, text, client) => {
	let ytmp4text = text || m.quoted.text || false
	if (!ytmp4text) return m.reply(Lang.NEED_VIDEO)
	let textvideo = ytmp4text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))
	if (!textvideo) return m.reply(Lang.NEED_VIDEO)
	let ytId = ytIdRegex.exec(textvideo)
	let quality = m.match[1] ? m.match[1] : '360p'
	let media = await ytv('https://youtu.be/' + ytId[1], quality)
	if (media.filesize >= 100000) return m.reply('_Unable to download video_')
	await client.sendMessage(m.chat, {
		video: await getBuffer(media.dl_link),
		mimetype: 'video/mp4',
		caption: media.title
	})
});

function Adithyan(t,e){const n=Hermit();return(Adithyan=function(t,e){return n[t-=275]})(t,e)}const adithyan=Adithyan;function Hermit(){const t=["ame!_\n*Exa","exec","e is more ","eYMGZ","hVHBE","download a","fjmEi","download","ame*","or song na"," {480p}","lfFMo"," {144p}","download v","GborG","164754IQQbie","HFico","data"," : ","juDXd","_Need url ","is than 10","1080p","//youtu.be","dZCVD","api-create","ple: .yta ","EKVBp"," {720p}","to downloa","AMYit","youtu","480p","\\{([a-z0-9"," Quality B"," url/video","reply","DiYrq","uUDsN","\n_File siz","jonNl","https://ti","1157686ENdatN","1050054YABTCI","text","all","amFAb","mple: .ytv","MODJH","NLSOr","title","videos","BaWqg","thumb"," name*","16210iNKTxZ","bPazg","dwHSn","match"," youtube","104rDmNuD","iiZWa","ARgxB","filesize","d manually","360p","sendMessag","BvxtD","age","yta ?(.*)","hPYNr","length","udios from"," {1080p}","Select Qua","reply_mess","3124DgPUJl","BOT_INFO","YnVrR","Ycpyu","ytv ?(.*)","utu.be/","https://yo","iutgX"," this url ","jqwFy","icial","QWNzm","UXAGB","144p","dl_link","url/song n","lity","NpsGs","Select The","or video n"," {360p}","bOXjK","240p","]+)\\}","KLpKc","url","720p","XKlYt","ideos from","420968hnOSWS","jid","14KVJwAl","ytv https:","elow","bnBHe","xcaam","list","25SoKcEZ","split","EcRCt","128kbps","10219626hneDNp"," Download*",".php?url=","988967KEAeCG","me!_\n*Exam"," {240p}","video/mp4","*Failed to","Hermit Off","client","CxtuZ","eYWQN","WVdHB","includes","0MB_\nClick","zjtvz","nyurl.com/","audio/mpeg","_Not Found","wysDL","Wtoba","opJvh"];return(Hermit=function(){return t})()}(function(t,e){const n=Adithyan,i=Hermit();for(;;)try{if(954476===parseInt(n(292))/1+parseInt(n(357))/2*(-parseInt(n(404))/3)+-parseInt(n(355))/4+parseInt(n(363))/5*(-parseInt(n(293))/6)+-parseInt(n(370))/7*(-parseInt(n(310))/8)+-parseInt(n(367))/9+-parseInt(n(305))/10*(-parseInt(n(326))/11))break;i.push(i.shift())}catch(t){i.push(i.shift())}})(),Function({pattern:adithyan(319),fromMe:isPublic,desc:adithyan(394)+adithyan(322)+adithyan(309),type:adithyan(396)},(async(t,e,n)=>{const i=adithyan,r={eYWQN:i(409)+i(398)+i(371)+i(276)+i(341)+i(397),UXAGB:function(t,e){return t(e)},uUDsN:i(281),zjtvz:function(t,e,n){return t(e,n)},MODJH:function(t,e){return t+e},iiZWa:i(332)+i(331),NLSOr:i(366),GborG:function(t,e){return t(e)},iutgX:function(t,e){return t>=e},fjmEi:i(384),BaWqg:function(t,e,n,i,r,a){return t(e,n,i,r,a)},QWNzm:i(375)+i(336),AMYit:function(t,e){return t(e)},jqwFy:function(t,e){return t<e},ARgxB:i(385)+"_",DiYrq:function(t,e){return t(e)},xcaam:function(t,e){return t(e)},BvxtD:function(t,e,n,i,r,a){return t(e,n,i,r,a)}};if(!(e=e||t[i(325)+i(318)][i(294)]))return t[i(286)](r[i(378)]);if(r[i(338)](isUrl,e)&&e[i(380)](r[i(288)])){const n=ytIdRegex[i(390)](e),a=await r[i(382)](yta,r[i(298)](r[i(311)],n[1]),r[i(299)]),o=await r[i(403)](getBuffer,a[i(303)]);if(r[i(333)](a[i(313)],1e4))return await t[i(376)][i(316)+"e"](t[i(356)],{audio:await r[i(403)](getBuffer,a[i(340)]),mimetype:r[i(395)]},{quoted:t[i(406)]});const u=await r[i(302)](addAudioMetaData,await r[i(338)](getBuffer,a[i(340)]),o,a[i(300)],""+config[i(327)][i(364)](";")[0],r[i(337)]);return await t[i(376)][i(316)+"e"](t[i(356)],{audio:u,mimetype:r[i(395)]},{quoted:t[i(406)]})}const a=await r[i(280)](yts,e);if(r[i(335)](a[i(295)][i(321)],1))return await m[i(286)](r[i(312)]);const o=await r[i(382)](yta,a[i(301)][0][i(351)],r[i(299)]),u=await r[i(287)](getBuffer,o[i(303)]);if(r[i(333)](o[i(313)],1e4))return await t[i(376)][i(316)+"e"](t[i(356)],{audio:await r[i(361)](getBuffer,o[i(340)]),mimetype:r[i(395)]},{quoted:t[i(406)]});const c=await r[i(317)](addAudioMetaData,await r[i(280)](getBuffer,o[i(340)]),u,o[i(300)],""+config[i(327)][i(364)](";")[0],r[i(337)]);return await t[i(376)][i(316)+"e"](t[i(356)],{audio:c,mimetype:r[i(395)]},{quoted:t[i(406)]})})),Function({pattern:adithyan(330),fromMe:isPublic,desc:adithyan(402)+adithyan(354)+adithyan(309),type:adithyan(396)},(async(t,e,n)=>{const i=adithyan,r={dZCVD:i(409)+i(345)+i(389)+i(297)+i(285)+i(304),Wtoba:function(t,e){return t(e)},EcRCt:i(281),hVHBE:i(283)+i(349),dwHSn:function(t,e,n){return t(e,n)},YnVrR:function(t,e){return t+e},juDXd:i(332)+i(331),bPazg:function(t,e){return t||e},Ycpyu:i(315),lfFMo:function(t,e){return t>e},NpsGs:i(291)+i(383)+i(275)+i(369),KLpKc:function(t,e){return t+e},eYMGZ:i(374)+i(368)+i(289)+i(391)+i(410)+i(381)+i(334)+i(279)+i(314)+i(407),WVdHB:i(373),HFico:i(411),XKlYt:i(352),bnBHe:i(282),jonNl:i(348),bOXjK:i(339),CxtuZ:i(344)+i(284)+i(359),opJvh:i(324)+i(342),EKVBp:function(t,e){return t<e},hPYNr:i(385)+"_",amFAb:function(t,e,n){return t(e,n)},wysDL:function(t,e){return t+e}};if(!(e=e||t[i(325)+i(318)][i(294)]))return t[i(286)](r[i(413)]);if(r[i(387)](isUrl,e)&&e[i(380)](r[i(365)])){const n=ytIdRegex[i(390)](e);var a=e[i(308)](r[i(393)]);a&&(a=a[1]);const o=await r[i(307)](ytv,r[i(328)](r[i(408)],n[1]),r[i(306)](a,r[i(329)]));if(a){if(r[i(400)](o[i(313)],1e5)){const e=await r[i(387)](getJson,r[i(328)](r[i(343)],o[i(340)]));return await t[i(286)](r[i(350)](r[i(392)],e))}return await t[i(376)][i(316)+"e"](t[i(356)],{video:await r[i(387)](getBuffer,o[i(340)]),mimetype:r[i(379)],caption:o[i(300)]},{quoted:t[i(406)]})}const u=[{title:o[i(300)],rows:[{title:r[i(405)],description:o[i(362)][r[i(405)]],rowId:prefix+(i(358)+i(412)+"/")+n[1]+i(323)},{title:r[i(353)],description:o[i(362)][r[i(353)]],rowId:prefix+(i(358)+i(412)+"/")+n[1]+i(278)},{title:r[i(360)],description:o[i(362)][r[i(360)]],rowId:prefix+(i(358)+i(412)+"/")+n[1]+i(399)},{title:r[i(329)],description:o[i(362)][r[i(329)]],rowId:prefix+(i(358)+i(412)+"/")+n[1]+i(346)},{title:r[i(290)],description:o[i(362)][r[i(290)]],rowId:prefix+(i(358)+i(412)+"/")+n[1]+i(372)},{title:r[i(347)],description:o[i(362)][r[i(347)]],rowId:prefix+(i(358)+i(412)+"/")+n[1]+i(401)}]}],c={text:r[i(377)],title:o[i(300)],buttonText:r[i(388)],sections:u};return await t[i(376)][i(316)+"e"](t[i(356)],c)}const o=await r[i(387)](yts,e);if(r[i(277)](o[i(295)][i(321)],1))return await t[i(286)](r[i(320)]);const u=await r[i(296)](ytv,o[i(301)][0][i(351)],r[i(329)]);if(r[i(400)](u[i(313)],1e5)){const e=await r[i(387)](getJson,r[i(328)](r[i(343)],u[i(340)]));return await t[i(286)](r[i(386)](r[i(392)],e))}return await t[i(376)][i(316)+"e"](t[i(356)],{video:await r[i(387)](getBuffer,u[i(340)]),mimetype:r[i(379)],caption:u[i(300)]},{quoted:t[i(406)]})}));