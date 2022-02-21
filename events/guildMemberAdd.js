module.exports = {
	name: 'guildMemberAdd',
	once: false,
	async execute(member) {
		console.log("Someone Joined");
		member.guild.channels.cache.get('841431725603028993').send(`${member} Welcome to Costco. I love you.`); 
	},
};
