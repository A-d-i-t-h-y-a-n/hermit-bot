const {
	Function,
	setCmd,
	delCmd,
	prepareCmd,
	getCmdList,
	isPublic
} = require("../lib/");

Function({
    pattern: 'setcmd ?(.*)',
    fromMe: true,
    desc: 'To set audio/image/video as a command',
    type: 'user'
}, async (message, match, client) => {
    if (!message.quoted) return await message.reply('_Reply to an image/video/audio/sticker_');
    if (!match) return await message.reply('_Example: setcmd ping_');
    if (!message.quoted.data.message[message.quoted.mtype].fileSha256) return await message.reply('_Failed_');
    
    const setcmd = await setCmd(message, match);
    if (!setcmd) return await message.reply('_Failed_');
    
    await message.reply('_Success_');
});

Function({
    pattern: 'delcmd ?(.*)',
    fromMe: true,
    desc: 'To delete audio/image/video command',
    type: 'user'
}, async (message, match, client) => {
    if (!message.quoted) return await message.reply('_Reply to an image/video/audio/sticker_');
    
    let hash = message.quoted.data.message[message.quoted.mtype].fileSha256.toString('base64');
    if (!hash) return await message.reply('_Failed_');
    
    const delcmd = await delCmd(message);
    if (!delcmd) return await message.reply('_Failed_');
    
    await message.reply('_Success_');
});

Function({
    pattern: 'listcmd ?(.*)',
    fromMe: true,
    desc: 'To get list of commands',
    type: 'user'
}, async (message) => {
    const cmd = await getCmdList();
    await message.reply(cmd);
});

const mediaTypes = ['audio', 'sticker', 'video', 'image'];

mediaTypes.forEach(type => {
    Function({
        on: type,
        fromMe: isPublic
    }, async (message) => {
        await prepareCmd(message);
    });
});
