'use strict'
function success_app(data,code,res) {
    res.status(200).send(
        {
            status: true,
            code:code,
            response : data || [] 
        });
}
function bad_app(data,code,res) {
    res.status(400).json(
        {
            status: false,
            code : code,
            response : data || [] 
        }
        );
}
function un_app(data,code,res) {
    res.status(401).json(
        {
            status: false,
            code : code,
            response : data || [] 
        }
        );
}
module.exports = {
    success_app: success_app,
    bad_app: bad_app,
    un_app:un_app
}