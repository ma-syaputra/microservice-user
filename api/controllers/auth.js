
'use strict';
const _= require('lodash')
const bcrypt = require('bcrypt')
const moment = require('moment')
const {valUser} = require('./../validation/userValidation')
const response = require('./../response/response')
const jwt = require('jsonwebtoken')
const {trimWord} = require('./../helper/lower')
const statusAppCode = require('../config/status').statusAppauth
const statusErrCode = require('../config/status').errorApp
var statusResp = null
const {convertLocal} = require('./../helper/localtime')
const request = require('request')

async function auth(req, res) {
    // console.log(convertLocal)
    const userDetails = _.pick(req.body,['username','password'])
    const { error } = valUser(userDetails)
    
    if(error){
        const statusErrValidation = statusErrCode('validation')
        return response.bad_app(error.details[0].message,statusErrValidation.code,res)
    } 
    const username = {username:trimWord(userDetails.username)}
    console.log(username)
    const userFindUsername = await req.crudder.findOne(username)
    
    if(!userFindUsername){
        const statusErrUsername = statusErrCode('invaliduser')
        return response.bad_app(statusErrUsername.message,statusErrValidation.code,res)
    } 

    const getAuth= await checkpassword(userDetails.password,userFindUsername.password)
    if(!getAuth) {
        const statusErrPass = statusErrCode('invalidpass')
        return response.bad_app(statusErrPass.message,statusErrValidation.code,res)
    }

    var token = generateUser(userFindUsername)
    if(!token){
        const statusToken = statusErrCode('token')
        return response.bad_app(statusResp,statusToken.code,res)
    } 

    const keyUser = {
        userid: userFindUsername['_id'],
        is_admin: userFindUsername['is_admin'],
        username: userFindUsername['username'],
        token:token
    }
    const last = {
        last_login : convertLocal()
    }

    const generateToken =  await req.crudder.findOneAndUpdate(username, {$set:last})
    if(!generateToken){
        const statusLogin = statusErrCode('lastlogin')
        return response.bad_app(statusResp,statusLogin.code,res)
    }
    
    const options = {
        headers: {
            'authorization' : 'STK '+token
        },
        method: 'POST',
        url: 'http://localhost:4003/checkuser',
        json : {'userid':userFindUsername['id']}  
    };
    request(options, function(err, responses, body) {
        if(responses.statusCode == 200){
        const statusApp = statusAppCode('token')
        return response.success_app(keyUser,statusApp.code,res)
        }else{
            const statusToken = statusErrCode('token')
            return response.bad_app(statusResp,statusToken.code,res)
        }
    });
}

function generateUser(userFindUsername){
    const saveToken =  _.pick(userFindUsername,['_id','username','is_admin'])
    return jwt.sign(saveToken, process.env.SECREET || 'secreet' , { expiresIn: '1d' },{ algorithm: 'RS256'})
}

function checkpassword(password,hashpassword){
    const comparePassword = new Promise((resolve, reject) => {
    bcrypt.compare(password, hashpassword).then(function(res) {
        resolve(res)
    });
    })
    return comparePassword
}


async function userValidate(req, res) {
    const header = req.headers['authorization'];
    if(typeof header !== 'undefined') {
        const stk = header.split(' ');
        const token = stk[1];
        try {
            const decoded = jwt.verify(token, process.env.SECREET || 'secreet');
            console.log(decoded)
            const statusApp = statusAppCode('uservalidate')
            const dataUser = _.pick(decoded,['_id','username','is_admin'])
            return response.success_app(dataUser,statusApp.code,res)      
        } catch (error) {
            const statusErrUnvalidate = statusErrCode('userunvalidate')
            return response.un_app(statusErrUnvalidate.message,statusErrUnvalidate.code,res)
        }
    } else {
        res.status(401).json('unauthorized');
    }

}

module.exports = {
    auth: auth,
    userValidate:userValidate
}
