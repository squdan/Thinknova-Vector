
// Running this file will create a new private key. It requires a running erisdb server on http://localhost:1337.

var edbModule = require("../index");

var serverURL = "http://localhost:1337";

(function(){
    var edb = edbModule.createInstance(serverURL + '/rpc');
    edb.accounts().genPrivAccount(null, function(error, data){
        if (error) {
            throw new Error(error);
        } else {
            console.log("Private account data: ");
            console.log(data);
        }
    });
})();