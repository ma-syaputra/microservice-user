'use strict'
const bcrypt = require('bcrypt')
const _ = require('lodash') 
const userAi = require('../schema/userDefinition').mdbCounterWordSchema
const {convertUsername} = require('../helper/lower')
const statusAppCode = require('../config/status').statusAppCrud
const statusErrCode = require('../config/status').errorApp
var statusResp = null
const response = require('../response/response')
const { valUser } = require('../validation/userValidation')



async function registration(req, res) {
    const userDetails = _.pick(req.body,['username','password'])
    const { error } = valUser(userDetails)

    if(error){
        const statusErrValidation = statusErrCode('validation')
        return response.bad_app(error.details[0].message,statusErrValidation.code,res)
    }
    userDetails.username = convertUsername(userDetails.username)

    const userFindUsername= await req.crudder.findOne({username:userDetails.username})
    if(userFindUsername){
        const statusErrfind = statusErrCode('userexist')
        return response.bad_app(statusErrfind.message,statusErrfind.code,res)
    }

    const encryptPass = await hashpassword(userDetails.password)
    if(!encryptPass){
        const statusErrHash = statusErrCode('hash')
        return response.bad_app(statusResp,statusErrHash.code,res)
    }
    userDetails.password = encryptPass
    

    const userIncrement = await userAi.findByIdAndUpdate({_id: 'user'}, {$inc: { seq: 1}});
    if(!userIncrement){
        const statusErrInc = statusErrCode('inc')
        return response.bad_app(statusResp,statusErrInc.code,res)
    }
    userDetails['_id'] = userIncrement.seq
    
    try {
        const user =  new req.crudder(userDetails)
        await user.save()
        const statusApp = statusAppCode('success')
        return response.success_app(statusApp.message,statusApp.code,res)
    } catch (error) {
        return response.bad_app(statusResp,statusErrDb.code,res)
        
    }
   
}

function hashpassword(password){
    const saltRounds = parseInt(process.env.SALT) || 10
    const hashedPassword = new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) reject(err)
        resolve(hash)
        });
    })
    return hashedPassword
}

module.exports = {
registration: registration
}
