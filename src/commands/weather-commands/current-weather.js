const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { weatherAPIKey } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('current-weather')
		.setDescription('Gets the current weather of your registered location.'),
	async execute(interaction, models) {
		const userId = interaction.user.id;

		const user = await models.findOne({ where: { id: userId }});

		if (!user) return interaction.reply('It looks like you are not registered in our system. Please try using the "register-location" command.');

		try {
			const requestOptions = {
				method: 'GET',
				redirect: 'follow'
			  };
			const response = await fetch(`http://api.weatherapi.com/v1/current.json?aqi=no&q=${user.latitude},${user.longitude}&key=${weatherAPIKey}`, requestOptions);
			const data = await response.json();
			const currentWeather = data.current;
			const location = data.location;

			const embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle('Current Weather')
				.setAuthor({ name: 'Powered by WeatherAPI', iconURL: 'https://cdn.weatherapi.com/v4/images/weatherapi_logo.png', url: 'https://www.weatherapi.com' })
				.setDescription(`${currentWeather.condition.text}.\n\n To see other weather reports, consider using the "report" command.`)
				.setThumbnail(`https:${currentWeather.condition.icon}`)
				.addFields(
					{ name: 'Location', value: `${location.name}, ${location.region}, ${location.country}` },
					{ name: 'Temperature', value: `${currentWeather.temp_f} °F`, inline: true },
					{ name: 'Winds', value: `${currentWeather.wind_mph} mph`, inline: true },
					{ name: 'Precipitation', value: `${currentWeather.precip_in} in.`, inline: true },
				)
				.setTimestamp()

			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		catch(error) {
			console.error("Error:", error);
			return;
		}
	},
};