/*
 * Update: Feb. 17, 2022
 * Currently re-learning everything. Stopped at:
 * https://discordjs.guide/creating-your-bot/creating-commands.html#user-info-command
 *
 * Server now has registered commands and is replying properly.
 */

// Require the necessary discord.js classes


const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)

	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module.
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command' })
	}

});


// Login to Discord with your client's token
client.login(token);
