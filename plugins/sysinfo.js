const { Function } = require('../lib/');
const os = require('os');
const si = require('systeminformation');

Function({
    pattern: 'sysinfo ?(.*)',
    fromMe: true,
    desc: 'Check system information and performance metrics.',
    type: 'user'
}, async (message, match, client) => {
    try {
        const msg = await message.reply('Collecting system information...');
        
        const [cpu, mem, disk] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.fsSize()
        ]);

        const cpuLoad = os.loadavg()[0];
        const cpuCount = os.cpus().length;
        const cpuUsage = (cpuLoad / cpuCount * 100).toFixed(2);

        const totalMemGB = (mem.total / (1024 * 1024 * 1024)).toFixed(2);
        const usedMemGB = (mem.used / (1024 * 1024 * 1024)).toFixed(2);
        const freeMemGB = (mem.free / (1024 * 1024 * 1024)).toFixed(2);

        const totalDiskGB = disk.reduce((acc, drive) => acc + drive.size, 0) / (1024 * 1024 * 1024);
        const usedDiskGB = disk.reduce((acc, drive) => acc + drive.used, 0) / (1024 * 1024 * 1024);

        const nodeRuntime = formatDetailedTime(process.uptime());

        const infoMessage = `*🖥️ System Information Report*

*CPU Information:*
• Model: ${cpu.manufacturer} ${cpu.brand}
• Cores: ${cpu.physicalCores} physical, ${cpu.cores} logical
• Speed: ${cpu.speed} GHz
• Current Usage: ${cpuUsage}%

*Memory Status:*
• Total RAM: ${totalMemGB} GB
• Used RAM: ${usedMemGB} GB
• Free RAM: ${freeMemGB} GB
• Usage: ${((mem.used / mem.total) * 100).toFixed(2)}%

*Storage Information:*
• Total Space: ${totalDiskGB.toFixed(2)} GB
• Used Space: ${usedDiskGB.toFixed(2)} GB
• Free Space: ${(totalDiskGB - usedDiskGB).toFixed(2)} GB
• Usage: ${((usedDiskGB / totalDiskGB) * 100).toFixed(2)}%

*System Details:*
• OS: ${os.type()} ${os.release()}
• Architecture: ${os.arch()}
• Platform: ${os.platform()}
• Hostname: ${os.hostname()}
• Node Runtime: ${nodeRuntime}
• Node Version: ${process.version}`;

        await msg.edit(infoMessage);
        
    } catch (err) {
        console.error('Error collecting system information:', err);
        await msg.edit('Error collecting system information. Please try again later.');
    }
});

function formatDetailedTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = Math.floor(seconds % 60);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);
    
    return parts.join(' ');
}
