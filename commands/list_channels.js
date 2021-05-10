module.exports = {
	name: 'lvc',
	description: 'List all voice channels',
	execute(message, args) {

        const voiceChannelCount = message.guild.channels.cache.filter(c => c.type ==='voice');
        
        for (let [key, value] of voiceChannelCount) {

            console.log(value["name"]);
            message.channel.send(value["name"]);

         }
            
	},
};
