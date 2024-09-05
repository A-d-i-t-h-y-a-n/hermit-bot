const {
	Function,
	prefix
} = require('../lib/');
const config = require('../config')
const simpleGit = require('simple-git');
const git = simpleGit();
const pm2 = require('pm2');

Function({
	pattern: 'update ?(.*)',
	fromMe: true,
	desc: 'update bot',
	type: 'user'
}, async (message, match) => {
	if (!match || (match.toLowerCase() == 'check')) {
		await git.fetch();
		const commits = await git.log(['main..origin/main']);
		let msg = '';
		let no = 1;
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

			return await message.client.interactiveMessage(message.jid, interactiveMessage);
		} else {
			return await message.send('_Bot is completely up-to-date!_');
		}
	}

	if (match && (match.toLowerCase() === 'now' || match.toLowerCase() === 'start')) {
		await git.fetch();
		const branches = await git.branch(['-r']);
        const remoteBranch = branches.all.find(branch => branch.includes('origin/main'));
        if (!remoteBranch) return;
		const commits = await git.log([`HEAD..${remoteBranch}`]);
		if (!commits.total > 0) return await message.send('_Bot is completely up-to-date!_');
		if (config.KOYEB_API_KEY) {
			const Koyeb = require('node-koyeb-api');
			const koyeb = new Koyeb(config.KOYEB_API_KEY);

			try {
				await message.send('_Build started_')
				let intervalId;
				intervalId = setInterval(async function() {
					const {
						deployments
					} = await koyeb.getDeployments(config.KOYEB_APP_NAME)
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
						await pm2.stop('hermit-md');
					}
				}, 5000);
				await koyeb.reDeploy(config.KOYEB_APP_NAME);
			} catch (error) {
				await message.send(`_Error during update: ${error.message}_`);
			}
		} else if (config.RENDER_API) {
			const Render = require('../lib/render');
			const render = new Render(config.RENDER_API, config.RENDER_NAME);
			let intervalId;
			intervalId = setInterval(async function() {
				const deployment = await render.deployInfo('1');
				if (deployment[0].deploy.status == 'canceled') {
					await message.reply('*Deploy Cancelled*')
					clearInterval(intervalId);
				} else if (deployment[0].deploy.status == 'live') {
					await message.send('_Successfully Updated!_');
					await message.send('_Restarting..._')
					clearInterval(intervalId);
					await pm2.stop('hermit-md');
				}
			}, 5000);
		   await render.deploy('clear');
		   await message.send('_Build started_')
		} else {
			await git.reset('hard', ['HEAD'])
			await git.pull()
			await message.send('_Updated_')
			await message.send('_Rebooting..._')
			return await pm2.restart('hermit-md');
		}
	}
});