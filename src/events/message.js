module.exports = {
	name: 'message',
	on: true,
	execute(client, message) {

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

	}


};
