const {
	Function,
	isUrl,
	sleep,
	setPDM,
	getPDM,
	prefix,
	getUrl
} = require('../lib/')

const isBotAdmins = async (message) => {
	const groupMetadata = await message.client.groupMetadata(message.chat)
	const admins = await groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id)
	return admins.includes(message.user_id)
}

const isAdmin = async (message, user) => {
	const groupMetadata = await message.client.groupMetadata(message.chat)
	const admins = await groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id)
	return admins.includes(user)
}

Function({
	pattern: 'add ?(.*)',
	fromMe: true,
	desc: 'Adds someone to the group.',
	type: 'group'
}, async (m, text, client) => {
	if (!m.isGroup) return await m.reply('_This command only works in group chats_')
	const isbotAdmin = await isBotAdmins(m, client)
	if (!isbotAdmin) return await m.reply("I'm not an admin")
	if (!text && !m.quoted) return await m.reply('_Enter the number you want to add_')
	let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
	if (!users) return m.reply('_Enter the number you want to add_')
	let v = await client.onWhatsApp(users);
	n = v.map((n_jid) => n_jid.jid);
	if (!n.includes(users)) return await m.reply("_This number doesn't exists on whatsapp_");
	let vs = await client.GroupParticipantsUpdate(m, users)
	if (vs == '403') {
		await client.sendMessage(m.chat, {
			text: `_Couldn't add. Invite sent!_`,
			mentions: [users]
		})
	} else if (vs == '408') {
		await client.sendMessage(m.chat, {
			text: `_Couldn't add @${users.split('@')[0]} because they left the group recently. Try again later._`,
			mentions: [users]
		}, {
			quoted: m.data
		})
	} else if (vs == '401') {
		await client.sendMessage(m.chat, {
			text: `_Couldn't add @${users.split('@')[0]} because they blocked the bot number._`,
			mentions: [users]
		}, {
			quoted: m.data
		})
	} else if (vs == '200') {
		await client.sendMessage(m.chat, {
			text: `@${users.split('@')[0]}, Added to The Group`,
			mentions: [users]
		})
	} else if (vs == '409') {
		await client.sendMessage(m.chat, {
			text: `@${users.split('@')[0]}, Already in Group`,
			mentions: [users]
		})
	} else {
		await client.sendMessage(m.chat, {
			text: vs
		})
	}
})
Function({
	pattern: 'kick ?(.*)',
	fromMe: true,
	desc: 'kick someone in the group. Reply to message or tag a person to use command.',
	type: 'group'
}, async (message, match, client) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	const isbotAdmin = await isBotAdmins(message, message.client)
	if (!isbotAdmin) return await message.reply("I'm not an admin")
	if (message.reply_message !== false) {
		if (message.reply_message.data.key.fromMe) return false
		await message.client.sendMessage(message.jid, {
			text: `@${message.reply_message.data.participant.split('@')[0]}, Kicked From The Group`,
			mentions: [message.reply_message.data.participant]
		})
		await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.data.participant], 'remove')
	} else if (message.reply_message === false && message.mention !== false) {
		var etiketler = '';
		message.mention.map(async (user) => {
			etiketler += '@' + user.split('@')[0] + ',';
		});
		await message.client.sendMessage(message.jid, {
			text: `${etiketler} Kicked From The Group`,
			mentions: message.mention
		})
		await message.client.groupParticipantsUpdate(message.jid, message.mention, 'remove')
	} else {
		return await message.reply('*Give me a user!*');
	}
})

Function({
	pattern: 'promote ?(.*)',
	fromMe: true,
	desc: 'Makes any person an admin.',
	type: 'group'
}, async (message, match, client) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	const isbotAdmin = await isBotAdmins(message, message.client)
	if (!isbotAdmin) return await message.reply("I'm not an admin")
	if (message.reply_message !== false) {
		const admin = await isAdmin(message, message.reply_message.sender)
		if (admin) return await message.send('*User is already an admin*')
		await message.client.sendMessage(message.chat, {
			text: `_@${message.reply_message.data.participant.split('@')[0]}, Is promoted as admin!_`,
			mentions: [message.reply_message.data.participant]
		})
		await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.data.participant], 'promote')
	} else if (message.reply_message === false && message.mention !== false) {
		var user = '';
		message.mention.map(async (users) => {
			user += '@' + users.split('@')[0] + ',';
		});
		await message.client.sendMessage(message.chat, {
			text: `_${user} Is promoted as admin!_`,
			mentions: message.mention
		})
		await message.client.groupParticipantsUpdate(message.jid, message.mention, 'promote')
	} else {
		return await message.reply('*Give me a user!*');
	}
})

