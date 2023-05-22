const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { weatherAPIKey } = require('../../config.json');
const { convertToStandardDateTime } = require('../../utilities/timeUtil.js');
const { optimize } = require('webpack');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('forecast')
		.setDescription('Replies with Pong!')
		.addStringOption(option =>
			option.setName('outlook')
				.setDescription('Displays the forecast up to three days!')
				.setRequired(true)
				.addChoices(
					{ name: 'Three Day Overview', value: 'three_day'},
					{ name: 'First Day Hourly', value: 'first_day_hourly'},
					{ name: 'Second Day Hourly', value: 'second_day_hourly'},
					{ name: 'Third Day Hourly', value: 'third_day_hourly'}
				)),
	async execute(interaction, models) {
		const userId = interaction.user.id;
		const outlook = interaction.options.getString('outlook');

		const user = await models.findOne({ where: { id: userId }});

		if (!user) return interaction.reply('It looks like you are not registered in our system. Please try using the "register-location" command.');

		try {
			const requestOptions = {
				method: 'GET',
				redirect: 'follow'
			};
			
			const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?aqi=no&days=3&alerts=no&q=${user.latitude},${user.longitude}&key=${weatherAPIKey}`, requestOptions);
			const data = await response.json();
			const forecast = data.forecast.forecastday;
			const location = data.location;
			const standardDateTime = convertToStandardDateTime(location.localtime);

			let embeds = [];
			switch(outlook) {
				case 'three_day':
					forecast.forEach(data => {
						const weatherEmbed = new EmbedBuilder()
							.setThumbnail(`https:${data.day.condition.icon}`)
							.setColor(0x0099FF)
							.setAuthor({ name: 'Powered by WeatherAPI', iconURL: 'https://cdn.weatherapi.com/v4/images/weatherapi_logo.png', url: 'https://www.weatherapi.com' })
							.setTitle(`${data.date}`)
							.addFields({ name: "Location", value: `${location.name}, ${location.region}, ${location.country}` })
							.addFields({ name: "Conditions", value: `${data.day.condition.text}` })
							.addFields({ name: "High", value: `${data.day.maxtemp_f} °F`, inline: true })
							.addFields({ name: "Average", value: `${data.day.avgtemp_f} °F`, inline: true })
							.addFields({ name: "Low", value: `${data.day.mintemp_f} °F`, inline: true })
							.addFields({ name: "Chance of Rain", value: `${data.day.daily_chance_of_rain}%`, inline: true })
							.addFields({ name: "Chance of Snow", value: `${data.day.daily_chance_of_snow}%`, inline: true })
							.addFields({ name: "Total Precipitation", value: `${data.day.totalprecip_in} in.`, inline: true })
							.addFields({ name: "Wind Speed", value: `${data.day.maxwind_mph} mph`, inline: true })
							.addFields({ name: "Average Humidity", value: `${data.day.avghumidity}`, inline: true })
							.addFields({ name: "UV", value: `${data.day.uv}`, inline: true })
							.setTimestamp();
						embeds.push(weatherEmbed);
					});
					return interaction.reply({ embeds: embeds, ephemeral: true });
				case 'first_day_hourly':
					forecast[0].hour.forEach(data => {
						const weatherEmbed = new EmbedBuilder()
							.setThumbnail(`https:${data.condition.icon}`)
							.setColor(0x0099FF)
							.setAuthor({ name: 'Powered by WeatherAPI', iconURL: 'https://cdn.weatherapi.com/v4/images/weatherapi_logo.png', url: 'https://www.weatherapi.com' })
							.setTitle(`${standardDateTime}`)
							.addFields({ name: "Location", value: `${location.name}, ${location.region}, ${location.country}` })
							.addFields({ name: "Conditions", value: `${data.condition.text}` })
							.addFields({ name: "Temperature", value: `${data.temp_f} °F`, inline: true })
							.addFields({ name: "Wind Speed", value: `${data.wind_mph} mph`, inline: true })
							.addFields({ name: "Wind Direction", value: `${data.wind_dir}`, inline: true })
							.addFields({ name: "Chance of Rain", value: `${data.chance_of_rain}%`, inline: true })
							.addFields({ name: "Chance of Snow", value: `${data.chance_of_snow}%`, inline: true })
							.addFields({ name: "Precipitation", value: `${data.precip_in} in.`, inline: true })
							.setTimestamp();
						if (embeds.length < 6) {
							embeds.push(weatherEmbed);
						}
					});

					return interaction.reply({ embeds: embeds, ephemeral: true });
				case 'second_day_hourly':
					embed
						.setTitle('Second Day Overview')
						.setDescription(`No Forecast Avalible`)
					return interaction.reply({ embeds: [embed], ephemeral: true });
				case 'second_day_hourly':
					embed
						.setTitle('Third Day Overview')
						.setDescription(`No Forecast Avalible`)
					return interaction.reply({ embeds: [embed], ephemeral: true });
				default:
					embed
						.setTitle('No Forecast Avalible')
						.setDescription(`No Forecast Avalible`)
					return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}
		catch(error) {
			console.error("Error:", error);
			return;
		}
	},
};