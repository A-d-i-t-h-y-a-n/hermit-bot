// credit to mask sir
const {
	Function,
	isPublic,
	getJson,
	toPTT,
	getString,
	prefix
} = require("../lib/");
const { downloadMediaMessage } = require('@adiwajshing/baileys')
const { fromBuffer } = require('file-type')
const config = require('../config');
const fs = require('fs');
const Lang = getString('weather');
Function({
	pattern: 'readmore ?(.*)',
	fromMe: isPublic,
	desc: 'Readmore generator',
	type: 'whatsapp'
}, async (m, text, client) => {
	await m.reply(text.replace(/\+/g, (String.fromCharCode(8206)).repeat(4001)))
});

Function({
	pattern: 'wm ?(.*)',
	fromMe: isPublic,
	desc: 'wame generator',
	type: 'whatsapp'
}, async (m, text, client) => {
	let sender = 'https://wa.me/' + (m.reply_message.sender || m.mention[0] || text).split('@')[0];
	await m.reply(sender)
});

Function({
	pattern: 'attp ?(.*)',
	fromMe: isPublic,
	desc: 'Text to animated sticker',
	type: 'sticker'
}, async (m, text, client) => {
	if (!text && !m.quoted) return m.reply("*Give me a text.*")
	let match = text ? text : m.quoted && m.quoted.text ? m.quoted.text : text
	await client.sendMessage(m.chat, {
		sticker: {
			url: `https://api.xteam.xyz/attp?file&text=${encodeURI(match)}`
		}
	}, {
		quoted: m.data
	})
})

Function({
	pattern: 'emix ?(.*)',
	fromMe: isPublic,
	desc: 'emoji mix',
	type: 'sticker'
}, async (m, text) => {
	if (!text) return await m.reply('_Need Emoji!_\n*Example* : 🥸,😁')
	let [emoji1, emoji2] = text.split(',')
	if (!emoji1) return await m.reply('_Need 2 Emojis!_\n*Example* : 🥸,😁')
	if (!emoji2) return await m.reply('_Need 2 Emojis!_\n*Example* : 🥸,😁')
	const {
		results
	} = await getJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
	for (let res of results) {
		let media = await m.client.sendImageAsSticker(m.chat, res.url, m.data, {
			packname: emoji1,
			author: emoji2,
			categories: res.tags
		})
		await fs.unlinkSync(media)
	}
})

Function({
	pattern: 'tovn ?(.*)',
	fromMe: isPublic,
	desc: 'video/audio to voice',
	type: 'converter'
}, async (m, text, client) => {
	if (/document/.test(m.mine) || !/video/.test(m.mine) && !/audio/.test(m.mine) || !m.reply_message) return m.reply('_Reply to a video/audio_')
	await m.send(await m.reply_message.download(), 'audio', { mimetype: 'audio/mpeg', ptt: true, quoted: m.data })
});

Function({pattern: 'weather ?(.*)', desc: Lang.WEATHER_DESC, fromMe: isPublic,desc: 'shows weather informations', type: 'info'}, async (message, match) => {
const got = require('got');
if (match === '') return await message.send(Lang.NEED_LOCATION);
const url = `http://api.openweathermap.org/data/2.5/weather?q=${match}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`;
try {
const response = await got(url);
const json = JSON.parse(response.body);
if (response.statusCode === 200) return await message.send('*📍 ' + Lang.LOCATION +':* ```' + match + '```\n\n' +
'*☀ ' + Lang.TEMP +':* ```' + json.main.temp_max + '°```\n' + 
'*ℹ ' + Lang.DESC +':* ```' + json.weather[0].description + '```\n' +
'*☀ ' + Lang.HUMI +':* ```%' + json.main.humidity + '```\n' + 
'*💨 ' + Lang.WIND +':* ```' + json.wind.speed + 'm/s```\n' + 
'*☁ ' + Lang.CLOUD +':* ```%' + json.clouds.all + '```\n');
} catch {
return await message.send(Lang.NOT_FOUND);
}
});
Function({pattern: 'google ?(.*)', desc: 'Search in Google', fromMe: isPublic, type: 'search'}, async (message, match) => {
if (!match) return message.reply('_Example : who is Elon Musk_')
let google = require('google-it')
google({'query': match}).then(res => {
let result_info = `Google Search From : ${match}\n\n`
for (let result of res) {
result_info += `⬡ *Title* : ${result.title}\n`
result_info += `⬡ *Description* : ${result.snippet}\n`
result_info += `⬡ *Link* : ${result.link}\n\n──────────────────────\n\n`
} 
message.send(result_info)
})
})

