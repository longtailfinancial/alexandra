/*
 * Update: Feb. 17, 2022
 * Currently re-learning everything. Stopped at:
 * https://discordjs.guide/creating-your-bot/creating-commands.html#user-info-command
 *
 * Server now has registered commands and is replying properly.
 */

// Require the necessary discord.js classes


const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)

client.once('ready', () => {
		console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
		if (!interaction.isCommand()) return;

		const { commandName } = interaction;

		if (commandName === 'ping') {
				await interaction.reply('Pong!');
		} else if (commandName === 'server') {
				await interaction.reply(`Server name: ${interaction.guild.name}\nTotal Members: ${interaction.guild.memberCount}`);
		} else if (commandName === 'user') {
				await interaction.reply(`Your tag: ${interaction.user.tag}\nYour ID: ${interaction.user.id}`);
		}
});


// Login to Discord with your client's token
client.login(token);
