'use strict'

var express = require('express');
var TopicController = require('../controllers/topic');

var router = express.Router();
var md_auth  = require('../middlewares/authenticated');

//Routes 
router.post('/topic', md_auth.authenticated, TopicController.save);
router.get('/topics/:page?', TopicController.getTopics);
router.get('/user-topics/:user', TopicController.userTopics);
router.get('/topic/:topic', TopicController.getTopic);
router.put('/topic/:id', md_auth.authenticated, TopicController.update);
router.delete('/topic/:id', md_auth.authenticated, TopicController.delete);
router.get('/search/:search', TopicController.search);

//Exports the module
module.exports = router;