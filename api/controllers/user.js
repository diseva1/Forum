'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt');
const saltRounds = 12;
const os = require('os');
var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var jwt = require('../services/jwt');

var controller = {
    
    save: function(req, res){
        //Collect petition params
        var params = req.body;

        //Validate data
        try{
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = validator.isEmail(params.email) && !validator.isEmpty(params.email);
        }catch(err){
            return res.status(200).send({
                message: "Faltan datos por enviar",
                params
            });
        }

        if(validate_name && validate_surname && validate_email ){
            //Create user object
            var user = new User();

            //Asign values to user
            user.name = params.name;
            user.surname = params.surname;
            user.email  = params.email.toLowerCase();
            user.role = 'ROLE_USER';
            user.image = null;

            //Check if user exists
            User.findOne({email: user.email}, (err, issetUser) => {
                if(err){
                    return res.status(500).send({
                        message: 'Error al comprobar duplicidad del usuario',
                    });
                }
                if(!issetUser){
                    //If not, crypt pass 
                    bcrypt.hash(params.password, saltRounds, (err, hash) =>{
                        user.password = hash;

                        //Save user
                        user.save((err, userStored) => {
                            if(err){
                                return res.status(500).send({
                                    message: 'Error al guardar el usuario',
                                });
                            }

                            if(!userStored){
                                return res.status(400).send({
                                    message: 'El usuario no se ha guardado',
                                });
                            }

                            //Return answer
                            return res.status(200).send({user: userStored});

                        }); //close save
                    }); //close bcrypt

                }else{
                    return res.status(200).send({
                        message: 'Usuario ya registrado',
                    });
                }
            });

            
        }else{
            return res.status(200).send({
                message: 'Validación incorrecta',
            });
        }
    },

    login: function(req, res){
        //Collect petition params
        var params = req.body;

        //Validate data
        try{
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email); 
            var validate_password = !validator.isEmpty(params.password);
        }catch(err){
            return res.status(200).send({
                message: "Faltan datos por enviar",
                params
            });
        }
        
        if(!validate_email || !validate_password){
            return res.status(200).send({
                message: "Los datos son incorrectos"
            });
        }
        //Find matching emails
        User.findOne({email: params.email.toLowerCase()}, (err, user) => {
            if(err){
                return res.status(500).send({
                    message: "Error al identificarse",
                    user
                });
            };

            if(!user){
                return res.status(400).send({
                    message: "El usuario no existe",
                    user
                });
            };

            //If finds, check password
            bcrypt.compare(params.password, user.password, (err, check) =>{

                //If correct,
                if(check){
                    //Generate JWT token & return it
                    if(params.getToken){
                        //Return data
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }else{
                        //Clean object
                        user.password = undefined;

                        //Return data
                        return res.status(200).send({
                            message: "Success",
                            user
                        });
                    }
                    
                }else{
                    return res.status(200).send({
                        message: "La contraseña no es valida"
                    });
                }
                
            });
        });
        
    },
    update: function(req, res){
        //Collect user data
        var params = req.body;

        //Validate data
        try{
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = validator.isEmail(params.email) && !validator.isEmpty(params.email);
        }catch(err){
            return res.status(200).send({
                message: "Faltan datos por enviar",
                params
            });
        }
        
        //Delete unnecessary properties
        delete params.password;

        var userId = req.user.sub;

        //Check if email is unique
        if(req.user.email != params.email){
            User.findOne({email: params.email.toLowerCase()}, (err, user) => {
                if(err){
                    return res.status(500).send({
                        message: "Error al identificarse",
                        user
                    });
                }
    
                if(user && user.email == params.email){
                    return res.status(200).send({
                        message: "El email no puede ser modificado",
                        user
                    });
                }else{
                    //Find & Update
                    User.findOneAndUpdate({_id: userId}, params, {new:true}, (err, userUpdated) => {
                    
                        if(err){
                            return res.status(500).send({
                                status: 'Error',
                                message: 'Error al actualizar el usuario'
                            }); 
                        }
                        if(!userUpdated){
                            return res.status(200).send({
                                status: 'Error',
                                message: 'No se ha actualizado el usuario'
                            });
                        }
                        //Return answer
                        return res.status(200).send({
                            status: "Success",
                            user: userUpdated
                        });
                    });
                }
            });
        }else{
            //Find & Update
            User.findOneAndUpdate({_id: userId}, params, {new:true}, (err, userUpdated) => {

                if(err){
                    return res.status(500).send({
                        status: 'Error',
                        message: 'Error al actualizar el usuario'
                    }); 
                }
                if(!userUpdated){
                    return res.status(200).send({
                        status: 'Error',
                        message: 'No se ha actualizado el usuario'
                    });
                }
                //Return answer
                return res.status(200).send({
                    status: "Success",
                    user: userUpdated
                });
            });
        }
    },
    uploadAvatar: function(req, res){
        //Configure multi-party module -->routes/user.js

        //Collect the file
        var file_name = 'Avatar no subido....';

        if(!req.files){
            //Return answer
            return res.status(404).send({
                status: 'Error',
                message: file_name
            });
        }

        //Get the name and extension
        var file_path = req.files.file0.path;

        if(os.type() === 'Windows_NT'){
            var file_split = file_path.split('\\');
        }else if(os.type() === 'Darwin' || os.type() === 'Linux'){
            var file_split = file_path.split('/');
        }

        //File name
        var file_name = file_split[2];

        //File extension
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        //Check extension(only images), if not --> delete the file
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            fs.unlink(file_path, (err) => {
                
                return res.status(200).send({
                    status: 'Error',
                    message: 'La extensión del archivo no es valida'
                });
            });
        }else{
            //Get identified user id
            var userId = req.user.sub;



            //Find & Update 
            User.findOneAndUpdate({_id: userId}, {image: file_name}, {new:true}, (err, userUpdated) => {


                if(err){
                    return res.status(500).send({
                        status: 'Error',
                        message: 'Error al guardar el archivo'
                    });
                }

                //Return answer
                return res.status(200).send({
                    message: 'Upload avatar',
                    user: userUpdated
                });
            });
        }
       
    },
    avatar: function(req, res){
        var fileName = req.params.fileName;
        var pathFile = './uploads/users/'+fileName;

        fs.exists(pathFile, (exists) =>{
            if(exists){
                return res.sendFile(path.resolve(pathFile));
            }else{
                return res.status(404).send({
                    message: 'Imagen no encontrada'
                });
            }
        });

    },
    getUsers: function(req,res){
        User.find().exec((err, users) => {
            if(err || !users){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No hay usuarios que mostrar'
                });
            }
            return res.status(200).send({
                status: 'Success',
                users
            });
        }); 
    },
    getUser: function(req,res){
        var userId = req.params.userId;

        User.findById(userId).exec((err, user) => {
            if(err || !user){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No existe el usuario'
                });
            }
            return res.status(200).send({
                status: 'Success',
                user
            });
        });
    }
};

module.exports = controller;
