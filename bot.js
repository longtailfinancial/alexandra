const Discord = require('discord.js');      // Import module
const fs = require('fs');                   // File system module


const prefix = "!";                         // Every command starts with "!"
require('dotenv').config()                  // To use .env files


/* 
    Client object that connects to the API itself
    to run the bot
*/
const client = new Discord.Client();

/*
    Collections are an extension of JavaScript's native
    map class.

*/
client.commands = new Discord.Collection();
client.login(process.env.BOTTOKEN);


// Whenever the bot is activated.
client.on('ready', () => {
    console.log("Chigurh initialized.");
});



//------------=| Gathering Channel Data |=--------------------//



// Gathering the commands from the files in "commands" directory.
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('message', message => {
    console.log(message.content);

	if (!message.content.startsWith(prefix) || message.author.bot) return;


	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

	try {
        command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});