Function({
	pattern: 'demote ?(.*)',
	fromMe: true,
	desc: 'Takes the authority of any admin.',
	type: 'group'
}, async (message, match, client) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	const isbotAdmin = await isBotAdmins(message, message.client)
	if (!isbotAdmin) return await message.reply("I'm not an admin")
	if (message.reply_message !== false) {
		const admin = await isAdmin(message, message.reply_message.sender)
		await message.client.sendMessage(message.chat, {
			text: `_@${message.reply_message.data.participant.split('@')[0]}, Is no longer an admin!_`,
			mentions: [message.reply_message.data.participant]
		})
		await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.data.participant], 'demote')
	} else if (message.reply_message === false && message.mention !== false) {
		var user = '';
		message.mention.map(async (users) => {
			user += '@' + users.split('@')[0] + ',';
		});
		await message.client.sendMessage(message.chat, {
			text: `_${user} Is no longer an admin!_`,
			mentions: message.mention
		})
		await message.client.groupParticipantsUpdate(message.jid, message.mention, 'demote')
	} else {
		return await message.reply('*Give me a user!*');
	}
})

Function({
	pattern: 'mute ?(.*)',
	fromMe: true,
	desc: 'Mute the group chat. Only the admins can send a message.',
	type: 'group'
}, async (message, match) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	const iamAdmin = await isBotAdmins(message)
	if (!iamAdmin) return await message.reply("I'm not an admin")
	if (!match || isNaN(match)) {
		await message.client.groupSettingUpdate(message.chat, 'announcement')
		await message.send('*Group Closed.*')
		return;
	}
	await message.client.groupSettingUpdate(message.chat, 'announcement')
	await message.send('_Group Muted for ' + match + ' mins_')
	await sleep(1000 * 60 * match)
	await message.client.groupSettingUpdate(message.chat, 'not_announcement')
	await message.send('*Group opened.*')
})
Function({
	pattern: 'unmute ?(.*)',
	fromMe: true,
	desc: 'Unmute the group chat. Anyone can send a message.',
	type: 'group'
}, async (message, match) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	if (!isBotAdmins) return await message.reply("I'm not an admin")
	if (!match || isNaN(match)) {
		await message.client.groupSettingUpdate(message.chat, 'not_announcement')
		await message.send('*Group opened.*')
		return;
	}
	await message.client.groupSettingUpdate(message.chat, 'not_announcement')
	await message.send('_Group Unmuted for ' + match + ' mins_')
	await sleep(1000 * 60 * match)
	await message.client.groupSettingUpdate(message.chat, 'announcement')
	await message.send('*Group Closed.*')
})

Function({
	pattern: 'invite ?(.*)',
	fromMe: true,
	desc: "Provides the group's invitation link.",
	type: 'group'
}, async (m, text, client) => {
	if (!m.isGroup) return await m.reply('_This command only works in group chats_')
	const isbotAdmin = await isBotAdmins(m, client)
	if (!isbotAdmin) return await m.reply("I'm not an admin")
	const response = await client.groupInviteCode(m.chat)
	await m.reply(`https://chat.whatsapp.com/${response}`)
})
Function({
	pattern: 'revoke ?(.*)',
	fromMe: true,
	desc: 'Revoke Group invite link.',
	type: 'group'
}, async (message, match) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	const isbotAdmin = await isBotAdmins(message, message.client)
	if (!isbotAdmin) return await message.reply("I'm not an admin")
	await message.client.groupRevokeInvite(message.jid)
	await message.send('_Revoked_')
})
Function({
	pattern: 'ginfo ?(.*)',
	fromMe: true,
	desc: 'Shows group invite info',
	type: 'group'
}, async (message, match) => {
	match = match || message.reply_message.text
	if (!match) return await message.reply('*Need Group Link*\n_Example : ginfo group link_')
	const [link, invite] = match.match(/chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i) || []
	if (!invite) return await message.reply('*Invalid invite link*')
	try {
		const response = await message.client.groupGetInviteInfo(invite)
		await message.send("id: " + response.id + "\nsubject: " + response.subject + "\nowner: " + `${response.owner ? response.owner.split('@')[0] : 'unknown'}` + "\nsize: " + response.size + "\nrestrict: " + response.restrict + "\nannounce: " + response.announce + "\ncreation: " + require('moment-timezone')(response.creation * 1000).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss') + "\ndesc" + response.desc)
	} catch (error) {
		await message.reply('*Invalid invite link*')
	}
})
Function({
	pattern: 'join ?(.*)',
	fromMe: true,
	desc: 'Join invite link.',
	type: 'group'
}, async (message, match, client) => {
	match = getUrl(match || message.reply_message.text)
	if (!match) return await message.reply('_Enter the group link!_')
	if (!isUrl(match) && !match.includes('whatsapp.com')) return await message.reply('*Invalid Link!*')
	let result = match.split('https://chat.whatsapp.com/')[1]
	let res = await message.client.groupAcceptInvite(result)
	if (!res) return await message.reply('_Invalid Group Link!_')
	if (res) return await message.reply('_Joined!_')
})

Function({
	pattern: 'left ?(.*)',
	fromMe: true,
	desc: 'Left from group',
	type: 'group'
}, async (message, text, client) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	await client.groupLeave(message.chat)
})

