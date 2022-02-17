module.exports = {
	name: 'guildMemberAdd',
	once: false,
	execute(client, member) {

		console.log("Someone joined")
		member.guild.channels.cache.get('682388820972536045').send(`${member} Out, out! Brief candle!`); 
	
	}
}
