const { Function, prefix } = require('../lib/');
const config = require('../config')
const simpleGit = require('simple-git');
const git = simpleGit();
const pm2 = require('pm2');
if (config.KOYEB_API_KEY || process.env.PORT) {

pm2.connect(function(err) {
    if (err) {
        console.error(err);
        process.exit(2);
    }
    
    pm2.start({
        script: 'keep_alive.js',
        name: 'keep-alive'
    }, function(err, apps) {
        pm2.disconnect();
        if (err) throw err;
    });
});
}

if (config.KOYEB_API_KEY) {
const Koyeb = require('node-koyeb-api');
const koyeb = new Koyeb(config.KOYEB_API_KEY);
	
Function({
    pattern: 'update ?(.*)',
    fromMe: true,
    desc: 'Update bot from GitHub repository',
    type: 'koyeb'
}, async (message, match, client) => {
	if (!match || (match.toLowerCase() == 'check')) {
        await git.fetch();
        const commits = await git.log(['main..origin/main']);
        let msg = ''; let no = 1;
        commits.all.map((commit) => {
        	msg += '' + no++ + '. ' + commit.message + '\n';
        });
        if (commits.total > 0) {
            const interactiveMessage = {
                title: 'New update available!\n\nChanges:',
                text: msg,
                footer: 'hermit-md',
                subtitle: 'hermit-md',
                buttons: [{
                    type: 'button',
                    display_text: 'Update Now',
                    id: prefix + 'update now'
                }]
            };
            
            return await client.interactiveMessage(message.jid, interactiveMessage);
        } else {
            return await message.send('_Bot is completely up-to-date!_');
        }
     }

    if (match && (match.toLowerCase() === 'now' || match.toLowerCase() === 'start')) {
        try {
            await message.send('_Build started_')
            let intervalId;
            intervalId = setInterval(async function() {
            	const { deployments } = await koyeb.getDeployments(config.KOYEB_APP_NAME)
                if (deployments[0].status == 'CANCELED') {
                	await message.reply('*Deployment Canceled*')
					clearInterval(intervalId);
                } else if (deployments[0].status == 'STOPPED') {
                	await message.reply('*Deployment Stopped*')
	                clearInterval(intervalId);
				} else if (deployments[0].status == 'STARTING') {
					await message.send('_Successfully Updated!_');
					await message.send('_Restarting..._')
					clearInterval(intervalId);
					await require('pm2').stop('hermit-md');
				}
             }, 5000);
            await koyeb.reDeploy(config.KOYEB_APP_NAME);
        } catch (error) {
            await message.send(`_Error during update: ${error.message}_`);
        }
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
            await require('pm2').stop('hermit-md');
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
        await require('pm2').stop('hermit-md');
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
        const vars = envVars.find(v => v.key === match.trim().toUpperCase());
        if (vars) {
            await message.send(`_${vars.key} : ${vars.value}_`);
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
