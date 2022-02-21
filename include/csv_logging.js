const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const json2csv = require('json2csv').parse;

const { chalk } = require('chalk');				// For colored output

const fs = require('fs');                   // File system module


function getDateTime() {

	let currentDate = new Date();
	let todaysDate = currentDate.getDate() + "_"
    			   + (currentDate.getMonth()+1)  + "_"
                   + currentDate.getFullYear();

	let todaysTime =  currentDate.getHours() + ":"
					+ currentDate.getMinutes() + ":"
					+ currentDate.getSeconds();

	return [todaysDate, todaysTime];

}

function fileWriteLog(receivedUserArray) {

	let dateInfo = getDateTime();
	let todayDate = dateInfo[0],
		todayTime = dateInfo[1];

	let todayFile = 'timelog/'+ todayDate + '.csv';

	if (receivedUserArray.length === 0) { 
		console.log("Voice channels empty. Nothing logged.");
		return 0;
	}

	fs.access(todayFile, (err) => {

		if(err) {

			console.log(`CSV for today's file: ${todayDate}.json doesn't exist. Creating...`);

			const csvWriter = createCsvWriter({
				path: todayFile,
				header: [
					{id: 'time', title: 'Time'},
					{id: 'username', title: 'Username'},
					{id: 'userid', title: 'UserID'},
					{id: 'vchannel', title: 'Voice Channel'},
				]
			});

			csvWriter.writeRecords(receivedUserArray)       // returns a promise
				.then(() => {
					console.log('...Done');
				});

		} else {

			console.log(`CSV for today's file: ${todayDate}.csv exists. Updating..`);


			rua = json2csv(receivedUserArray, {header:false, quote:''});

			fs.appendFile(todayFile, rua + '\r\n', { flag: "a+" }, (err) => {
                //console.log(err);
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

	// You also need to create the empty CSV array (contains individ channel objects) here along with the logString
	userArray = [];
	// Fill the array with objects in this format

	// Grab the time.
	let dateInfo = getDateTime();
	let todayTime = dateInfo[1];

	// For each voice channel
	for (const [key, value] of voiceChannelCount) {

		// This is how you get a channel by name.
		const vchannelHolder = clientChannelsObj.cache.find(channel => channel.name === value["name"]);

		console.log(`-------=| Users currently in ${value["name"]} `);

		// This is the channel name.
		channelName = value['name'];

 		// Below this line, you must only do these if the collection isn't empty (try-catch)
		try {

			const guildMemberHolder = vchannelHolder.members;

			// guildMemberHolder is a dictionary, so we can iterate through it.
			const iter1 = guildMemberHolder[Symbol.iterator]();

			// Loops through users found in a channel
			for (const item of iter1) {

				const userName = item[1].user.username;
				const userID = item[1].user.id;

				console.log('Username: ' + chalk.greenBright(userName) + '  ID: ' + chalk.blueBright(userID));
				logString += '     ' + 'Username: '+ userName + '  ID: ' + userID + '\n\n';

				// user object is created. Has Time, Username, UserID, and Channel Name
				let userInstance = {time: todayTime, username: userName,	userid: userID, vchannel: channelName	};

				// user object is then inserted to user_container_array
				userArray.push(userInstance);

			}

		} catch (error) {

			// Errors can be ignored, as empty channels are expected to have no 'user' member/property.
			console.log(error);
		}
	}
	fileWriteLog(userArray);
}


module.exports = { getDateTime, fileWriteLog, logVoiceChannels };
