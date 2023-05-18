const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('view-location')
		.setDescription('Check your location in the database'),

	async execute(interaction, models) {

		try {
            const userId = interaction.user.id;
            const user = await models.users.findOne({
                where: {id: userId},
            });
            console.log('User: ', user);
			return interaction.reply(`${interaction.user.username} is registered at location ${location}`);
		}
		catch (error) {
            console.log(error);
			return interaction.reply('Something went wrong with getting your location!!');
		}

		
	},
};