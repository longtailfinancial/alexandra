module.exports = {
	name: 'ltc',
	description: 'List all text channels',
	execute(message, args) {

        const textChannelCount = message.guild.channels.cache.filter(c => c.type ==='text');
        
        for (let [key, value] of textChannelCount) {

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
