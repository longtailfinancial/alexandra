const userLog = require('../include/csv_logging.js')

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		setInterval(() => {

			userLog.logVoiceChannels(client.channels);
			console.log(client.channels)

		}, 60000); // 600 seconds
	}
}
