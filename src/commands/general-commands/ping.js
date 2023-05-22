const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		try {
			const requestOptions = {
				method: 'GET',
				redirect: 'follow'
			  };
			const response = await fetch(`https://cataas.com/cat?json=true`, requestOptions);
			const data = await response.json();
			const url = data.url;
	
	
			const embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle('Pong!')
				.setDescription(`Get ponged.`)
				.setImage(`https://cataas.com${url}`)
				.setTimestamp()
	
			return interaction.reply({ embeds: [embed] });
		}
		catch(error) {
			console.error("Error:", error);
			return;
		}
	},
};