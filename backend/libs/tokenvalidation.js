var jwt = require('jsonwebtoken')
let jwtSecretKey = process.env.DEV_TOKEN_KEY
require('dotenv').config()

function tokenvalidation(token){
    try {
        const verified = jwt.verify(token, jwtSecretKey)
        if(verified){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    tokenvalidation
  }