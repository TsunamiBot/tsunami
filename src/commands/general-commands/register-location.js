const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register-location')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('pong!');
	},
};