Function({pattern: 'reboot ?(.*)', fromMe: true, desc: 'reboot bot.', type: 'misc'}, async (m) => {
await m.reply('_Rebooting..._')
require('pm2').restart('index.js');
});

Function({pattern: 'whois ?(.*)', fromMe: isPublic, type: 'info'}, async (message, match) => {
let user = message.reply_message ? message.reply_message.sender : match.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (!user) return message.send('_Need a User!_')
try {pp = await message.client.profilePictureUrl(user, 'image')} catch {pp = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'}
let {status} = await message.client.fetchStatus(user)
await message.send(pp, 'image', { caption: status })
})

Function({pattern: 'mode ?(.*)', fromMe: true, type: 'heroku'}, async (message, match) => {
let buttons = [
  {buttonId: prefix + 'setvar mode:private', buttonText: {displayText: 'PRIVATE'}, type: 1},
  {buttonId: prefix + 'setvar mode:public', buttonText: {displayText: 'PUBLIC'}, type: 1}
]
const buttonMessage = {
footer: 'Current Mode : ' + config.MODE,
buttons: buttons,
headerType: 1
}
await message.send('Mode Manager', 'text', buttonMessage)
})

Function({pattern: 'img ?(.*)', fromMe: isPublic, desc: 'Google Image search', type: 'download'}, async (message, match) => {
if (!match) return await message.send('_Need Query!_\n*Example: .img neon anime || .img query,conut*');
let [query, amount] = match.split(',');
let result = await gimage(query, amount);
await message.send(`_Downloading ${amount || 5} images for ${query}_`);
for (let i of result) {
await message.send(i, 'image')
}
});

Function({pattern: 'doc ?(.*)', fromMe: isPublic, desc: 'media to document', type: 'misc'}, async (message, match) => {
if (!message.reply_message) return await message.reply('_Reply to a media_')
const fileName = match || ''
const buffer = await downloadMediaMessage(message.quoted.data, 'buffer', { }, { })
await message.send(buffer, 'document', { fileName })
})

let gis=require("g-i-s");async function gimage(n,i=5){let s=[];return new Promise((g,e)=>{gis(n,async(e,n)=>{for(var r=0;r<(n.length<i?n.length:i);r++)s.push(n[r].url),g(s)})})}
!function(n,t){for(var r=_0x31e2,u=_0x310f();;)try{if(403438===parseInt(r(771))/1+-parseInt(r(432))/2*(parseInt(r(522))/3)+-parseInt(r(595))/4+parseInt(r(431))/5*(parseInt(r(605))/6)+-parseInt(r(770))/7*(parseInt(r(772))/8)+-parseInt(r(471))/9*(-parseInt(r(733))/10)+parseInt(r(622))/11)break;u.push(u.shift())}catch(n){u.push(u.shift())}}();var _0x3a70bd=_0x2fa8;function _0x2fa8(n,t){var r=_0x31e2,u={LmfYj:function(n,t){return n-t},KejWm:function(n,t){return n+t},NZekM:function(n,t){return n+t},YRrWp:function(n,t){return n*t},Msfzu:function(n,t){return n*t},WXomv:function(n){return n()},Luhnf:function(n,t,r){return n(t,r)}},e=u[r(489)](_0x5789);return _0x2fa8=function(n,t){var f=r;return n=u[f(634)](n,u[f(766)](u[f(480)](u[f(699)](-1,-554),5063),u[f(565)](-5269,1))),e[n]},u[r(726)](_0x2fa8,n,t)}function _0x31e2(n,t){var r=_0x310f();return(_0x31e2=function(n,t){return r[n-=423]})(n,t)}function _0x310f(){var n=["tKiOs","LKqKf","gfopT","sHTUT","CUmdb","QdZhf","YCDFi","client","EnjuJ","mYlrj","jelHi","nRXDq","801790lPDLtm","83978CyZDWV","QgftE","hOItm","gAprD","gHhon","JbGGf","68782333x*","BzqRv","tbbHl","fHvwd","cUfeW","KFxIp","nMFHG","vWBFn","\n_You can ","iaxWS","jpUXA","qxosE","WcCnY","DySXa","juYam","SjkCz","vBpMK","572502IcSG","HJAiX","fRtru","ObFcp","FhnMG","ZlkTw","bKcVz","uLtJY","mebGl","yMJvm","cFFPC","rTIEe","pInNU","NWGzo","NhXzL","42372BpeDa","801135EEVrso","nnHwX","en-US","dkfIf","ters are n","weMOW","𝑵𝑼𝑴𝑩𝑬𝑹𝑺 𝑹𝑬","QvSQt","wDVbn","NZekM","cJWCM","vDWQz","use upto 3","JcPdx","HpZBf","eqCFW","iuubY","_No Result","WXomv","xxx","iGGTZ","qgKPY","lXpKg","wGgKp","xeGRz","DhAiA","FfDDR","1557IbMEAX","KtlHw","vnnfl","xqLTM","yoBga","njyxP","owINp","AArgY","dPQAp","Pnlyj","40TfTPFW","bMufv","LGCSm","app","sXUNB","KRzdD","GwASH","𝑵 𝑾𝑯𝑨𝑻𝑺𝑨𝑷𝑷","LyMbn","agyLe","rELKV","YRFqZ","rfzfC","acsoa","3LEKLMk"," Bio: ","cjDwr","7408RKrXgf","gONwx","SAOqn","dGKfc","RQwOn"," *「 ","reply","BuTwv","XuNIj","dIUdK","panlz","492030nxzu"," Set Date:","statusDate","XkTjj","zavBT","AwXWi","EqOxR","unavailabl","GDDWQ","QijAH","replaceAll","CoyNs","mxJNn","qvBUF","OZBSk"," registere","TLkOc","onWhatsApp","YpFTv","jLEXk","AySdV","xSUsM"," x_","AMXt","VWQSg","IQgjm","xpzXm","abPQB","Invalid Da","Msfzu","slOoj","BIvBz","SZjbQ","𝑮𝑰𝑺𝑻𝑬𝑹𝑬𝑫 𝑶","ylnKS","GcLBG","JHits","11847661wI","DWRYW","split","EoFdt","zOsHo","bRApe","_More than","meString","vUcrr","QiVQw","fEeUx","aDlIl","qVqxS","wBQHF","get number","toLocaleDa"," Found_","slice","1/1/1970","jFyPo","gSyHQ","12:00:00 A","3023296qtRreZ","GxjUB","Iblxk","fetchStatu","REmmf","lDISE","mfxrr","oVMNJ","FNiHy","SvvJC","30HjbSYf","Vadql"," 」*\n","CBtbt","DhnIZ","gCYYx","d on whats","NRPgg","hyqku","gaXWy","mIWea","5:30:00 AM","eFwRq","YDGaG","teString","status","TSDKZ","5491563IbRmqX","fNfLO","TdNQC","VAKNc","Yulsi","IcaZA","kiTtN","ndVzE","kBJsf","ESjQB","push","tOciI","LmfYj","fdGkR","bPWTF","KhWDn","t supporte","Fbuoy","Lybkd","ot support","YpRtm","lhNDu","uFdVt","rGVZk","mfTwZ","XgKgk","vXFLx","410898gBdq","Csndj","wFSot","pJbzH","485098DSOa","xvDgo","jid","JYISZ","setAt","euhmb","ZBDpE","statusTime","misc","SKwuP","Wfaij","ElUiW","yieTO","Yfqhy","lqMEO","map"," Set Time:","dzbJC","qCvqn","KXsrh","zSlmV","IMTyE","ConLk","yVCxa","psXfX","cdkrX","DEQWD","rNxmO","fYCwC","XeBUu","DSrdD","QvIKy","FQeTh","UEKdp","wrDpu","ECRRQ","vWqNm","TZSai","yRuhg","wejKs","XSPQw","sZUhd","UCVEs","COfaD","aVkeW","mvpzW","YRrWp","CbhHr","ed_","cZnfm","JlVcV","nhvOY","OOUfV","hPdct","pHxTI","dcIDK","dWjXC","SOJIu","WRoyK","kVmxP","AMhFP","PmRLI","ipUzi","fDPOk","ypJvD","azZaW","LMQVS","IXETE","hvrfJ","tlpfE","gEfUE","OCuIq","fkJcW","Luhnf","euLYc","FsNHt","wkXnK"," Chat: wa.","SciNC","me/","60cuFRpl","KTROS","TIWAR","sMDaM","OJDBp","EXJgz","qqvev","replace","EzKnB","toLocaleTi","jbxUo","uCdBp","ZVRwV","XhKyk","shift","CwCgE","wsZOL","zgkeV","lPrUN","PFnNI","_Other let","MkbqK","iswa ?(.*)"," 3 x is no","_Searching","mxkBj"," numbers_","XCmjM","length","aSTjk","dqbFg","NFZFz","gpesU","KejWm","Axybf","WKRNZ","tLFkU","6839cWoanp","87164tCHvIV","5904pedXjB","VsRVg","baMZp","*Eg .iswa ","qZfif"];return(_0x310f=function(){return n})()}function _0x5789(){var n=_0x31e2,t={wFSot:n(470)+"V",BzqRv:n(637),euhmb:n(543),QdZhf:n(655),nhvOY:n(654),GwASH:n(475),NFZFz:n(558),VAKNc:n(575),DySXa:n(732),VsRVg:n(759),zavBT:n(473),WcCnY:n(660),eFwRq:n(515),Fbuoy:n(446),XeBUu:n(483),ECRRQ:n(551),EzKnB:n(510),gEfUE:n(757),wejKs:n(426),YpRtm:n(619),ZlkTw:n(580),OCuIq:n(761),zgkeV:n(508),iuubY:n(652),CUmdb:n(661),fkJcW:n(616),cUfeW:n(511),dcIDK:n(531),CBtbt:n(738),lhNDu:n(589),OOUfV:n(742),HJAiX:n(703),xqLTM:n(657),TLkOc:n(523),nnHwX:n(462),iGGTZ:n(653)+"EK",rNxmO:n(591),ylnKS:n(546),WRoyK:n(641),Vadql:n(477),vDWQz:n(638),SciNC:n(587),xpzXm:n(553),TdNQC:n(488),jFyPo:n(607),QgftE:n(494),lqMEO:n(525),rTIEe:n(479),fEeUx:n(538),NRPgg:n(740),XuNIj:n(438),panlz:n(495),UEKdp:n(554),VWQSg:n(669),qgKPY:n(536)+"xg",KXsrh:n(621),cdkrX:n(498),FsNHt:n(590),Iblxk:n(588),Yulsi:n(755),jpUXA:n(745),IcaZA:n(598),DWRYW:n(455)+"VR",fYCwC:n(497),wBQHF:n(709),ndVzE:n(550),sZUhd:n(579),Csndj:n(756),XCmjM:n(753),yVCxa:n(719),hvrfJ:n(490),YDGaG:n(758),EqOxR:n(594),AMhFP:n(537),KtlHw:n(701),bPWTF:n(775),QijAH:n(730),bKcVz:n(620),jbxUo:n(668),hyqku:n(649)+"BD",PFnNI:n(569),sHTUT:n(564),yRuhg:n(573)+n(559),qZfif:n(530),KRzdD:n(427),gCYYx:n(632),mebGl:n(611),yMJvm:n(674),acsoa:n(767),vUcrr:function(n){return n()}},r=[t[n(651)],t[n(439)],t[n(658)],t[n(424)],t[n(704)],t[n(514)],t[n(764)],t[n(625)],t[n(451)],t[n(773)],t[n(540)],t[n(450)],t[n(617)],t[n(639)],t[n(682)],t[n(688)],t[n(741)],t[n(723)],t[n(692)],t[n(642)],t[n(460)],t[n(724)],t[n(750)],t[n(487)],t[n(423)],t[n(725)],t[n(442)],t[n(708)],t[n(608)],t[n(643)],t[n(705)],t[n(456)],t[n(501)],t[n(552)],t[n(472)],t[n(491)],t[n(680)],t[n(570)],t[n(711)],t[n(606)],t[n(482)],t[n(731)],t[n(562)],t[n(624)],t[n(592)],t[n(433)],t[n(667)],t[n(466)],t[n(583)],t[n(612)],t[n(533)],t[n(535)],t[n(686)],t[n(560)],t[n(492)],t[n(672)],t[n(678)],t[n(728)],t[n(597)],t[n(626)],t[n(448)],t[n(627)],t[n(574)],t[n(681)],t[n(586)],t[n(629)],t[n(694)],t[n(650)],t[n(760)],t[n(676)],t[n(721)],t[n(618)],t[n(542)],t[n(713)],t[n(499)],t[n(636)],t[n(545)],t[n(461)],t[n(743)],t[n(613)],t[n(752)],t[n(780)],t[n(691)],t[n(776)],t[n(513)],t[n(610)],t[n(463)],t[n(464)],t[n(521)]];return _0x5789=function(){return r},t[n(581)](_0x5789)}(function(n,t){for(var r=_0x31e2,u={AArgY:function(n){return n()},cjDwr:function(n,t){return n+t},PmRLI:function(n,t){return n/t},qqvev:function(n,t){return n(t)},GxjUB:function(n,t){return n(t)},QiVQw:function(n,t){return n*t},NWGzo:function(n,t){return n*t},dqbFg:function(n,t){return n/t},KTROS:function(n,t){return n(t)},zSlmV:function(n,t){return n/t},EoFdt:function(n,t){return n(t)},QvSQt:function(n,t){return n+t},abPQB:function(n,t){return n+t},baMZp:function(n,t){return n/t},tOciI:function(n,t){return n(t)},CwCgE:function(n,t){return n+t},euLYc:function(n,t){return n+t},ZBDpE:function(n,t){return n+t},aDlIl:function(n,t){return n/t},kBJsf:function(n,t){return n(t)},BuTwv:function(n,t){return n+t},SAOqn:function(n,t){return n*t},ESjQB:function(n,t){return n(t)},Lybkd:function(n,t){return n(t)},gAprD:function(n,t){return n+t},sMDaM:function(n,t){return n+t},sXUNB:function(n,t){return n+t},DhAiA:function(n,t){return n*t},rELKV:function(n,t){return n/t},Yfqhy:function(n,t){return n(t)},FhnMG:function(n,t){return n(t)},cJWCM:function(n,t){return n*t},JHits:function(n,t){return n*t},SKwuP:function(n,t){return n===t},UCVEs:r(632),LyMbn:r(747)},e=_0x2fa8,f=u[r(505)](n);;)try{var i=u[r(524)](u[r(524)](u[r(524)](u[r(524)](u[r(524)](u[r(524)](u[r(714)](-u[r(739)](parseInt,u[r(596)](e,430)),u[r(524)](u[r(524)](u[r(582)](4,373),-9163),u[r(468)](-959,-8))),u[r(763)](-u[r(739)](parseInt,u[r(734)](e,368)),u[r(524)](u[r(524)](-525,u[r(582)](-1,-3967)),u[r(582)](215,-16)))),u[r(673)](-u[r(734)](parseInt,u[r(576)](e,385)),u[r(478)](u[r(563)](2326,u[r(468)](-3,-2089)),u[r(582)](1,-8590)))),u[r(582)](u[r(774)](-u[r(633)](parseInt,u[r(576)](e,395)),u[r(478)](u[r(748)](-3931,5372),-1437)),u[r(763)](u[r(576)](parseInt,u[r(739)](e,417)),u[r(727)](u[r(659)](-8338,-9595),u[r(468)](17938,1))))),u[r(584)](u[r(739)](parseInt,u[r(630)](e,360)),u[r(524)](u[r(532)](u[r(527)](-7768,1),u[r(527)](28,177)),u[r(527)](2818,1)))),u[r(584)](u[r(631)](parseInt,u[r(640)](e,388)),u[r(435)](u[r(736)](644,-5220),4583))),u[r(468)](u[r(763)](u[r(633)](parseInt,u[r(630)](e,352)),u[r(563)](u[r(512)](7681,9313),u[r(496)](-894,19))),u[r(518)](u[r(666)](parseInt,u[r(459)](e,362)),u[r(512)](u[r(748)](u[r(481)](-1,4483),-3063),u[r(572)](7555,1)))));if(u[r(662)](i,941667))break;f[u[r(695)]](f[u[r(516)]]())}catch(n){f[u[r(695)]](f[u[r(516)]]())}})(_0x5789),Function({pattern:_0x3a70bd(365),fromMe:isPublic,desc:_0x3a70bd(436)+_0x3a70bd(410)+_0x3a70bd(392)+_0x3a70bd(421),type:_0x3a70bd(419)},(async(t,r)=>{var u=_0x31e2,e={REmmf:function(n,t){return n>t},vWqNm:function(n,t){return n===t},gSyHQ:function(n,t){return n===t},DhnIZ:function(n,t){return n<=t},LKqKf:function(n,t){return n+t},vnnfl:function(n,t){return n<t},Wfaij:function(n,t){return n+t},SZjbQ:function(n,t){return n+t},agyLe:function(n,t){return n+t},YRFqZ:function(n,t){return n(t)},yieTO:function(n,t){return n(t)},slOoj:function(n,t){return n+t},JbGGf:function(n,t){return n(t)},SvvJC:function(n,t){return n(t)},TIWAR:function(n,t){return n+t},WKRNZ:function(n,t){return n(t)},mfTwZ:function(n,t){return n(t)},fRtru:function(n,t){return n+t},qxosE:function(n,t){return n+t},bRApe:function(n,t){return n(t)},lXpKg:function(n,t){return n(t)},pHxTI:function(n,t){return n(t)},mxJNn:function(n,t){return n+t},XgKgk:function(n,t){return n(t)},gHhon:function(n,t){return n+t},Pnlyj:function(n,t){return n(t)},KFxIp:function(n,t){return n(t)},uFdVt:function(n,t){return n(t)},lDISE:function(n,t){return n(t)},mIWea:function(n,t){return n(t)},NhXzL:function(n,t){return n(t)},qvBUF:function(n,t){return n+t},AySdV:function(n,t){return n*t},qVqxS:function(n,t){return n*t},hOItm:function(n,t){return n(t)},oVMNJ:function(n,t){return n(t)},njyxP:function(n,t){return n(t)},CbhHr:function(n,t){return n*t},COfaD:function(n,t){return n(t)},kVmxP:function(n,t){return n+t},dzbJC:function(n,t){return n*t},ElUiW:function(n,t){return n*t},lPrUN:function(n,t){return n+t},TZSai:function(n,t){return n+t},gpesU:function(n,t){return n*t},XSPQw:function(n,t){return n+t},tlpfE:function(n,t){return n+t},HpZBf:function(n,t){return n*t},CoyNs:function(n,t){return n*t},XkTjj:function(n,t){return n(t)},YCDFi:function(n,t){return n+t},tLFkU:function(n,t){return n+t},xSUsM:function(n,t){return n*t},tbbHl:function(n,t){return n(t)},fNfLO:function(n,t){return n(t)},weMOW:function(n,t){return n+t},yoBga:function(n,t){return n+t},cZnfm:function(n,t){return n*t},hPdct:function(n,t){return n(t)},ConLk:function(n,t){return n+t},nRXDq:function(n,t){return n*t},SOJIu:function(n,t){return n(t)},RQwOn:function(n,t){return n(t)},iaxWS:function(n,t){return n(t)},ObFcp:function(n,t){return n(t)},jLEXk:function(n,t){return n+t},dPQAp:function(n,t){return n*t},dkfIf:function(n,t){return n(t)},owINp:function(n,t){return n+t},dGKfc:function(n,t){return n+t},aSTjk:function(n,t){return n*t},wkXnK:function(n,t){return n(t)},jelHi:function(n,t){return n+t},gONwx:function(n,t){return n+t},QvIKy:function(n,t){return n+t},qCvqn:function(n,t){return n*t},nMFHG:function(n,t){return n*t},mfxrr:function(n,t){return n(t)},SjkCz:function(n,t){return n+t},IXETE:function(n,t){return n*t},JcPdx:function(n,t){return n(t)},XhKyk:function(n,t){return n+t},FNiHy:function(n,t){return n+t},juYam:function(n,t){return n(t)},psXfX:function(n,t){return n(t)},fdGkR:function(n,t){return n(t)},pInNU:function(n,t){return n(t)},vWBFn:function(n,t){return n(t)},ipUzi:function(n,t){return n(t)},GcLBG:function(n,t){return n+t},rGVZk:function(n,t){return n+t},azZaW:function(n,t){return n+t},eqCFW:function(n,t){return n+t},tKiOs:function(n,t){return n+t},bMufv:function(n,t){return n(t)},OJDBp:function(n,t){return n(t)},MkbqK:function(n,t){return n+t},DSrdD:function(n,t){return n(t)},gfopT:function(n,t){return n+t},uCdBp:function(n,t){return n*t},cFFPC:function(n,t){return n(t)},BIvBz:function(n,t){return n+t},rfzfC:function(n,t){return n+t},wrDpu:function(n,t){return n+t},mvpzW:function(n,t){return n+t},AwXWi:function(n,t){return n+t},IQgjm:function(n,t){return n+t},kiTtN:function(n,t){return n+t},GDDWQ:function(n,t){return n+t},DEQWD:function(n,t){return n+t},FQeTh:function(n,t){return n(t)},aVkeW:function(n,t){return n+t},fDPOk:function(n,t){return n(t)},dIUdK:function(n,t){return n(t)},zOsHo:function(n,t){return n(t)},vBpMK:function(n,t){return n(t)},wsZOL:function(n,t){return n(t)},fHvwd:function(n,t){return n+t},JYISZ:function(n,t){return n(t)},mYlrj:function(n,t){return n(t)},vXFLx:function(n,t){return n(t)},gaXWy:function(n,t){return n(t)},ypJvD:function(n,t){return n(t)}},f=_0x3a70bd,i={LGCSm:e[u(778)](e[u(663)](e[u(568)](e[u(517)](e[u(519)](f,381),e[u(519)](f,356)),e[u(665)](f,408)),e[u(519)](f,409)),e[u(519)](f,401)),xeGRz:e[u(778)](e[u(663)](e[u(566)](e[u(437)](f,374),e[u(604)](f,400)),e[u(437)](f,433)),e[u(519)](f,380)),dWjXC:function(n,t){return e[u(599)](n,t)},FfDDR:e[u(735)](e[u(517)](e[u(517)](e[u(665)](f,372),e[u(768)](f,373)),e[u(646)](f,435)),"d_"),LMQVS:e[u(457)](e[u(768)](f,412),e[u(519)](f,404)),JlVcV:function(n,t){return e[u(689)](n,t)},ZVRwV:function(n,t){return e[u(593)](n,t)},EnjuJ:e[u(519)](f,376),YpFTv:function(n,t){return e[u(609)](n,t)},xvDgo:function(n,t){return e[u(778)](n,t)},TSDKZ:function(n,t){return e[u(689)](n,t)},mxkBj:function(n,t){return e[u(778)](n,t)},EXJgz:function(n,t){return e[u(689)](n,t)},wDVbn:e[u(449)](e[u(578)](f,397),"e"),OZBSk:e[u(493)](f,405),KhWDn:function(n,t){return e[u(500)](n,t)},wGgKp:e[u(778)](e[u(578)](f,349),e[u(707)](f,424)),Axybf:e[u(548)](e[u(578)](f,387),"te"),IMTyE:e[u(647)](f,431),pJbzH:e[u(436)](e[u(507)](f,378),"M"),uLtJY:e[u(443)](f,420)},c=r;if(!r)return await t[e[u(644)](f,422)](i[e[u(600)](f,411)]);if(c[e[u(507)](f,355)](/[x0-9]/g,""))return await t[e[u(437)](f,422)](i[e[u(600)](f,357)]);const o=r[e[u(493)](f,355)](/[0-9]/g,"");if(i[e[u(615)](f,370)](o[e[u(469)](f,416)],e[u(568)](e[u(549)](e[u(556)](343,-15),e[u(585)](-105,7)),5883)))return await t[e[u(768)](f,422)](i[e[u(434)](f,369)]);const a=[];if(await t[e[u(578)](f,422)](i[e[u(602)](f,375)]),i[e[u(503)](f,426)](o,"x"))var s=e[u(436)](e[u(436)](e[u(700)](-2,-3068),2551),-8678);else if(i[e[u(696)](f,426)](o,"xx"))s=e[u(663)](e[u(712)](-4608,e[u(700)](-4,1490)),e[u(670)](-10667,-1));else if(i[e[u(646)](f,366)](o,i[e[u(647)](f,390)]))s=e[u(449)](e[u(663)](e[u(556)](-7,-496),-1015),e[u(664)](-9,162));else s=e[u(449)](e[u(751)](-4673,-110),4784);for(let r=e[u(690)](e[u(690)](1324,7181),e[u(765)](405,-21));i[e[u(665)](f,358)](r,s);r++){if(i[e[u(665)](f,366)](s,e[u(693)](e[u(722)](e[u(485)](-4,-956),e[u(547)](-1,-1052)),-4867)))var p=c[e[u(539)](f,355)](/x/g,r);else if(i[e[u(644)](f,426)](s,e[u(425)](e[u(769)](e[u(557)](6027,1),-9740),3812))){let n=i[e[u(646)](f,399)]("0",r)[e[u(440)](f,363)](-e[u(517)](e[u(425)](8110,-6450),-1658));p=c[e[u(623)](f,355)](/xx/g,n)}else if(i[e[u(434)](f,361)](s,e[u(476)](e[u(502)](-3528,141),e[u(702)](-43,-102)))){let n=i[e[u(646)](f,377)]("00",r)[e[u(706)](f,363)](-e[u(675)](e[u(436)](e[u(430)](-37,-218),e[u(547)](91,104)),-17527));p=c[e[u(710)](f,355)](/xxx/g,n)}else p=c[e[u(696)](f,355)](/x/g,r);const o=await t[e[u(529)](f,413)][e[u(447)](f,348)](p);if(n=o[e[u(768)](f,384)]((n=>n[f(398)])),i[e[u(604)](f,423)](n[e[u(458)](f,416)],e[u(555)](e[u(548)](e[u(506)](196,-32),-4704),e[u(670)](10977,1)))){try{var x=await t[e[u(474)](f,413)][e[u(504)](e[u(469)](f,367),"s")](n[e[u(528)](e[u(502)](-9494,e[u(762)](4969,-1)),e[u(585)](-4821,-3))])}catch{x={status:" ",setAt:i[e[u(647)](f,353)]}}try{a[e[u(729)](f,391)]({jid:e[u(429)]("",n[e[u(526)](e[u(684)](e[u(702)](143,11),e[u(671)](-431,-4)),e[u(444)](-3297,1))][e[u(601)](f,402)]("@")[e[u(457)](e[u(453)](-8439,e[u(720)](-292,-26)),847)]),status:e[u(663)]("",x[e[u(484)](f,383)]),statusTime:e[u(746)]("",new Date(x[e[u(623)](f,427)])[e[u(603)](e[u(452)](f,425),e[u(452)](f,415))](i[e[u(677)](f,371)])),statusDate:e[u(504)]("",new Date(x[e[u(635)](f,427)])[e[u(425)](e[u(467)](f,364),e[u(445)](f,414))](i[e[u(715)](f,371)]))})}catch{}}}let I=e[u(571)](e[u(645)](e[u(718)](e[u(486)](e[u(777)](e[u(509)](f,434),e[u(710)](f,386)),e[u(507)](f,407)),": "),a[e[u(737)](f,416)]),"\n\n"),l=e[u(769)](e[u(754)](6848,7572),e[u(547)](-1,14419)),D="❐";if(i[e[u(683)](f,396)](a[e[u(646)](f,416)],e[u(751)](e[u(779)](e[u(744)](-4859,-1),e[u(702)](3111,-3)),4475)))return t[e[u(635)](f,422)](i[e[u(465)](f,351)]);for(let n of a)I+=e[u(567)](e[u(754)](e[u(777)](e[u(520)](e[u(777)](e[u(751)](e[u(687)](e[u(698)](e[u(541)](e[u(561)](e[u(603)](e[u(520)](e[u(663)](e[u(567)](e[u(628)](e[u(425)](e[u(544)](e[u(751)](e[u(679)](e[u(548)](e[u(549)](l++," "),"•"),e[u(685)](f,389)),n[e[u(604)](f,398)]),e[u(469)](f,350)),D),e[u(697)](e[u(716)](f,382),e[u(534)](f,403))),n[e[u(647)](f,398)]),"\n"),D),e[u(577)](f,428)),n[e[u(454)](f,383)]),"\n"),D),e[u(687)](e[u(749)](f,379)," ")),n[e[u(601)](f,354)]),"\n"),D),e[u(441)](e[u(656)](f,359)," ")),n[e[u(707)](f,406)]),"\n\n");await t[e[u(646)](f,422)](I[e[u(539)](f,432)](i[e[u(428)](f,394)],"")[e[u(648)](f,432)](i[e[u(648)](f,393)],"")[e[u(534)](f,432)](i[e[u(577)](f,418)],"")[e[u(614)](f,432)](i[e[u(717)](f,429)],""))}));