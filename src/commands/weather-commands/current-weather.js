const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('current-weather')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('pong!');
	},
};