module.exports = {
	name: 'ready',
	once: true,
	execute(client) {

		const userLog = require('../include/csv_logging.js');
		console.log(`Alexandra_ initialized as ${client.user.tag}`);

		setInterval(() => {

			userLog.logVoiceChannels(client.channels);

		}, 60000); // 60 seconds

	},
};
