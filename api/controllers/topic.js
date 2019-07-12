'use strict'

var validator = require('validator');
var Topic = require('../models/topic');

var controller = {

    save: function(req, res){
        
        //Collect params
        var params = req.body;

        //Validate data
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
        } catch (error) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }

        if(validate_title && validate_content && validate_lang){
            //Create object to save
            var topic = new Topic();

            //Assign values
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang  = params.lang;
            topic.user = req.user.sub;

            //Save topic
            topic.save((err, topicStored) => {
                if(err || !topicStored){
                    return res.status(404).send({
                        status: 'Error',
                        message: 'El topic no ha sido guardado'
                    });
                }
                //Return response
                return res.status(200).send({
                    status: 'Success',
                    topicStored
                });
            });


        }else{
            return res.status(200).send({
                message: 'Los datos no son válidos'
            });
        }

        
    },
    getTopics: function(req, res){
        
        //Load pagination library (in the model)

        //Collect actual page
        if(!req.params.page || req.params.page == 0 || req.params.page == '0' || req.params.page == undefined){
            var page = 1;
        }else{
            var page = parseInt(req.params.page);
        }

        //Config pagination options
        var options = {
            page: page,
            limit: 5,
            sort: {date: -1}
        };


        //Find pagination
        var pagination = Topic.aggregate();
        Topic.aggregatePaginate(pagination, options, (err, topics) => {
            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error al realizar la consulta'
                });

            }

            if(!topics){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No hay topics'
                });
            }

            //Return results(topics, total of topics, total pages)
            return res.status(200).send({
                status: 'Success',
                topics: topics.docs,
                totalTopics: topics.totalDocs,
                totalPages: topics.totalPages
                
            });
        });

        
    },
    userTopics: function(req, res){
        
        //Get user id
        var userId = req.params.user;

        //Find topics with user id
        Topic.find({user: userId}).sort([['date', 'descending']]).exec((err, topics) => {
            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error en la peticion'
                });
            }
            if(!topics){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No hay temas para mostrar'
                });
            }
            //Return result
            return res.status(200).send({
                status: 'Success',
                topics
            });
        });

    },
    getTopic: function(req,res){
        //Get topic id
        var topicId = req.params.topic;

        //Find topic by id
        Topic.findById(topicId).populate('user').exec((err, topic) => {

            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error en la peticion'
                });
            }
            if(!topic){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No existe el tema'
                });
            }
            //Return result
            return res.status(200).send({
                status: 'Success',
                topic
            });
        });
    },
    update: function(req, res){
        //Get topic id
        var topicId = req.params.id;
        
        //Collect data from post
        var params = req.body;

        //Validate data
        //TODO: Comprobar que la validación es útil
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
        } catch (error) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }
        
        if(validate_title && validate_content && validate_lang){
            //Create JSON with modifiable data 
            var update = {
                title: params.title,
                content: params.content,
                code: params.code,
                lang: params.lang
            };

            //Find & Update topic by id and user id
            Topic.findOneAndUpdate({_id: topicId, user: req.user.sub}, update, {new:true}, (err, updatedTopic) => {
                if(err){
                    return res.status(500).send({
                        status: 'Error',
                        message: 'Error en la peticion'
                    });
                }
                if(!updatedTopic){
                    return res.status(404).send({
                        status: 'Error',
                        message: 'No existe el tema'
                    });
                }
                //Return result
                return res.status(200).send({
                    status: 'Success',
                    updatedTopic
                });
            });

        }else{
            return res.status(200).send({
                status: 'Error',
                message: 'La validación de datos no es correcta'
            });
        }
    },
    delete: function(req, res){
        //Get topic id
        var topicId = req.params.id;

        //Find & Delete by topicID and userID
        Topic.findOneAndDelete({_id: topicId, user: req.user.sub}, (err, topicRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error en la peticion'
                });
            }
            if(!topicRemoved){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No se ha borrado el tema'
                });
            }
            //Return result
            return res.status(200).send({
                status: 'Success',
                topicRemoved
            });
        });
    },
    search: function(req, res){
        //Collect search params
        var searchString = req.params.search;

        //Find or
        Topic.find({"$or": [
            {"title": {"$regex": searchString, "$options": "i"} },
            {"content": {"$regex": searchString, "$options": "i"} },
            {"code": {"$regex": searchString, "$options": "i"} },
            {"lang": {"$regex": searchString, "$options": "i"} }
        ]})
        .sort([['date', 'descending']])
        .exec((err, results) => {
            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error en la peticion'
                });
            }
            if(!results){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No se ha encontrado ningún tema'
                });
            }
            //Return result
            return res.status(200).send({
                status: 'Success',
                results
            });

        })

        
    }

}

module.exports = controller;