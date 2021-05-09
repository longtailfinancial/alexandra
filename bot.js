const Discord = require('discord.js');      // Import module
const commandHandler = require("./commands");
require('dotenv').config()                  // To use .env files


/* 
    Client object that connects to the API itself
    to run the bot
*/
const client = new Discord.Client();   
client.login(process.env.BOTTOKEN);



// Whenever the bot is activated.
client.on('ready', () => {

    console.log("Chigurh initialized.");
});



client.on('message', commandHandler);