// Remember, this is a blocking read JSON (synchronous)
// It's also going to cache the file.
// const customer = require('./customer.json');

// src: https://www.youtube.com/watch?v=HrjC6RwEpt0

const fs = require('fs');



function jsonReader(filePath, cb) {


    fs.readFile(filePath, 'utf-8', (err, jsonString) => {

        if (err) {
            console.log(err);
        } else {
            /*
            
            Because we're getting a string since we asked for it in utf-8,
            (otherwise it would just be an unreadable buffer)
            we can't access the properties right away. 
            */
            console.log(jsonString);
            //              ^
            //              |
            //  We have to  |  parse this string
            //  into a javascript object.
    
    
            try {
    
                // It's best to wrap JSON.parse calls into a try-catch
                // If it throws an error and isn't caught, it will crash your program
                const data = JSON.parse(jsonString);
                //console.log(data.address);
    
            } catch (err) {
                console.log('Error parsing JSON', err);
                
            }
        }
    });


}



jsonReader('./sample_day.json', (err, data) => {
    if (err) {
        console.log(err)
    } else {
        console.log(data);
    }

});


//------- Writing to a File ---------//


const newObject = {

    name: 'Newbie Corp',
    order_count: 0,
    address: 'Po Box City',

};

const jsonString = JSON.stringify(newObject, null, 2);
//console.log(jsonString);

// How to add an entry to a JSON file.
// https://stackoverflow.com/questions/736590/add-new-attribute-element-to-json-object-using-javascript

// What to do, make a Big ass JSON file as big as estimated daily file size
// Try to add to it, see if it takes a while.