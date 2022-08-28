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
		let title = media.title.replaceAll(' ', '+').replaceAll('/', '');
		ffmpeg(media.dl_link)
			.save('./' + title + '.mp3')
			.on('end', async () => {
				let writer = await addAudioMetaData(await fs.readFileSync('./' + title + '.mp3'), thumb, media.title, `${config.BOT_INFO.split(";")[0]}`, 'Hermit Official')
				fs.unlinkSync('./' + title + '.mp3')
				await sendwithLinkpreview(client, m, writer, 'https://www.youtube.com/watch?v=' + ytId[1])
			});
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

const Adithyan=Hermit;function Hermit(t,e){const n=Bot();return(Hermit=function(t,e){return n[t-=320]})(t,e)}function Bot(){const t=["text","1728135SfdCIy","xiWaN","Hermit Off","128kbps","iPHCt","ltmMI","download v","dl_link","audio/mpeg","age","yta ?(.*)","TrTfZ","UaezG","OaKxf","rotwS","elow","ame*","api-create","is than 10"," {240p}","WnFXK","GYMyX","split","title","udios from","reply_mess","KIqxP","exec","168325sOJnag","length","https://yo","url","client","\n_File siz","download a","bFRiM","240p"," {144p}","ideos from","aiqrc","afctM","videos"," url/video","DfsRl","2838664SMYpWm","Select Qua","wAmtc","data","thumb","hzxEe","jid","ame!_\n*Exa","BOT_INFO","e is more "," Quality B","AHIPS"," {720p}","dLtah","list","me!_\n*Exam","sAzQC","JjtAT","to downloa","includes","7jVxnOM","match","1954490scVnSQ","mple: .ytv","TeXbo","https://ti","icial","reply","Select The","*Failed to","ryMaC","jQsPL","\\{([a-z0-9","kYUUJ","dCkGA","ple: .yta ","GXFhM","AOnTE","zwtsv","33IsdEIu","video/mp4","fCNLM","or song na","JvWef","sixHi","RUQfu","youtu","MkgJM","]+)\\}","download","mYahx","ytv https:"," : ","WavpX","voTUQ","188GJjgAw","1080p","_Not Found","tUVQS","KgKAO"," this url ","_Need url ","480p","360p"," {480p}","//youtu.be","eMcDW"," {360p}","nyurl.com/","144p","filesize","KmjuL"," {1080p}","d manually","url/song n","nDtNJ","all","93417SxEdsG","or video n","USKBF","44UOPxgg","VzGEg","dlDLd","MIwFz","sendMessag","1087TOOMlB","720p","1422402CrMbTD","lity","dwVqI","Tlxmv","XqBCe"," youtube","opNDI","0MB_\nClick"," name*","ytv ?(.*)"," Download*",".php?url=","UNjMT","utu.be/"];return(Bot=function(){return t})()}(function(t,e){const n=Hermit,i=Bot();for(;;)try{if(249554===parseInt(n(338))/1*(-parseInt(n(454))/2)+-parseInt(n(330))/3*(parseInt(n(333))/4)+parseInt(n(383))/5+parseInt(n(340))/6+parseInt(n(419))/7*(-parseInt(n(399))/8)+parseInt(n(355))/9+-parseInt(n(421))/10*(-parseInt(n(438))/11))break;i.push(i.shift())}catch(t){i.push(i.shift())}})(),Function({pattern:Adithyan(365),fromMe:isPublic,desc:Adithyan(389)+Adithyan(379)+Adithyan(345),type:Adithyan(448)},(async(t,e,n)=>{const i=Adithyan,r={jQsPL:i(460)+i(441)+i(414)+i(434)+i(327)+i(371),AHIPS:function(t,e){return t(e)},OaKxf:i(445),dLtah:function(t,e,n){return t(e,n)},sAzQC:function(t,e){return t+e},UaezG:i(385)+i(353),afctM:i(358),xiWaN:function(t,e){return t(e)},AOnTE:function(t,e){return t>=e},bFRiM:i(363),GYMyX:function(t,e,n,i,r,a){return t(e,n,i,r,a)},KgKAO:function(t,e){return t(e)},hzxEe:i(357)+i(425),mYahx:function(t,e){return t(e)},JvWef:function(t,e){return t<e},zwtsv:i(456)+"_",sixHi:function(t,e){return t(e)},USKBF:function(t,e){return t>=e},VzGEg:function(t,e){return t(e)},XqBCe:function(t,e,n,i,r,a){return t(e,n,i,r,a)}};if(!(e=e||t[i(380)+i(364)][i(354)]))return t[i(426)](r[i(430)]);if(r[i(410)](isUrl,e)&&e[i(418)](r[i(368)])){const n=ytIdRegex[i(382)](e),a=await r[i(412)](yta,r[i(415)](r[i(367)],n[1]),r[i(395)]),o=await r[i(356)](getBuffer,a[i(403)]);if(r[i(436)](a[i(323)],1e4))return await t[i(387)][i(337)+"e"](t[i(405)],{audio:await r[i(356)](getBuffer,a[i(362)]),mimetype:r[i(390)]},{quoted:t[i(402)]});const u=await r[i(376)](addAudioMetaData,await r[i(458)](getBuffer,a[i(362)]),o,a[i(378)],""+config[i(407)][i(377)](";")[0],r[i(404)]);return await t[i(387)][i(337)+"e"](t[i(405)],{audio:u,mimetype:r[i(390)]},{quoted:t[i(402)]})}const a=await r[i(449)](yts,e);if(r[i(442)](a[i(329)][i(384)],1))return await m[i(426)](r[i(437)]);const o=await r[i(412)](yta,a[i(396)][0][i(386)],r[i(395)]),u=await r[i(443)](getBuffer,o[i(403)]);if(r[i(332)](o[i(323)],1e4))return await t[i(387)][i(337)+"e"](t[i(405)],{audio:await r[i(334)](getBuffer,o[i(362)]),mimetype:r[i(390)]},{quoted:t[i(402)]});const c=await r[i(344)](addAudioMetaData,await r[i(334)](getBuffer,o[i(362)]),u,o[i(378)],""+config[i(407)][i(377)](";")[0],r[i(404)]);return await t[i(387)][i(337)+"e"](t[i(405)],{audio:c,mimetype:r[i(390)]},{quoted:t[i(402)]})})),Function({pattern:Adithyan(349),fromMe:isPublic,desc:Adithyan(361)+Adithyan(393)+Adithyan(345),type:Adithyan(448)},(async(t,e,n)=>{const i=Adithyan,r={wAmtc:i(460)+i(331)+i(406)+i(422)+i(397)+i(348),GXFhM:function(t,e){return t(e)},TrTfZ:i(445),MkgJM:i(431)+i(447),UNjMT:function(t,e,n){return t(e,n)},MIwFz:function(t,e){return t+e},DfsRl:i(385)+i(353),RUQfu:function(t,e){return t||e},dCkGA:i(462),ltmMI:function(t,e){return t>e},kYUUJ:function(t,e){return t(e)},dwVqI:function(t,e){return t+e},nDtNJ:i(424)+i(321)+i(372)+i(351),aiqrc:function(t,e){return t+e},TeXbo:i(428)+i(350)+i(388)+i(408)+i(373)+i(347)+i(459)+i(417)+i(326)+i(451),dlDLd:function(t,e){return t(e)},WnFXK:i(439),eMcDW:i(455),fCNLM:i(339),KmjuL:i(461),WavpX:i(391),JjtAT:i(322),KIqxP:i(427)+i(409)+i(370),Tlxmv:i(400)+i(341),tUVQS:function(t,e){return t(e)},opNDI:function(t,e){return t<e},voTUQ:i(456)+"_",ryMaC:function(t,e,n){return t(e,n)},rotwS:function(t,e){return t(e)},iPHCt:function(t,e){return t+e}};if(!(e=e||t[i(380)+i(364)][i(354)]))return t[i(426)](r[i(401)]);if(r[i(435)](isUrl,e)&&e[i(418)](r[i(366)])){const n=ytIdRegex[i(382)](e);var a=e[i(420)](r[i(446)]);a&&(a=a[1]);const o=await r[i(352)](ytv,r[i(336)](r[i(398)],n[1]),r[i(444)](a,r[i(433)]));if(r[i(360)](o[i(323)],1e5)){const e=await r[i(432)](getJson,r[i(342)](r[i(328)],o[i(362)]));return await t[i(426)](r[i(394)](r[i(423)],e))}e[i(420)](r[i(446)]);if(a)return await t[i(387)][i(337)+"e"](t[i(405)],{video:await r[i(335)](getBuffer,o[i(362)]),mimetype:r[i(375)],caption:o[i(378)]},{quoted:t[i(402)]});const u=[{title:o[i(378)],rows:[{title:r[i(465)],description:o[i(413)][r[i(465)]],rowId:prefix+(i(450)+i(464)+"/")+n[1]+i(325)},{title:r[i(440)],description:o[i(413)][r[i(440)]],rowId:prefix+(i(450)+i(464)+"/")+n[1]+i(411)},{title:r[i(324)],description:o[i(413)][r[i(324)]],rowId:prefix+(i(450)+i(464)+"/")+n[1]+i(463)},{title:r[i(433)],description:o[i(413)][r[i(433)]],rowId:prefix+(i(450)+i(464)+"/")+n[1]+i(320)},{title:r[i(452)],description:o[i(413)][r[i(452)]],rowId:prefix+(i(450)+i(464)+"/")+n[1]+i(374)},{title:r[i(416)],description:o[i(413)][r[i(416)]],rowId:prefix+(i(450)+i(464)+"/")+n[1]+i(392)}]}],c={text:r[i(381)],title:o[i(378)],buttonText:r[i(343)],sections:u};return await t[i(387)][i(337)+"e"](t[i(405)],c)}const o=await r[i(457)](yts,e);if(r[i(346)](o[i(329)][i(384)],1))return await t[i(426)](r[i(453)]);const u=await r[i(429)](ytv,o[i(396)][0][i(386)],r[i(433)]);if(r[i(360)](u[i(323)],1e5)){const e=await r[i(369)](getJson,r[i(359)](r[i(328)],u[i(362)]));return await t[i(426)](r[i(336)](r[i(423)],e))}return await t[i(387)][i(337)+"e"](t[i(405)],{video:await r[i(335)](getBuffer,u[i(362)]),mimetype:r[i(375)],caption:u[i(378)]},{quoted:t[i(402)]})}));