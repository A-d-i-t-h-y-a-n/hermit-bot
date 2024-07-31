const {
    Function
} = require("../lib/");

Function({
    pattern: 'react ?(.*)',
    fromMe: true,
    desc: 'React Message',
    type: 'whatsapp'
}, async (message, match) => {
    const reactionMessage = {
        react: {
            text: match[0],
            key: message.quoted_message.key
        }
    };
    await message.client.sendMessage(message.chat, reactionMessage);
});
