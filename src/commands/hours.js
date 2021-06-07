const { exec } = require("child_process");
const path = require('path');
const util = require('util');

/*
	To-do: June 2, 2021

	- Refine regex on function grepper.
		Current issue: Partial names return results. It should be co,plete names.

	
	- Proper sort of dates.
		Oh you know what this issue looks like.

		Also see if you can reply with an initial new line 
		so her reply doesn't look like:

		@someperson, first_result
		second_result
		third_result

		but rather: 

		@someperson, 
		first_result
		second_result
		third_result


*/



const execa = util.promisify(require('child_process').exec);


async function grepper(userid, item, channelName) {

	try {

		/*
			We will grep the file (item) for the user's id.
			Once we have the lines, we further filter it for the channelName that we're looking for.
			Finally, we count the lines with "wc -l"

			Notice the dollar sign at the end of the grep pattern in the first pipe? 
			That makes sure the pattern should be at the end of the line.
			That way if a user searches their time on channel "Foo", we won't 
			get false positives from channel names such as "Foo Bar" or "Fookit"
			We'll only count results from the channel strictly named "Foo"

			Note: This is causing lines to be miscounted. Discard the additional
			regex shit.

		*/
		const { stdout, stderr } = await execa(`grep ${userid} ${item} | grep ',${channelName}' | wc -l`);
		return stdout;

	} catch(stderr) {

		console.log(`stderr: ${stderr}`);
		return 0;
	
	}

}

// Ripgrep callback
async function rgCallback(error, stdout, stderr, message, channelName) {

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
	let individLogs = stdout.split(/\r?\n/);

	// The split leaves an empty string as the last element.
	individLogs.pop();

	
	// This string will collect the lines produced by the for-loop below.
	let lineAggregate = [];

	// This for-loop in English "For each file that had that specific user's ID."

	console.log(individLogs);
	// We have a working loop that waits to finish now. Repurpose concat so that it runs the greps.
	for (let item of individLogs) {

		/* 
			We have to grep each line containing that user's id AND channelName.
			then count them with wc -l
		*/
	
		let counts = await grepper(message.member['user']['id'], item, channelName);
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


		/* 
		If no instance of userid AND channel name were found in that file,
		there's no need to mention it.
		*/
		if(hours == 0) {

			console.log("Nothing found in this file!");

		} else {

			/* 
				If the user had hours on that certain file, based on the channel name they searched,
				only then should it be mentioned
			*/
			let file_name = path.parse(item).base.replace('.csv', '').replace(/_/g, '-');
			lineAggregate.push(`Date: ${file_name}, Entries: ${counts} Hours: ${hours}\n`);

		}

	}

	console.log("Loop finished");

	if(lineAggregate.length != 0) {
		message.reply(`\n${lineAggregate.sort()}`);
	} else {
		message.reply("No results.");
	}

	return stdout;
}



module.exports = {
	name: 'myvch',
	description: 'Bot replies with total hours of the day, then week.',
	execute(message, args) {

		console.log(args);
	
		if(!args.length) {
			message.reply("Sorry, you forgot to add a channel name.");
			message.reply("Format: !myvch [channel name].");
			return 0;
		} else if (args.length > 1) {
			
			args[0] = args.join(' ');

		}
		

		try {

			// First bot replies to the user, saying what their ID is.
			// This is to show the bot acknowledges the command and is actively responding.
			let replyBack = 'Your ID is: ' + message.member['user']['id'] + ", scanning logs...";
			
			message.reply(replyBack);
			
			// Tailoring a lengthy, but very precise and powerful bash command.
			const shellCommand = `rg -i ${message.member['user']['id']} -l ../timelog/ | grep ".*\.csv$"`;

			/* 
				Explanation: First use ripgrep (rg) to recursively search '../timelog/'
				for files containing the user's name (Must change this do userid),
				then lists the files that end in csv using grep.
			*/

			exec(shellCommand, (error, stdout, stderr) => {
				// Made a wrapper for this anonymous function so we can pass this scope's message variable.
				rgCallback(error, stdout, stderr, message, args[0]);
			});

		} catch (error) {
			console.log(error);

		}

	},
};
