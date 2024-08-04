const { Function, getJson } = require('../lib/');
const pm2 = require('pm2');
const config = require('../config');

if (config.RENDER_NAME && config.RENDER_API) {
	
const Render = require('../lib/render');
const render = new Render(config.RENDER_API, config.RENDER_NAME);

Function({
    pattern: 'setvar ?(.*)',
    fromMe: true,
    desc: 'Set Render environment variables',
    type: 'render'
}, async (message, match, client) => {
    if (!match) return await message.send('*Need Key and Value*\n_Example: setvar PREFIX:,_');
    const [varKey, varValue] = match.split(':');
    if (varKey && varValue) {
        try {
            await render.setVar(varKey.toUpperCase(), varValue);
            await message.send(`*_Successfully Set_* *${varKey}:${varValue}*\n_ReDeploying..._`);
            await new Promise((resolve) => pm2.stop('hermit-md', resolve));
        } catch (error) {
            await message.send(`Error: ${error.message}`);
        }
    }
});

Function({
    pattern: 'getvar ?(.*)',
    fromMe: true,
    desc: 'Get Render environment variable',
    type: 'render'
}, async (message, match, client) => {
    if (!match) return await message.send('*Need Variable Key*\n_Example: getvar PREFIX_');
    try {
        const value = await render.getVar(match.toUpperCase());
        if (value) {
            await message.send(`*${match}:* ${value}`);
        } else {
            await message.send(`*${match}* not found.`);
        }
    } catch (error) {
        await message.send(`Error: ${error.message}`);
    }
});

Function({
    pattern: 'delvar ?(.*)',
    fromMe: true,
    desc: 'Delete Render environment variable',
    type: 'render'
}, async (message, match, client) => {
    if (!match) return await message.send('*Need Variable Key*\n_Example: delvar PREFIX_');
    try {
        const result = await render.delVar(match.toUpperCase());
        if (result) {
            await message.send(`*_Successfully Deleted_* *${match}*\n_ReDeploying..._`);
            await new Promise((resolve) => pm2.stop('hermit-md', resolve));
        } else {
            await message.send(`Failed to delete *${match}* or it doesn't exist.`);
        }
    } catch (error) {
        await message.send(`Error: ${error.message}`);
    }
});

Function({
    pattern: 'allvar',
    fromMe: true,
    desc: 'Get all Render environment variables',
    type: 'render'
}, async (message, match, client) => {
    try {
        const vars = await render.allVar();
        if (vars && vars.length > 0) {
            const varList = vars.map(v => `*${v.envVar.key}:* ${v.envVar.value}`).join('\n');
            await message.send(`*All Environment Variables:*\n\n${varList}`);
        } else {
            await message.send('No environment variables found.');
        }
    } catch (error) {
        await message.send(`Error: ${error.message}`);
    }
});

Function({
    pattern: 'restart',
    fromMe: true,
    desc: 'Restart Render app',
    type: 'render'
}, async (message, match, client) => {
    try {
        await message.send('_Restarting..._');
        await render.restart();
        await new Promise((resolve) => pm2.stop('hermit-md', resolve));
    } catch (error) {
        await message.send(`Error: ${error.message}`);
    }
});

const url = render.getUrl();

setInterval(async () => {
  try {
        await getJson(url);
   } catch (error) {
        console.error(error.message);
   }
}, 60 * 1000);

}