const { Function, getMessage, formatDuration } = require('../lib/');

Function({
	pattern: 'msgs ?(.*)',
	fromMe: true,
	desc: 'Gives an overview of the total messages in the group',
	type: 'group'
}, async (message, match, client) => {
  if (!message.isGroup) return await message.reply('_This command only works in group chats_')
  const userId = message.mention[0] || message.reply_message?.sender;
  const data = await getMessage(message.jid);
  const timeNow = new Date().getTime();
  let msg = '';
  if (userId) {
    const user = await getMessage(message.jid, userId);
    msg += '*Number :* ' + userId.split("@")[0] + '\n*Name :* ' + (user.name.replace( /[\r\n]+/gm, "") || 'Unknown') + '\n';
    Object.keys(user.type).map(item => msg += '*' + item + ' :* ' + user.type[item] + '\n');
    msg += '*Total :* ' + user.total + '\n';
    msg += '*lastActivity :* ' + formatDuration((timeNow - user.time) / 1000) + ' ago\n\n';
  } else {
    Object.keys(data).map(user => {
      const { name, total, type, time } = data[user];
      msg += '*Number :* ' + user.split("@")[0] + '\n*Name :* ' + (name.replace( /[\r\n]+/gm, "") || 'Unknown') + '\n';
      Object.keys(type).map(item => msg += '*' + item + ' :* ' + type[item] + '\n');
      msg += '*Total :* ' + total + '\n';
      msg += '*lastActivity :* ' + formatDuration((timeNow - time) / 1000) + ' ago\n\n';
    });
  }
  return await message.send(msg.trim());
})