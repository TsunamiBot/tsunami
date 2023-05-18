// Main logic for the bot.
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events } = require('discord.js');
const { token } = require('./config.json');
const Sequelize = require('sequelize');
const { users } = require('./models.js');

const client = new Client({ intents: 24065 });

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const models = {
	users: sequelize.define('users', users),
};

client.commands = new Collection();

// Slash command logic.
//__dirname gets the directory the file is in, then appends the commands folder path
const foldersPath = path.join(__dirname, 'commands');
//Reads folder structure of the folder path
const commandFolders = fs.readdirSync(foldersPath);

//Loops through folders within the directory
//Appends the client commands property with command names and filepath
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Event logic for the index page.
client.once(Events.ClientReady, c => {
	//Sync the db
	sequelize.sync()
		.then(() => {
			console.log('Database synchronized');
		})
		.catch((error) => {
			console.error('Failed to synchronize database:', error);
		});
	console.log(`Ready! Logged in as ${c.user.tag}\n`);
	console.log(`I am the storm that is approaching...\n`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		// If a command needs the database, make sure you put in the models parameter inside of the execute function of that command.
		await command.execute(interaction, models);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Logins in the bot.
client.login(token);