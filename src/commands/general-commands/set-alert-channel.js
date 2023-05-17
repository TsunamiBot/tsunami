const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-alert-channel')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('pong!');
	},
};