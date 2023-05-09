const { Client, GatewayIntentBits, InteractionCollector } = require('discord.js');
const { token, guildId } = require('./config.json');
const fs = require('fs');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Tells if the bot is active.
client.on('ready', async () => {
  console.log('Peta...The horse is here...');

  //Gets all user information.
  const guild = client.guilds.cache.get(guildId);
  const members = await guild.members.fetch();
});

// Logins in the bot.
client.login(token);