const { exec, execSync } = require("child_process");
const fs = require('fs')
const path = require('path');
const util = require('util');



const execa = util.promisify(require('child_process').exec);


async function grepper(userid, item) {

	const { stdout, stderr } = await execa(`grep -c ${userid} ${item}`);
		
	if (stderr) {
		console.log(`stderr: ${stderr}`);
		return;
	}

	
	return stdout;
}


async function rg_callback(error, stdout, stderr, message) {

	// Consider this just boilerplate for the error and stderr.
	if (error) {
		console.log(`error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`);
		return;
	}

	// The collected log files are one string that must be split by newline.
	let individ_logs = stdout.split(/\r?\n/);


	// The split for some reason leaves an empty string as the last element.
	individ_logs.pop();
	// This string will collect the lines produced by the for-loop below.
	let line_aggregate = [];

	// This for-loop in English "For each file that had that specific user's ID."

	console.log(individ_logs);
	// We have a working loop that waits to finish now. Repurpose concat so that it runs the greps.
	for (let item of individ_logs) {

		/* 
			We have to grep each line containing that user's id.
			then count them with wc -l
		*/
	
		let counts = await grepper(message.member['user']['id'], item);
		let hours = 0;
		/*
			If string contains "old_csvs", multiply counts by 1.5 
			This is because in the old csvs, each timestep was 1 and a half min.
			The non-old csvs have 1 minute timesteps.
		*/

		 
		if(item.includes('old_csvs')) {
			// toFixed to round down decimals
			hours = ((counts * 1.5)/ 60).toFixed(3);
		} else {
			hours = ((counts / 60)).toFixed(3);
		}

		let file_name = path.parse(item).base.replace('.csv', '').replace(/_/g, '-');
		line_aggregate.push(`Date: ${file_name}, Entries: ${counts} Hours: ${hours}`);

	}


	console.log("Loop finished");
	message.reply(line_aggregate.sort());


	return stdout;
}






module.exports = {
	name: 'myvch',
	description: 'Bot replies with total hours of the day, then week.',
	execute(message, args) {

		try {

			// First bot replies to the user, saying what their ID is.
			// This is to show the bot acknowledges the command and is actively responding.
			let reply_back = 'Your ID is: ' + message.member['user']['id'] + ", scanning logs...";
			
			message.reply(reply_back);
			

			// Tailoring a lengthy, but very precise and powerful bash command.
			const shell_command = `rg -i ${message.member['user']['id']} -l ../timelog/ | grep ".*\.csv$"`;

			/* 
				Explanation: First use ripgrep (rg) to recursively search '../timelog/'
				for files containing the user's name (Must change this do userid),
				then lists the files that end in csv using grep.
			*/

			exec(shell_command, (error, stdout, stderr) => {
				// Made a wrapper for this anonymous function so we can pass this scope's message variable.
				rg_callback(error, stdout, stderr, message);
			});

		} catch (error) {
			console.log(error);

		}

	},
};
