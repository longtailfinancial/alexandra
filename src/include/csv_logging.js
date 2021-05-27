const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const json2csv = require('json2csv').parse;
const chalk = require('chalk');				// For colored output
const fs = require('fs');                   // File system module


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

function file_write_log(received_user_array) {

	let date_info = get_date_time();
	let today_date = date_info[0],
		today_time = date_info[1];

	let today_file = '../timelog/'+ today_date + '.csv';

	if (received_user_array.length === 0) { 
		console.log("Voice channels empty. Nothing logged.");
		return 0;
	}

	fs.access(today_file, (err) => {

		if(err) {

			console.log(`CSV for today's file: ${today_date}.json doesn't exist. Creating...`);

			const csvWriter = createCsvWriter({
				path: today_file,
				header: [
					{id: 'time', title: 'Time'},
					{id: 'username', title: 'Username'},
					{id: 'userid', title: 'UserID'},
					{id: 'vchannel', title: 'Voice Channel'},
				]
			});

			csvWriter.writeRecords(received_user_array)       // returns a promise
				.then(() => {
					console.log('...Done');
				});

		} else {

			console.log(`CSV for today's file: ${today_date}.csv exists. Updating..`);


			rua = json2csv(received_user_array, {header:false, quote:''});

			fs.appendFile(today_file, rua + '\r\n', { flag: "a+" }, (err) => {
                //console.log(err);
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

	// You also need to create the empty CSV array (contains individ channel objects) here along with the log_string
	user_array = [];
	// Fill the array with objects in this format

	// Grab the time.
	let date_info = get_date_time();
	let today_time = date_info[1];

	// For each voice channel
	for (let [key, value] of voiceChannelCount) {

		// This is how you get a channel by name.
		const vchannel_holder = client_channels_obj.cache.find(channel => channel.name === value["name"]);

		console.log(`-------=| Users currently in ${value["name"]} `);

		// This is the channel name.
		channel_name = value['name'];

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

				// user object is created. Has Time, Username, UserID, and Channel Name
				let user_instance = {time: today_time, username: user_name,	userid: user_id, vchannel: channel_name	};

				// user object is then inserted to user_container_array
				user_array.push(user_instance);

			}

		} catch (error) {

			// Errors can be ignored, as empty channels are expected to have no 'user' member/property.
			console.log(error);
		}
	}
	file_write_log(user_array);
}


module.exports = { get_date_time, file_write_log, log_voice_channels };
