const { channelGreetId, channelGreetText } = require('../config.json');

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	async execute(member) {
		console.log("Someone Joined");
		member.guild.channels.cache.get(channelGreetId).send(`${member} ${channelGreetText}`); 
	},
};
