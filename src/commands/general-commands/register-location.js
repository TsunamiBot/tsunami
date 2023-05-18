const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('register-location')
		.setDescription('Adds user location to the database')
		.addNumberOption(option =>
			option
				.setName('latitude')
				.setDescription('Add nearby latitude')
				.setRequired(true))
		.addNumberOption(option =>
			option
				.setName('longitude')
				.setDescription('Add nearby longitude')
				.setRequired(true)),

	async execute(interaction, models) {
		const latitude = interaction.options.getNumber('latitude');
		const longitude = interaction.options.getNumber('longitude');

		console.log(`Latitude: ${latitude} Longitude: ${longitude}`);

		await interaction.reply('pong!');
	},
};