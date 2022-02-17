// doc src: https://discordjs.guide/creating-your-bot/creating-commands.html#command-deployment-script
// Require the necessary discord.js classes

const { Client, Intents } = require('discord.js');
const { token } = require('../config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
})

// Login to Discord with client token.
client.login(token);
