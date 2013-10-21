/**
 * Service bus controller
 *
 * User: Etienne
 * Date: 01/10/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var amqp = require('amqp'),
    config = require('../config/amqp.js');

/////////////
// PRIVATE //
/////////////

var connection;
var adminExchange;
var queue;
var listeners = {};

/**
 * Initializes bus connection, exchanges and queue.
 * @param callback
 */
function initialize (callback){
    // Connect to bus
    connection = amqp.createConnection({ url: config.connectionURL });
    connection.on('ready', function() {
        console.log('[BUS] Connected to ' + connection.serverProperties.product);

        // declare "administration" AMQP exchange
        adminExchange = connection.exchange('administration', {
            type: 'topic',
            durable: 'true'
        });

        // declare website queue
        queue = connection.queue('website', function(q){
            // Receive messages
            q.subscribe(function (message, headers, deliveryInfo) {
                console.log('[BUS] Received', deliveryInfo.routingKey, 'message:', message);
                var cb = listeners[deliveryInfo.routingKey];
                if (cb){
                    cb(message);
                } else {
                    console.log('[BUS] Routing key', deliveryInfo.routingKey, 'not handled. Message discarded.');
                }
            });

            callback(null);
        });
    });
}

/**
 * Publishes a message to the bus.
 * @param routingKey
 * @param message
 */
function publish (routingKey, message){
    console.log('[BUS] Publishing', routingKey, 'message:', message);
    adminExchange.publish(routingKey, message);
}

////////////
// PUBLIC //
////////////

/**
 * Initializes bus connection, exchanges and queue.
 * @param callback
 */
module.exports.initialize = initialize;

/**
 * Closes connection.
 */
module.exports.close = function(){
    connection.end();
};

/**
 * Binds a listener to incoming bus messages.
 * @param routingKey
 * @param callback
 */
module.exports.on = function (routingKey, callback){
    queue.bind(adminExchange, routingKey);
    listeners[routingKey] = callback;
    console.log('[BUS] Listening to', routingKey, 'messages');
}

/**
 * Binds a listener to incoming bus messages for a limited period of time.
 * @param routingKey
 * @param callback
 * @param timeoutCallback
 * @param delay
 */
module.exports.onWithTimeout = function (routingKey, callback, timeoutCallback, delay){
    var timeoutResponse = setTimeout(function(){
        queue.unbind(adminExchange, routingKey);
        delete listeners[routingKey];
        console.log('[BUS] Stopped listening to', routingKey, 'messages');
        return timeoutCallback();
    }, delay);

    module.exports.on(routingKey, function(message){
        clearTimeout(timeoutResponse);
        return callback(message);
    });
}


/**
 * Publishes a message when a company tries to register
 */
module.exports.publishRegister = function(company){
    publish('website.register', company);
};

/**
 * Publishes a message to check company's key availability
 */
module.exports.publishCheck = function(key){
    publish('website.check', { key: key });
};

