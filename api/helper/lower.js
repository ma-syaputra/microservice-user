function convertAny(input){
    const removeSpecial =  input.replace(/[^a-zA-Z]/g,"")
    const lowerCase = removeSpecial.toLowerCase()
    return lowerCase
}

function convertUsername(input){
    const removeSpecial =  input.replace(/[^a-zA-Z0-9]/g,"")
    const lowerCase = removeSpecial.toLowerCase()
    return lowerCase
}

function convertLower(input){
    const lowerCase = input.toLowerCase()
    return lowerCase
}
function trimWord(input){
return input.trim()
}



module.exports = {
    convertLower: convertLower,
    convertAny:convertAny,
    convertUsername:convertUsername,
    trimWord:trimWord

}