'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    role: String
});

//Delete the password on the JSON responses
UserSchema.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.password;

    return obj;
}

//Exports the module
module.exports = mongoose.model('User', UserSchema);
                            //lowercase & pluralize name
                            //users -> documents(schema)