const {PythonShell} = require('python-shell');


module.exports = async function (msg) {

    console.log(msg.content);

    // Command 
    if(msg.content === 'Anton?') {
        // Use this method for bot to explicitly reply to user.
        //msg.reply(`choo choo`);   
        msg.channel.send(`What I'd do is like, you know... You know what I mean? Hehehe`);

    // Command
    } else if (msg.content === 'readfile') {

        // const process = spawn('python', ['./pycode/readfile.py']);

        var pyshell = new PythonShell('./pycode/readfile.py');


        pyshell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
            console.log(message);
            msg.channel.send(message);
        });
        
        // end the input stream and allow the process to exit
        pyshell.end(function (err) {
            if (err){
                throw err;
            };
        
        });

    }




}