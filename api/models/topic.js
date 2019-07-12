'use strict'

var mongoose = require('mongoose');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
var Schema = mongoose.Schema;

//Model for COMMENT
var CommentSchema = Schema({
    content: String,
    date: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

var Comment = mongoose.model('Comment', CommentSchema);

//Model for TOPIC
var TopicSchema = Schema({
    title: String,
    content: String,
    code: String,
    lang: String,
    date: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'},
    comments: [CommentSchema]
});

//Load pagination
TopicSchema.plugin(aggregatePaginate);

//Exports the module
module.exports = mongoose.model('Topic', TopicSchema);
                            //lowercase & pluralize name
                            //topics -> documents(schema)