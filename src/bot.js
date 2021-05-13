const Discord = require('discord.js');      // Import module
const fs = require('fs');                   // File system module
const chalk = require('chalk');				// For colored output
require('dotenv').config()                  // To use .env files

const prefix = "!";                         // Every command starts with "!"

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


function get_date_time () {
	
	let currentdate = new Date(); 
	let todays_date = currentdate.getDate() + "_"
    			   + (currentdate.getMonth()+1)  + "_" 
                   + currentdate.getFullYear();
			

	let todays_time =  currentdate.getHours() + ":"  
					+ currentdate.getMinutes() + ":" 
					+ currentdate.getSeconds();
	
	return [todays_date, todays_time];

}


function file_write_log(received_channel_object_array) {

	/*

		Each timelog is an object - Key is a string timestep, value is a 
		JSONArray[nameless array] of voice channel objects.

		A voice_channel_object is an object where the key is the voice channel name and the 
		value is a user object (containing user-id pairs). !This is made just outside the try-catch block 
		in log_voice_channels!

		So for each found voice channel, create an object. Key is channel name, 
		value is initallly an empty_array !This is made inside the try block!
			Then put name and userid together in an object ( key-pair ), then insert that into the empty array 
			(which is the value to channel object)

	*/



	let date_info = get_date_time();
	let today_date = date_info[0],
		today_time = date_info[1];

	let today_file = '../timelog/'+ today_date + '.json';

	let timestep_object = {};

	timestep_object[`${today_time}`] = received_channel_object_array;

	

	fs.access(today_file, (err) => {

		if(err) {

			console.log(`JSON for today's file: ${today_date}.json
			doesn't exist. Creating...`);


			const day_object = {
			
				"date": `${today_date}`,
				"log": [
					timestep_object
				]
			};

			const initial_day_object = JSON.stringify(day_object, null, 4);
		

			// This function is what actually creates the JSON.
			fs.appendFile(today_file, initial_day_object, (err) => {

				if(err) {
					console.error(err);
				} else {

					// initial_day_object will hold the encapsulating object
					// Leave this scope be.
				}

			});

		} else {

			console.log(`JSON for today's file: ${today_date}.json exists`);

			// Open up the object inside file.
			// Get the key of log (the nameless array containing timesteps)
			// Then simply append the next timestep object to it.
			// then close file.

		}

	});

}


function log_voice_channels() {

	// We do this by first identifying which servers are voice-type
	// Then listing the current users in each of them.

	// Filters all the channels available for voice type channnels
	const voiceChannelCount = client.channels.cache.filter(c => c.type ==='voice');

	//	Empty string, we gradually fill this with data.
	let log_string = ""; 

	// You also need to create the empty JSON array (contains individ channel objects) here along with the log_string
	channel_object_array = [];

	// For each voice channel
	for (let [key, value] of voiceChannelCount) {

		// This is how you get a channel by name.
		const vchannel_holder = client.channels.cache.find(channel => channel.name === value["name"]);

		console.log(`-------=| Users currently in ${value["name"]} `);

		log_string += value['name'] + '\n\n';  

		
		/*
			Create the channel_object here
			(vchannelname as key: str / empty JSON array as key)
			The key is filled one by one in try block below
		*/
		let channel_object = {};
		let user_container_array = [];


 		// Below this line, you must only do these if the collection isn't empty (try-catch)
		try {

			const guild_member_holder = vchannel_holder.members;

			// guild_member_holder is a dictionary, so we can iterate through it.
			const iter1 = guild_member_holder[Symbol.iterator]();

			// Loops through users found in a channel
			for (const item of iter1) {
				
				const user_name = item[1].user.username;
				const user_id = item[1].user.id;

				console.log('Username: ' + chalk.greenBright(user_name) + '  ID: ' + chalk.blueBright(user_id));
				log_string += '     ' + 'Username: '+ user_name + '  ID: ' + user_id + '\n\n';  

				// user object is created, with name as key and id as value.
				let user_object = {};
				user_object[user_name] = user_id;

				// user object is then inserted to user_container_array
				user_container_array.push(user_object);

			}
	
		} catch (error) {

			// Errors can be ignored, as empty channels are expected to have no 'user' member/property.
			console.log(error);
		}


	// The voice channel object is created, and the key is the channel name
	// and the value is the nameless array containing the individual user objects.
	channel_object[`${value['name']}`] = user_container_array;
	channel_object_array.push(channel_object);

	}

	file_write_log(channel_object_array);
}


// Whenever the bot is activated.
client.on('ready', () => {

    console.log("Alexandra_ initialized.");

	// Every five seconds, we check the voice channels for users.
	setInterval(() => {

		log_voice_channels();

	}, 5000); // Milliseconds

});



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




//-------=| Section For Important Code Snippets |=-----------//

/*
	This is how you grab a channel by ID.
	Leave this for now, might need it for reference.

	const chan_stratton = client.channels.cache.get("841115556500602900");

	For voice state updates. Useful for detecting entry to voice servers.
	Save this for now, we might need this for reference.
	Ref:
		https://stackoverflow.com/questions/65961002/discord-js-check-if-user-is-in-an-specific-voice-channel


	client.on('voiceStateUpdate', (oldState, newState) => {
		try {

		//console.log(`User ID: ${newState.member['user']['id']}`);
		//console.log(`Voice Channel ID: ${newState.channel['id']}`); // Confirmed!

		} catch (error) {
			console.log("A user has left a channel.");

		}
	}
	console.log(client.users.cache);  <---- Important: List of all users in the server (online). Tested in voiceStateUpdate event.


	// Why is nobody doing it this, way? It's better!
	// This is proper stderr logging.
	console.error(err); 
*/