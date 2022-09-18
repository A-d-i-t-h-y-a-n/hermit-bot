const { Function, antiWord } = require('../lib/');

Function({pattern: 'antiword ?(.*)', fromMe: true, desc: 'set antiword', type: 'group'}, async (message, match) => {
await antiWord(message, match, client)
})