const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { weatherAPIKey } = require('../../config.json');
//const Sequelize = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register-location')
		.setDescription('Adds user location to the database. Input as "Post Code", "IP address", "Lat,Long" or "city".')
		.addStringOption(option =>
			option
				.setName('location')
				.setDescription('Enter location: ')
				.setRequired(true)),

	async execute(interaction, models) {
		const location = interaction.options.getString('location');
		const userId = interaction.user.id;
		const userName = interaction.user.username;

		//Recieves location and searches to find similar locations by the same name
		try {

			//API Fetch Request
			const requestOptions = {
				method: 'GET',
				redirect: 'follow'
			  };

			const response = await fetch(`http://api.weatherapi.com/v1/search.json?key=${weatherAPIKey}&q=${location}`, requestOptions)
				.catch(error => console.log('error fetching location', error))
			const rawData = await response.json();
			const locationNum = rawData.length;
			let fields=[];

			//Add action row to prepare for button appending
			const actionRow = new ActionRowBuilder();

			//Add fields to a an empty set to be added to an embed
			for (let i = 0; i < locationNum; i++) {
				const data = rawData[i];
				const field = {
				  name: `${i+1}`,
				  value: `${data.name}, ${data.region}, ${data.country}`,
				};
			  
				fields.push(field);
			}
			
			//Builds the embed to be sent with response
			const embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle('Current Weather')
				.setAuthor({ name: 'Powered by WeatherAPI', iconURL: 'https://cdn.weatherapi.com/v4/images/weatherapi_logo.png', url: 'https://www.weatherapi.com' })
				.setDescription(`${location} returns the following locations. React with the correct location`)
				.setTimestamp()
			
			//Loops through fields to be added into the embed
			for (const field of fields) {
				const button = new ButtonBuilder()
					.setCustomId(`${field.name}`)
					.setLabel(`${field.name}`)
					.setStyle(ButtonStyle.Primary)
				
				const row = {
					name: `${field.name}`,
					value: `${field.value}`,
				}
				embed.addFields(row);
				actionRow.addComponents(button);
			}

			//Returns the reply
			const btnResponse = await interaction.reply({
				embeds: [embed],
				ephemeral: true,
				components: [actionRow],
			});

			try {
				const confirmation = await btnResponse.awaitMessageComponent({time: 60_000});
				//console.log(confirmation.customId);

				let num = 0;
				//console.log(rawData);
				for (const field of fields) {
					if (confirmation.customId === `${field.name}`) {
						//CustomID is just the array number +1 of the avaliable locations in rawData[]
						const data = rawData[confirmation.customId-1];
						//console.log(`Num: ${num}\n Raw data: ${data}`);
						const lat = data.lat;
						const long = data.lon;
						//Creates model in the SQLite database
						const user = await models.create({
							id: userId,
							username: userName,
							latitude: lat,
							longitude: long,
						});
						console.log("Model creation success");
						break;
					}
					else {
						num++
						console.log("Else");
						continue;
					}
				}

				btnResponse.delete();
				return confirmation.reply(`${userName} location registered!`);
			}
			catch (error) {
				console.log("Error", error);
			}
			
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