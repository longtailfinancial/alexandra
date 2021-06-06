var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var url_sample = 'https://09199ff19afe.ngrok.io/app'
function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if (http.status != 404) {
        console.log("It's up!");
    } 
    else console.log("Shit it's down.");
}

UrlExists(url_sample);

/*
    For a more updated solution, see checked answer.
    https://stackoverflow.com/questions/32604460/xmlhttprequest-module-not-defined-found

*/