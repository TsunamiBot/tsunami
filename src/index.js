// Main logic for the bot.
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: 24065 });

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
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Logins in the bot.
client.login(token);