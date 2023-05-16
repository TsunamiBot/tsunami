const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

// List of commands.
const commands = [
    {
        name: 'ping',
        description: 'Replies back with a pong.'
    }
    // {
    //     name: 'beg',
    //     description: 'Begs for coins. Will only work if the user is out of coins.'
    // },
    // {
    //     name: 'balance',
    //     description: 'Checks the coin balance of a user.'
    // },
    // {
    //     name: 'race',
    //     description: 'Starts a horse race.'
    // },
    // {
    //     name: 'leaderboard',
    //     description: 'Displays a leaderboard of the server.'
    // },
    // {
    //     name: 'bet',
    //     description: 'Bets on a specified horse.',
    //     options: [
    //         {
    //             name: 'horse-number',
    //             description: 'The horse number.',
    //             type: ApplicationCommandOptionType.Integer,
    //             choices: [
    //                 {
    //                     name: 'horse-1',
    //                     value: 1,
    //                 },
    //                 {
    //                     name: 'horse-2',
    //                     value: 2,
    //                 },
    //                 {
    //                     name: 'horse-3',
    //                     value: 3,
    //                 },
    //                 {
    //                     name: 'horse-4',
    //                     value: 4,
    //                 },
    //                 {
    //                     name: 'horse-5',
    //                     value: 5,
    //                 },
    //             ],
    //             required: true,
    //         },
    //         {
    //             name: 'bet-amount',
    //             description: 'A bet amount from 1 - 10000.',
    //             type: ApplicationCommandOptionType.Integer,
    //             min_value: 1,
    //             max_value: 10000,
    //             required: true,
    //         },
    //     ],
    // },
];

// Sets the REST API
const rest = new REST({ version: '10' }).setToken(token);

// Calls the try block immediately upon launch in async, which registers the comamnds.
(async () => {
    try {
        console.log("Registering commands...");
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), 
            {
                body: commands
            }
        )

        console.log("Commands have been registered successfully!\n");
    } catch (error) {
        console.log(error);
    }
})();