'use strict'
const Joi = require('@hapi/joi')


function valUser(userDetails){
    const schemeUser = {
        username : Joi.string().min(3).max(50).required(),
        password : Joi.string().min(5).max(255).required()
        }
    return Joi.validate(userDetails,schemeUser)
}

module.exports = {
    valUser: valUser
}