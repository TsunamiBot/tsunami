// Main logic for the bot.

const { Client, GatewayIntentBits, InteractionCollector } = require('discord.js');
const { token, guildId } = require('./config.json');
const fs = require('fs');
const client = new Client({ intents: 24065 });

// Tells if the bot is active.
client.on('ready', async () => {
  console.log('I am the storm that is approaching...\n');

  //Gets all user information.
  const guild = client.guilds.cache.get(guildId);
  const members = await guild.members.fetch();
});

// Checks for commands and will only fire if it is a valid command.
client.on('interactionCreate', (interation) => {
  if (interation.commandName === 'ping') { 
    interation.reply(`pong!`);
  }
});

// Logins in the bot.
client.login(token);