Function({
	pattern: 'lock',
	fromMe: true,
	desc: "only allow admins to modify the group's settings",
	type: 'group'
}, async (message, match, client) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	const isbotAdmin = await isBotAdmins(message)
	if (!isbotAdmin) return await message.send("I'm not an admin")
	const meta = await message.client.groupMetadata(message.chat)
	if (meta.restrict) return await message.send("_Already only admin can modify group settings_")
	await client.groupSettingUpdate(message.chat, 'locked')
	return await message.send("*Only admin can modify group settings*")
})

Function({
	pattern: 'unlock',
	fromMe: true,
	desc: "allow everyone to modify the group's settings -- like display picture etc.",
	type: 'group'
}, async (message, match, client) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	const isbotAdmin = await isBotAdmins(message)
	if (!isbotAdmin) return await message.send("I'm not an admin")
	const meta = await message.client.groupMetadata(message.chat)
	if (!meta.restrict) return await message.send("_Already everyone can modify group settings_")
	await client.groupSettingUpdate(message.chat, 'unlocked')
	return await message.send("*Everyone can modify group settings*")
})

Function({
	pattern: 'gname ?(.*)',
	fromMe: true,
	desc: "To change the group's subject",
	type: 'group'
}, async (message, match, client) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	match = match || message.reply_message.text
	if (!match) return await message.send('*Need Subject!*\n*Example: gname New Subject!*.')
	const meta = await message.client.groupMetadata(message.chat)
	if (!meta.restrict) {
		await client.groupUpdateSubject(message.chat, match)
		return await message.send("*Subject updated*")
	}
	const isbotAdmin = await isBotAdmins(message)
	if (!isbotAdmin) return await message.send("I'm not an admin")
	await client.groupUpdateSubject(message.chat, match)
	return await message.send("*Subject updated*")
})

Function({
	pattern: 'gdesc ?(.*)',
	fromMe: true,
	desc: "To change the group's description",
	type: 'group'
}, async (message, match, client) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	match = match || message.reply_message.text
	if (!match) return await message.send('*Need Description!*\n*Example: gdesc New Description!*.')
	const meta = await message.client.groupMetadata(message.chat)
	if (!meta.restrict) {
		await client.groupUpdateDescription(message.chat, match)
		return await message.send("*Description updated*")
	}
	const isbotAdmin = await isBotAdmins(message)
	if (!isbotAdmin) return await message.send("I'm not an admin")
	await client.groupUpdateDescription(message.chat, match)
	return await message.send("*Description updated*")
})

Function({
	pattern: 'pdm ?(.*)',
	fromMe: true,
	desc: 'promote demote message',
	type: 'group'
}, async (message, match, client) => {
	if (!message.isGroup) return await message.reply('_This command only works in group chats_')
	const groupMetadata = await message.client.groupMetadata(message.jid)
	let pdm = await getPDM(message.jid);
	let buttons = [{
			buttonId: prefix + 'pdm on',
			buttonText: {
				displayText: 'ON'
			},
			type: 1
		},
		{
			buttonId: prefix + 'pdm off',
			buttonText: {
				displayText: 'OFF'
			},
			type: 1
		}
	]
	let ispdm = pdm ? true : false
	const buttonMessage = {
		text: 'Pdm Manager',
		footer: 'Group Name : ' + groupMetadata.subject + '\nPdm status : ' + ispdm,
		buttons: buttons,
		headerType: 1
	}

	if (!match) {
		await message.client.sendMessage(message.jid, buttonMessage)
		return;
	}
	if (match == 'on' || match == 'off') {
		await setPDM(message.jid, match)
		await message.send(`_pdm ${match == 'on' ? 'Activated' : 'Deactivated'}_`)
	}
})