module.exports = {
	name: 'lvc',
	description: 'List all voice channels',
	execute(message, args) {

        const voiceChannelCount = message.guild.channels.cache.filter(c => c.type ==='voice');
        
        for (let [key, value] of voiceChannelCount) {

            console.log(value["name"]);
            /*  
                Find the channel ID! Then its object using
                https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/frequently-asked-questions.md
                // 841115556500602900 - Stratton Oakmont
                // 841065281039761418 - voice_channel_ex1
                // 682388820976730183 - General

            */

            console.log(value);                      
            message.channel.send(value["name"]);

         }
            
	},
};
