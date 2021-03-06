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
    app = express();

var controllers = require('./controllers');

///////////////////
// CONFIGURATION //
///////////////////

require('./config/express.js')(app, express);

////////////
// ROUTES //
////////////

app.post('/companies', controllers.companies.register);
app.post('/companies/check', controllers.companies.checkKey);


//////////////////
// START SERVER //
//////////////////

var server = http.createServer(app);
server.listen(process.env.PORT || 80, function(){
    console.log('Server listening on port ' + server.address().port);
});
