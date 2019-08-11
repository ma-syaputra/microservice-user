'use strict'

function convertLocal(){
    var utc = new Date();
    utc.setHours( utc.getHours() + 7);
    return utc
}

module.exports = {
    convertLocal: convertLocal
}