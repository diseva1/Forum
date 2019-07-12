'use strict'

var validator = require('validator');
var Topic = require('../models/topic');

var controller = {
    add: function(req,res){
        //Collect topic id
        var topicId = req.params.topicId;

        //Find by Id the topic
        Topic.findById(topicId).exec((err, topic) => {
            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error en la petición'
                });
            }
            if(!topic){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No existe el tema'
                });
            }

            //Check if user identified & validate data
            if(req.body.content){
                //Validate data
                try {
                    var validate_content = !validator.isEmpty(req.body.content);
                } catch (error) {
                    return res.status(200).send({
                        message: 'No has comentado nada'
                    });
                }

                if(validate_content){

                    var comment = {
                        user: req.user.sub,
                        content: req.body.content
                    };
                    //In comments property -->push
                    topic.comments.push(comment);
            
                    //Save complete topic
                    topic.save((err) => {

                        if(err){
                            return res.status(500).send({
                                message: 'Error al guardar el comentario'
                            });
                        }
                        //Return answer
                        return res.status(200).send({
                            status: 'success',
                            topic
                        });
                    });

                    
                }else{
                    return res.status(200).send({
                        message: 'No se han validado los datos del comentario'
                    });
                }
            }
            
        });

        
    },
    update: function(req,res){
        //Collect topic id
        var commentId = req.params.commentId;

        //Collect data and validate it
        var params = req.body;
        
        try {
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(200).send({
                message: 'No has comentado nada'
            });
        }

        if(validate_content){
            //Find & Update
            Topic.findOneAndUpdate(
                {"comments._id": commentId},
                {
                    "$set": {
                        "comments.$.content": params.content
                    }
                },
                {new:true},
                (err, topicUpdated) =>{
                    if(err){
                        return res.status(500).send({
                            status: 'Error',
                            message: 'Error al actualizar el comentario'
                        });
                    }
                    if(!topicUpdated){
                        return res.status(404).send({
                            message: 'Comentario no encontrado'
                        });
                    }
                    
                    //Return data
                    return res.status(200).send({
                        status: 'Success',
                        topicUpdated
                    });
                }
            )
        }


        
    },
    delete: function(req,res){
        //Collect topic id & comment id
        var topicId = req.params.topicId;
        var commentId = req.params.commentId;

        //Find the topic
        Topic.findById(topicId, (err, topic) => {
            //Select the comment
            var comment = topic.comments.id(commentId);

            //Delete the comment
            if(comment){
                comment.remove();

                //Save the topic
                topic.save((err) => {
                    if(err){
                        return res.status(404).send({
                            status: 'Error',
                            message: 'El comentario no existe'
                        });
                    }
                    //Return result
                    return res.status(200).send({
                        status: 'Succes',
                        topic
                    });
                });

                
            }else{
                return res.status(404).send({
                    status: 'Error',
                    message: 'El comentario no existe'
                });
            }

            
        });
        
    }

}

module.exports = controller;