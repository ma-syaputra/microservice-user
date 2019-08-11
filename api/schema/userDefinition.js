'use strict'

const mongoose= require('mongoose')
const {convertLocal} = require('./../helper/localtime')

const definition = {
    _id: {
        type: Number,
        required : true
    },
    username : {
        type:String,
        required : true,
        minlength: 3,
        maxlength: 10,
        index: {
            unique: true,
            dropDups: true
        }
    },
    password : {
        type:String,
        required : true,
        minlength: 5,
        maxlength: 255
    },
    active: {
            type: Boolean,
            default: true
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    created_at : {
        type:Date,
        default: convertLocal
    },
    last_updated:{
        type:Date
    },
    last_login:{
        type:Date 
    }
};

var CounterUserSchema= {
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
}

const mdbUser = mongoose.model('Users', definition)
const mdbCounterWordSchema = mongoose.model('counters',CounterUserSchema)

module.exports = {
    mdbUser: mdbUser,
    mdbCounterWordSchema:mdbCounterWordSchema
}