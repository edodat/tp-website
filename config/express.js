module.exports = function(app, express){
	
    app.configure(function() {
        //app.use(express.logger()); // activate access logs
    	app.use(express.bodyParser());
    	app.use(express.cookieParser());
    	app.use(express.session({secret:'tpsession'}));
    	app.use(app.router);
    	app.use(express.static(__dirname+'/../public/app'));
    });

    app.configure('development', function() {
	    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
    });

    app.configure('production', function() {
    	app.use(express.errorHandler());
    });
};