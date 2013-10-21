/**
 * Companies controller
 *
 * User: Etienne
 * Date: 16/09/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var controller = require('./controller.js'),
    bus = require('./bus.js');

/////////////
// PRIVATE //
/////////////

////////////
// PUBLIC //
////////////

/**
 * Creates new company account
 */
module.exports.register = function (req, res) {
    var company = req.body;

    if (!company.key) return controller.error(res, new Error('Missing instance name'));
    if (!company.details || !company.details.contact || !company.details.contact.email) return controller.error(res, new Error('Missing email address'));

    bus.onWithTimeout('admin.registration.'+company.key,
        function success(message){
            if (message.ok){
                return controller.success(res, message);
            } else {
                return controller.error(res, new Error(message.error));
            }
        },
        function timeout(){
            return controller.error(res, new Error('Timeout on registration'));
        },
        30000
    );

    bus.publishRegister(company);
};

module.exports.checkKey = function (req, res) {
    var key = req.body.key;

    bus.onWithTimeout('admin.key.'+key,
        function success(message){
            return controller.success(res, message);
        },
        function timeout(){
            return controller.error(res, new Error('Timeout on checking key'));
        },
        5000
    );

    bus.publishCheck(key);
}