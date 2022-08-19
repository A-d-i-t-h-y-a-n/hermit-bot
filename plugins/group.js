const {Function,isUrl} = require('../lib/')
async function isBotAdmins(m, client) {
const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(e => {}) : ''
const participants = m.isGroup ? await groupMetadata.participants : ''
const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
return m.isGroup ? groupAdmins.includes(m.user_id) : false
}
Function({pattern: 'add ?(.*)', fromMe: true, desc: 'Adds someone to the group.', type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
const isbotAdmin = await isBotAdmins(m, client)
if (!isbotAdmin) return await m.reply("I'm not an admin")
if(!text && !m.quoted) return await m.reply('Enter the number you want to add')
let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if(!users) return reply('Enter the number you want to add')
let v = await client.onWhatsApp(users);
n = v.map((n_jid) => n_jid.jid);
if (!n.includes(users)) return await m.reply("This number doesn't exists on whatsapp");
let vs = await client.GroupParticipantsUpdate(m, users)
if (vs == '403') {
await client.sendMessage(m.chat, { text: `_Couldn't add. Invite sent!_`, mentions: [users] })
} else if (vs == '408') {
await client.sendMessage(m.chat, { text: `_Couldn't add @${users.split('@')[0]} because they left the group recently. Try again later._`, mentions: [users] }, { quoted: m.data })
} else if (vs == '401') {
await client.sendMessage(m.chat, { text: `_Couldn't add @${users.split('@')[0]} because they blocked the bot number._`, mentions: [users] }, { quoted: m.data })
}else if (vs == '200') {
await client.sendMessage(m.chat, { text: `@${users.split('@')[0]}, Added to The Group`, mentions: [users] })
}else if (vs == '409') {
await client.sendMessage(m.chat, { text: `@${users.split('@')[0]}, Already in Group`, mentions: [users] })
} else {
await client.sendMessage(m.chat, { text: vs})
}})
Function({pattern: 'kick ?(.*)', fromMe: true, desc: 'kick someone in the group. Reply to message or tag a person to use command.', type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
const isbotAdmin = await isBotAdmins(m, client)
if (!isbotAdmin) return await m.reply("I'm not an admin")
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
let v = await client.onWhatsApp(users);
n = v.map((n_jid) => n_jid.jid);
if (!n.includes(users)) return await m.reply("This number doesn't exists on whatsapp");
await client.sendMessage(m.chat, { text: `@${users.split('@')[0]}, Kicked From The Group`, mentions: [users] })
await client.groupParticipantsUpdate(m.chat, [users], 'remove')
})

