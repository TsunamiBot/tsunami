const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { weatherAPIKey } = require('../../config.json');
const { convertToStandardDateTime, convertToStandardTime } = require('../../utilities/timeUtil.js');
const { optimize } = require('webpack');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('forecast')
		.setDescription('Displays a forecast of weather up to three days in advanced.')
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

			let embeds = [];
			let weatherEmbed = new EmbedBuilder();
			let tableFields;
			switch(outlook) {
				case 'three_day':
					forecast.forEach(data => {
						const weatherDayEmbed = new EmbedBuilder()
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
						embeds.push(weatherDayEmbed);
					});
					return interaction.reply({ embeds: embeds, ephemeral: true });
				case 'first_day_hourly':
					weatherEmbed
						.setColor(0x0099FF)
						.setAuthor({ name: 'Powered by WeatherAPI', iconURL: 'https://cdn.weatherapi.com/v4/images/weatherapi_logo.png', url: 'https://www.weatherapi.com' })
						.setTitle(`${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}  - 24 Hour Overview`)
						.setDescription(`${location.name}, ${location.region}, ${location.country}`)
						.setTimestamp();
						tableFields = forecast[0].hour.map(data => {
							return {
							  name: `
							  	❓---${convertToStandardTime(data.time)}---❓
							  `,
							  value: `
							  	᲼
								**Conditions:** ${data.condition.text}
								**Temperature:** ${data.temp_f} °F
								**Wind Speed:** ${data.wind_mph} mph
								**Wind Direction:** ${data.wind_dir}
								**Chance of Rain:** ${data.chance_of_rain}%
								**Chance of Snow:** ${data.chance_of_snow}%
								**Precipitation:** ${data.precip_in} in.
							  `,
							  inline: true
							};
						});
						  
						weatherEmbed.addFields(tableFields);

					return interaction.reply({ embeds: [weatherEmbed], ephemeral: true });
				case 'second_day_hourly':
					weatherEmbed
						.setColor(0x0099FF)
						.setAuthor({ name: 'Powered by WeatherAPI', iconURL: 'https://cdn.weatherapi.com/v4/images/weatherapi_logo.png', url: 'https://www.weatherapi.com' })
						.setTitle(`${new Date().getMonth() + 1}/${new Date().getDate() + 1}/${new Date().getFullYear()}  - 24 Hour Overview`)
						.setDescription(`${location.name}, ${location.region}, ${location.country}`)
						.setTimestamp();
						tableFields = forecast[1].hour.map(data => {
							return {
							  name: `
							  	❓---${convertToStandardTime(data.time)}---❓
							  `,
							  value: `
							  	᲼
								**Conditions:** ${data.condition.text}
								**Temperature:** ${data.temp_f} °F
								**Wind Speed:** ${data.wind_mph} mph
								**Wind Direction:** ${data.wind_dir}
								**Chance of Rain:** ${data.chance_of_rain}%
								**Chance of Snow:** ${data.chance_of_snow}%
								**Precipitation:** ${data.precip_in} in.
							  `,
							  inline: true
							};
						});
						  
						weatherEmbed.addFields(tableFields);

					return interaction.reply({ embeds: [weatherEmbed], ephemeral: true });
				case 'third_day_hourly':
					weatherEmbed
						.setColor(0x0099FF)
						.setAuthor({ name: 'Powered by WeatherAPI', iconURL: 'https://cdn.weatherapi.com/v4/images/weatherapi_logo.png', url: 'https://www.weatherapi.com' })
						.setTitle(`${new Date().getMonth() + 1}/${new Date().getDate() + 2}/${new Date().getFullYear()}  - 24 Hour Overview`)
						.setDescription(`${location.name}, ${location.region}, ${location.country}`)
						.setTimestamp();
						tableFields = forecast[2].hour.map(data => {
							return {
							  name: `
							  	❓---${convertToStandardTime(data.time)}---❓
							  `,
							  value: `
							  	᲼
								**Conditions:** ${data.condition.text}
								**Temperature:** ${data.temp_f} °F
								**Wind Speed:** ${data.wind_mph} mph
								**Wind Direction:** ${data.wind_dir}
								**Chance of Rain:** ${data.chance_of_rain}%
								**Chance of Snow:** ${data.chance_of_snow}%
								**Precipitation:** ${data.precip_in} in.
							  `,
							  inline: true
							};
						});
						  
						weatherEmbed.addFields(tableFields);

					return interaction.reply({ embeds: [weatherEmbed], ephemeral: true });
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