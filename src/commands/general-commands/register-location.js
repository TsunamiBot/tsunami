const { SlashCommandBuilder } = require('discord.js');
//const Sequelize = require('sequelize');

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
		const userId = interaction.user.id;
		const userName = interaction.user.username;

		//Tries to add the user to the database
		try {
			const user = await models.users.create({
				id: userId,
				username: userName,
				latitude: latitude,
				longitude: longitude,
			});

			return interaction.reply(`${userName} location registered!`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('You are already registered!');
			}

			console.log(error);
			return interaction.reply('Something went wrong with adding your location!!');
		}
	},
};