Function({pattern: 'promote ?(.*)', fromMe: true, desc: 'Makes any person an admin.', type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
const isbotAdmin = await isBotAdmins(m, client)
if (!isbotAdmin) return await m.reply("I'm not an admin")
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (!users) return await m.reply('Need a participant')
let v = await client.onWhatsApp(users);
n = v.map((n_jid) => n_jid.jid);
if (!n.includes(users)) return await m.reply("This number doesn't exists on whatsapp");
await client.groupParticipantsUpdate(m.chat, [users], 'promote')
await client.sendMessage(m.chat, { text: `@${users.split('@')[0]}, Is promoted as admin!`, mentions: [users] })
})
Function({pattern: 'demote ?(.*)', fromMe: true, desc: 'Takes the authority of any admin.', type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
const isbotAdmin = await isBotAdmins(m, client)
if (!isbotAdmin) return await m.reply("I'm not an admin")
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (!users) return await m.reply('Need a participant')
let v = await client.onWhatsApp(users);
n = v.map((n_jid) => n_jid.jid);
if (!n.includes(users)) return await m.reply("This number doesn't exists on whatsapp");
await client.groupParticipantsUpdate(m.chat, [users], 'demote')
await client.sendMessage(m.chat, { text: `@${users.split('@')[0]}, Is no longer an admin!`, mentions: [users] })
})
Function({pattern: 'mute ?(.*)', fromMe: true, desc: 'Mute the group chat. Only the admins can send a message.', type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
const isbotAdmin = await isBotAdmins(m, client)
if (!isbotAdmin) return await m.reply("I'm not an admin")
await client.groupSettingUpdate(m.chat, 'announcement')
await m.reply("Group muted. Only admins can send messages")
})
Function({pattern: 'unmute ?(.*)', fromMe: true, desc: 'Unmute the group chat. Anyone can send a message.', type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
if (!isBotAdmins) return await m.reply("I'm not an admin")
await client.groupSettingUpdate(m.chat, 'not_announcement')
await m.reply('Group opened.')
})
indec = "Provides the group's invitation link."
Function({pattern: 'invite ?(.*)', fromMe: true, desc: indec, type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
const isbotAdmin = await isBotAdmins(m, client)
if (!isbotAdmin) return await m.reply("I'm not an admin")
const response = await client.groupInviteCode(m.chat)
await m.reply(`https://chat.whatsapp.com/${response}`)
})
Function({pattern: 'revoke', fromMe: true, desc: 'Revoke Group invite link.', type: 'group'}, async (m, match) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
const isbotAdmin = await isBotAdmins(m, m.client)
if (!isbotAdmin) return await m.reply("I'm not an admin")
await m.client.groupRevokeInvite(m.jid)
return await m.reply('_success_')
})
Function({pattern: 'setgname', fromMe: true, desc: 'set group subject.', type: 'group'}, async (m, match) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
const isbotAdmin = await isBotAdmins(m, m.client)
if (!isbotAdmin) return await m.reply("I'm not an admin")
await m.client.groupUpdateSubject(m.chat, match)
return await m.reply('_success_')
})
Function({pattern: 'setdesc', fromMe: true, desc: 'Set Group desc.', type: 'group'}, async (m, match) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
const isbotAdmin = await isBotAdmins(m, m.client)
if (!isbotAdmin) return await m.reply("I'm not an admin")
await m.client.groupUpdateDescription(m.chat, text)
return await m.reply('_success_')
})
Function({pattern: 'ginfo ?(.*)', fromMe: true, desc: 'Shows group invite info', type: 'group'}, async (m, match) => {
match = match || m.reply_message.text
if (!match) return await m.reply('*Need Group Link*\n_Example : ginfo group link_')
const [link, invite] = match.match(/chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i) || []
if (!invite) return await m.reply('_Invalid invite link_')
function _0x4bc6(){const t=["VbyuC","attrs","query","14214350QEqxqg","zOhwM","1700566BQcIUx","2ByYevk","@g.us","63rDYZYi","content","pPSgk","203010eYGGtc","2226855ATgjOY","w:g2","6gKGuKc","get","813224jTWfOm","invite","85906stAgHr","client","AEFVY","1473588dlVYEq"];return(_0x4bc6=function(){return t})()}function _0x4174(t,n){const r=_0x4bc6();return(_0x4174=function(t,n){return r[t-=106]})(t,n)}async function inviteinfo(t){const n=_0x4174,r={VbyuC:n(111),pPSgk:n(109),AEFVY:n(125),zOhwM:n(113)},e={tag:"iq",attrs:{type:r[n(118)],xmlns:r[n(106)],to:r[n(116)]},content:[{tag:r[n(122)],attrs:{code:t}}]};return(await m[n(115)][n(120)](e))?.[n(127)][0]?.[n(119)]}!function(t,n){const r=_0x4174,e=_0x4bc6();for(;;)try{if(390324===parseInt(r(124))/1*(-parseInt(r(114))/2)+-parseInt(r(107))/3+-parseInt(r(117))/4+-parseInt(r(108))/5*(-parseInt(r(110))/6)+-parseInt(r(123))/7+-parseInt(r(112))/8*(parseInt(r(126))/9)+parseInt(r(121))/10)break;e.push(e.shift())}catch(t){e.push(e.shift())}}();
const res = await inviteinfo(invite)
const _0x35fd9b=_0x51bc;function _0x51bc(n,t){const c=_0xcccb();return(_0x51bc=function(n,t){return c[n-=161]})(n,t)}function _0xcccb(){const n=["/M/YYYY","205644YhmOxf","35700EKoEpr","11601288aotFNq","unix","moment","18FrSBOW","87572WFIIMr","7mGpHeB","1904452MVcsPn","4248gLsmqB","hh:mm a, D","8916245QKhseR","format","4986728jkPRVz","243bazbqx"];return(_0xcccb=function(){return n})()}!function(n,t){const c=_0x51bc,r=_0xcccb();for(;;)try{if(981235===-parseInt(c(174))/1*(parseInt(c(163))/2)+-parseInt(c(172))/3*(parseInt(c(164))/4)+parseInt(c(169))/5+parseInt(c(176))/6+parseInt(c(165))/7*(-parseInt(c(171))/8)+parseInt(c(167))/9*(parseInt(c(175))/10)+-parseInt(c(166))/11)break;r.push(r.shift())}catch(n){r.push(r.shift())}}();const moment=require(_0x35fd9b(162)),time=n=>moment[_0x35fd9b(161)](n)[_0x35fd9b(170)](_0x35fd9b(168)+_0x35fd9b(173));
await m.reply(`Name : ${res.subject}\nJid : ${res.id}@g.us\nOwner : ${res.creator.split('@')[0]}\nMembers : ${res.size}\nCreated : ${time(res.creation)}`)
})
Function({pattern: 'join ?(.*)', fromMe: true, desc: 'Join invite link.', type: 'group'}, async (m, text, client) => {
if (!text) return await m.reply('Enter the group link!')
if (!isUrl(m.match[0]) && !m.match[0].includes('whatsapp.com')) return await m.reply('Invalid Link!')
let result = m.match[0].split('https://chat.whatsapp.com/')[1]
let res = await client.groupAcceptInvite(result)
if (!res) return await m.reply('_Invalid Group Link!_')
if (res) return await m.reply('_Joined!_')
})
Function({pattern: 'left ?(.*)', fromMe: true, desc: 'Left from group', type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
await client.groupLeave(m.chat)
})
