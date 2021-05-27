const fs = require('fs');                   // File system module
const chalk = require('chalk');				// For colored output

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
		So for each found voice channel, we create an object.  The key is channel name, 
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

			console.log(`JSON for today's file: ${today_date}.json doesn't exist. Creating...`);

			const day_object = {
			
				"date": `${today_date}`,
				"log": [
					timestep_object
				]
			};

			const initial_day_object = JSON.stringify(day_object, null, 4);
		
			// This function is what actually creates the JSON.
			fs.appendFile(today_file, initial_day_object, (err) => {

				if(err)	console.error(err);
			});

		} else {

			console.log(`JSON for today's file: ${today_date}.json exists. Updating..`);

			// Reading the existing file, putting in new timestep, and overwriting.
			fs.readFile(today_file, 'utf-8', (err, jsonString) => {

				if (err) {
					console.log(err);
				} else {

					/*
					Because we're getting a string since we asked for it in utf-8,
					(otherwise it would just be an unreadable buffer)
					we can't access the properties right away. 
					*/

					// We have to parse jsonString into a JSON object.					
					try {
			
						// It's best to wrap JSON.parse calls into a try-catch
						// If it throws an error and isn't caught, it will crash your program
						const current_day_object = JSON.parse(jsonString);

						// This pushes the new timestep_objects perfectly!
						current_day_object.log.push(timestep_object);

						// Now stringify it again and overwrite today_file.

						const updated_day_object = JSON.stringify(current_day_object, null, 4);

						fs.writeFile(today_file, updated_day_object,  (err) => { 

							if(err) console.error(err);
						
						});

					} catch (err) {
						console.error('Error parsing JSON', err);
					}
				}
			});
		}
	});
}


function log_voice_channels(client_channels_obj) {

	// We do this by first identifying which servers are voice-type
	// Then listing the current users in each of them.

	// Filters all the channels available for voice type channnels
	const voiceChannelCount = client_channels_obj.cache.filter(c => c.type ==='voice');

	//	Empty string, we gradually fill this with data.
	let log_string = ""; 

	// You also need to create the empty JSON array (contains individ channel objects) here along with the log_string
	channel_object_array = [];

	// For each voice channel
	for (let [key, value] of voiceChannelCount) {

		// This is how you get a channel by name.
		const vchannel_holder = client_channels_obj.cache.find(channel => channel.name === value["name"]);

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


module.exports = { get_date_time, file_write_log, log_voice_channels };
