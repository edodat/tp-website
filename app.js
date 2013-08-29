/**
 * Main application script
 * 
 *  - Initialization of sub-modules :
 *  - Express as web server
 * 
 * @author Etienne Dodat
 * @since 11/07/2013
 */

////////////////////
// INITIALIZATION //
////////////////////

var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app);

// WEB SERVER CONFIGURATION
require('./config/express.js')(app, express);

server.listen(process.env.PORT || 80, function(){
    console.log("Server listening on port " + (process.env.PORT || 80));
});
