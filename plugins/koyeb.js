const config = require('../config')
if (config.KOYEB_API_KEY) {
const Koyeb = require('node-koyeb-api');
const koyeb = new Koyeb(config.KOYEB_API_KEY);

Function({
    pattern: 'update ?(.*)',
    fromMe: true,
    desc: 'Update bot from GitHub repository',
    type: 'koyeb'
}, async (message, match, client) => {
    if (match && match.toLowerCase() === 'check') {
        try {
            const status = await git.fetch();
            const diffSummary = await git.diffSummary(['HEAD', 'origin/main']);
            if (diffSummary.total > 0) {
                await message.send('_New updates are available!_');
            } else {
                await message.send('_No new updates available._');
            }
        } catch (error) {
            await message.send(`_Error during update check: ${error.message}_`);
        }
        return;
    }

    const msg = await message.reply('_Checking for updates..._');

    try {
        const status = await git.fetch();
        const diffSummary = await git.diffSummary(['HEAD', 'origin/main']);
        if (diffSummary.total === 0) {
            await msg.edit('_No new updates available._');
            return;
        }

        await message.send('_Updating..._');

        await koyeb.reDeploy(config.KOYEB_APP_NAME, (status) => {
            message.send(`_Redeployment status: ${status}_`);
        });

        await message.send('_Successfully Updated!_');
        
        await require('pm2').delete('all');
    } catch (error) {
        await message.send(`_Error during update: ${error.message}_`);
    }
});


Function({
    pattern: 'setvar ?(.*)',
    fromMe: true,
    desc: 'Set koyeb environment variables',
    type: 'koyeb'
}, async (message, match, client) => {
    if (!match) return await message.send('*Need Key and Value*\n_Example: setvar PREFIX:,_');
    const [varKey, varValue] = match.split(':');
    if (varKey && varValue) {
        try {
            await koyeb.setEnv({
                key: varKey.toUpperCase(),
                value: varValue,
                serviceName: config.KOYEB_APP_NAME
            });
            await message.send(`*_Successfully Set_* *${varKey}:${varValue}*\n_ReDeploying..._`);
            await require('pm2').delete('all');
        } catch (error) {
            await message.send(`Error: ${error.message}`);
        }
    }
});

Function({
    pattern: 'delvar ?(.*)',
    fromMe: true,
    desc: 'delete koyeb environment variables',
    type: 'koyeb'
}, async (message, match, client) => {
    if (!match) return await message.send('*Need Key*\n_Example: delvar PREFIX_');
    try {
        const envVars = await koyeb.getAllEnvVars(config.KOYEB_APP_NAME);
        const varToDelete = envVars.find(v => v.key === match.toUpperCase());
        if (!varToDelete) return await message.send('*Key Not Found*');
        
        await koyeb.setEnv({
            key: match.toUpperCase(),
            value: '',
            serviceName: config.KOYEB_APP_NAME
        });
        await message.send(`*${match.toUpperCase()} Deleted*\n_ReDeploying..._`);
        await require('pm2').delete('all');
    } catch (error) {
        await message.send(`Error: ${error.message}`);
    }
});

Function({
    pattern: 'getvar ?(.*)',
    fromMe: true,
    desc: 'Get koyeb environment variables',
    type: 'koyeb'
}, async (message, match, client) => {
    if (!match) return await message.send('*Need Key*\n_Example: getvar PREFIX_');
    try {
        const envVars = await koyeb.getAllEnvVars(config.KOYEB_APP_NAME);
        const var = envVars.find(v => v.key === match.trim().toUpperCase());
        if (var) {
            await message.send(`_${var.key} : ${var.value}_`);
        } else {
            await message.send('*Key Not Found*');
        }
    } catch (error) {
        await message.send(`Error: ${error.message}`);
    }
});

Function({
    pattern: 'allvar ?(.*)',
    fromMe: true,
    desc: 'Get all koyeb environment variables',
    type: 'koyeb'
}, async (message, match, client) => {
    try {
        const envVars = await koyeb.getAllEnvVars(config.KOYEB_APP_NAME);
        let msg = '';
        for (let x of envVars) {
            msg += `*${x.key}* : ${x.value}\n\n`;
        }
        await message.send(msg);
    } catch (error) {
        await message.send(`Error: ${error.message}`);
    }
});

}