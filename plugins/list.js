const {
    Function,
    Fancy,
    commands,
    isPublic
} = require("../lib/");

Function({
    pattern: 'list$',
    fromMe: isPublic,
    dontAddCommandList: true
}, async (message) => {
    let msg = '';
    let no = 1;

    const commandList = commands
        .filter(command => command.dontAddCommandList === false && command.pattern !== undefined)
        .map(command => {
            const patternMatch = command.pattern.toString().match(/(\W*)([A-Za-z0-9_ğüşiö ç]*)/);
            const commandName = patternMatch ? patternMatch[2].trim() : 'Unknown';
            return `${no++}. ${commandName}\n${command.desc}\n\n`;
        });

    msg = commandList.join('');

    await message.reply(await Fancy(msg.trim(), 32));
});
