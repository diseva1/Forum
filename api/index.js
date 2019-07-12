'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3030;

//Database connection
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/forum', {useNewUrlParser: true}) //! URL TEMPORAL
    .then(() => {
        console.log('Conexión a la base de datos satisfactoria');

        //Create server
        app.listen(port, ()=> {
            console.log('Servidor iniciado en localhost:3030');
        });
    })
    .catch(error => console.log(error));