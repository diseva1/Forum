'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

exports.createToken = function(user){

    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image:user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, 'secret-key-67676'); //TODO: Change the secret key
};