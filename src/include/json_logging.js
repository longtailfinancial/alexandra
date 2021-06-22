const fs = require('fs');                   // File system module
const chalk = require('chalk');				// For colored output

function getDateTime () {
	
	let currentdate = new Date(); 
	let todaysDate = currentdate.getDate() + "_"
    			   + (currentdate.getMonth()+1)  + "_" 
                   + currentdate.getFullYear();
			

	let todaysTime =  currentdate.getHours() + ":"  
					+ currentdate.getMinutes() + ":" 
					+ currentdate.getSeconds();
	
	return [todaysDate, todaysTime];

}


function fileWriteLog(receivedChannelObjectArray) {

	/*
		Each timelog is an object - Key is a string timestep, value is a 
		JSONArray[nameless array] of voice channel objects.
		A voice_channelObject is an object where the key is the voice channel name and the 
		value is a user object (containing user-id pairs). !This is made just outside the try-catch block 
		in logVoiceChannels!
		So for each found voice channel, we create an object.  The key is channel name, 
		value is initallly an empty_array !This is made inside the try block!
			Then put name and userid together in an object ( key-pair ), then insert that into the empty array 
			(which is the value to channel object)
	*/

	let dateInfo = getDateTime();
	let todayDate = dateInfo[0],
		todayTime = dateInfo[1];

	let todayFile = 'timelog/'+ todayDate + '.json';

	let timestepObject = {};

	timestepObject[`${todayTime}`] = receivedChannelObjectArray;

	fs.access(todayFile, (err) => {

		if(err) {

			console.log(`JSON for today's file: ${todayDate}.json doesn't exist. Creating...`);

			const dayObject = {
			
				"date": `${todayDate}`,
				"log": [
					timestepObject
				]
			};

			const initialDayObject = JSON.stringify(dayObject, null, 4);
		
			// This function is what actually creates the JSON.
			fs.appendFile(todayFile, initialDayObject, (err) => {

				if(err)	console.error(err);
			});

		} else {

			console.log(`JSON for today's file: ${todayDate}.json exists. Updating..`);

			// Reading the existing file, putting in new timestep, and overwriting.
			fs.readFile(todayFile, 'utf-8', (err, jsonString) => {

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
						const currentDayObject = JSON.parse(jsonString);

						// This pushes the new timestepObjects perfectly!
						currentDayObject.log.push(timestepObject);

						// Now stringify it again and overwrite todayFile.

						const updatedDayObject = JSON.stringify(currentDayObject, null, 4);

						fs.writeFile(todayFile, updatedDayObject,  (err) => { 

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


function logVoiceChannels(clientChannelsObj) {

	// We do this by first identifying which servers are voice-type
	// Then listing the current users in each of them.

	// Filters all the channels available for voice type channnels
	const voiceChannelCount = clientChannelsObj.cache.filter(c => c.type ==='voice');

	//	Empty string, we gradually fill this with data.
	let logString = ""; 

	// You also need to create the empty JSON array (contains individ channel objects) here along with the logString
	channelObjectArray = [];

	// For each voice channel
	for (let [key, value] of voiceChannelCount) {

		// This is how you get a channel by name.
		const vchannelHolder = clientChannelsObj.cache.find(channel => channel.name === value["name"]);

		console.log(`-------=| Users currently in ${value["name"]} `);

		logString += value['name'] + '\n\n';  

		/*
			Create the channelObject here
			(vchannelname as key: str / empty JSON array as key)
			The key is filled one by one in try block below
		*/
		let channelObject = {};
		let userContainerArray = [];


 		// Below this line, you must only do these if the collection isn't empty (try-catch)
		try {

			const guildMemberHolder = vchannelHolder.members;

			// guildMemberHolder is a dictionary, so we can iterate through it.
			const iter1 = guildMemberHolder[Symbol.iterator]();

			// Loops through users found in a channel
			for (const item of iter1) {

				const userName = item[1].user.username;
				const userId = item[1].user.id;

				console.log('Username: ' + chalk.greenBright(userName) + '  ID: ' + chalk.blueBright(userId));
				logString += '     ' + 'Username: '+ userName + '  ID: ' + userId + '\n\n';  

				// user object is created, with name as key and id as value.
				let userObject = {};
				userObject[userName] = userId;

				// user object is then inserted to userContainerArray
				userContainerArray.push(userObject);

			}
	
		} catch (error) {

			// Errors can be ignored, as empty channels are expected to have no 'user' member/property.
			console.log(error);
		}


	// The voice channel object is created, and the key is the channel name
	// and the value is the nameless array containing the individual user objects.
	channelObject[`${value['name']}`] = userContainerArray;
	channelObjectArray.push(channelObject);

	}

	fileWriteLog(channelObjectArray);
}


module.exports = { getDateTime, fileWriteLog, logVoiceChannels };
