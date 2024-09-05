module.exports = {
  apps: [
    {
      name: 'hermit-md',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '450M',
    },
  ],
};
