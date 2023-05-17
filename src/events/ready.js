const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        console.log('I am the storm that is approaching...\n');
        console.log(`Ready! Logged in as ${client.user.tag}\n`);
	},
};