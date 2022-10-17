const {
	Function,
	antiWord,
	antiLink
} = require('../lib/');

Function({
	pattern: 'antiword ?(.*)',
	fromMe: true,
	desc: 'set antiword',
	type: 'group'
}, async (message, match) => {
	await antiWord(message, match, client)
})

Function({
	pattern: 'antilink ?(.*)',
	fromMe: true,
	desc: 'set antilink',
	type: 'group'
}, async (message, match, client) => {
	await antiLink(message, match, client)
})