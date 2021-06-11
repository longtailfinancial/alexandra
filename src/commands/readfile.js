module.exports = {
	name: 'readfile',
	description: 'alexandra_ reads from a text file',
	execute(message, args) {

        const {PythonShell} = require('python-shell');
        let pyshell = new PythonShell('./pycode/readfile.py');


        pyshell.on('message', function (msg_content) {
            // received a message sent from the Python script (a simple "print" statement)
            console.log(msg_content);
            message.channel.send(msg_content);
        });
        
        // end the input stream and allow the process to exit
        pyshell.end(function (err) {
            if (err){
                throw err;
            };
        
        });

    },
};
