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

    if (!company.key) return controller.error(res, new Error('Missing company key'));
    if (!company.details.contact.email) return controller.error(res, new Error('Missing company contact email address'));

    bus.publishRegister(company);

    return controller.success(res, company);
};

