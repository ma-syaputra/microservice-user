
const user = require('../api/controllers/user')
const auth = require('../api/controllers/auth')
module.exports = function(app) {
    app.route('/registration').post(user.registration)
    app.route('/auth').post(auth.auth)
    app.route('/validate').get(auth.userValidate)
    // app.route('/user/login').post(user)
    // app.route('/user/validate').post(user)
    // app.route('/user/logout').post(user)
}