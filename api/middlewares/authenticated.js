'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'secret-key-67676';

exports.authenticated = function(req, res, next){
    
    //Check if autorization arrives
    if(!req.headers.authorization){
        return res.status(403).send({
            message: 'La petición no tiene la cabezera de autorización'
        });
    }

    //Clean token & clean quotation marls
    var token = req.headers.authorization.replace(/['"]+/g,'');

    
    try{
        //Decode token
        var payload = jwt.decode(token, secretKey);

        //Check if token has expired
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                message: 'El token ha expirado'
            });
        }

    }catch(ex){
        return res.status(404).send({
            message: 'El token no es válido'
        });
    }

    //Add identified user to request
    req.user = payload;
    
    
    next();
};