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
    ws = require('./ws.js');

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
    ws.admin.register(company, controller.wrapup(res));
};

module.exports.checkKey = function (req, res) {
    var key = req.body.key;
    ws.admin.checkKeyAvailability(key, controller.wrapup(res));
}