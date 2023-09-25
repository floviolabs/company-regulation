var express = require('express');
var app = express();
var dotenv = require('dotenv');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var HttpStatus = require('http-status-codes');
var ActiveDirectory = require('activedirectory2');
const cors = require('cors');
const CryptoJS = require('crypto-js');

require('dotenv').config();
app.use(cors());

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DEV_DATABASE_USERNAME,
  host: process.env.DEV_DATABASE_HOST,
  database: process.env.DEV_DATABASE_NAME,
  password: process.env.DEV_DATABASE_PASSWORD,
  port: process.env.DEV_DATABASE_PORT,
})

const poolData = new Pool({
    user: process.env.DEV_DATABASE_DATA_USERNAME,
    host: process.env.DEV_DATABASE_DATA_HOST,
    database: process.env.DEV_DATABASE_DATA_NAME,
    password: process.env.DEV_DATABASE_DATA_PASSWORD,
    port: process.env.DEV_DATABASE_DATA_PORT,
  })

//Active Directory
var config = {
    url: process.env.DEV_AD_DOMAIN,
    baseDN: process.env.DEV_AD_BASEDN,
    username: process.env.DEV_AD_USERNAME,
    password: process.env.DEV_AD_PASSWORD
};

//Json Web Token
let jwtSecretKey = process.env.DEV_TOKEN_KEY;
let secretKey = process.env.DEV_SECRET_KEY;
let jwtExpire = process.env.DEV_TOKEN_EXPIRES_IN;

process.on('uncaughtException', function (err) {
    // console.log(err);
  });

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
var router = express.Router();

// Get email & name list
router.post("/get-email", function (req, res, next) {
    pool.query('SELECT * FROM tmp_get_email()', (err, results) => { //change this part when move to new table HR
        if (err) {
          throw err
        }
        var output = {
            "status" : true,
            "message": "Get data successful",
            "data": results.rows
        }
    
        res.contentType('application/json').status(200)
        var valued = JSON.stringify(output)
        res.send(valued)
    })
  })

// Login
router.post("/login", async function (req, res, next){
    const bytes = CryptoJS.AES.decrypt(req.body.a, secretKey);
    const descrypted = bytes.toString(CryptoJS.enc.Utf8);
    console.log(descrypted)
    const username = descrypted.split('rfw3252fr2g25t-5gtg355=')[0]
    const password = descrypted.split('rfw3252fr2g25t-5gtg355=')[1]
    const bytesUsername = CryptoJS.AES.decrypt(username, secretKey);
    const decryptedUsername = bytesUsername.toString(CryptoJS.enc.Utf8);
    const bytesPassword = CryptoJS.AES.decrypt(password, secretKey);
    const decryptedPassword = bytesPassword.toString(CryptoJS.enc.Utf8);
    // console.log(decryptedPassword)

    // Variable init
    var typeUser = false
    var email = ''
    var emp_id = ''
    var regex = /^[0-9]+$/

    // Variable active directory
    var adStat = false
    var adData = ''

    // Variable get data from database
    var data = ''
    var name = ''
    var uid = ''

    var stat = false

    if(!regex.test(decryptedUsername)){
        typeUser = true
    }else{
        emp_id = decryptedUsername
    }

    if(typeUser){
        var ad = new ActiveDirectory({  url: process.env.DEV_AD_DOMAIN,
                                    baseDN: process.env.DEV_AD_BASEDN,
                                    username: process.env.DEV_AD_USERNAME,
                                    password: process.env.DEV_AD_PASSWORD,
                                    attributes: {
                                        user: [ 'manager', 'mail', 'cn'],
                                        group: []
                                    }
                              });
                              
                              const usernameUpdate = decryptedUsername.includes('@') ? decryptedUsername : decryptedUsername + '@aeonindonesia.co.id'
        ad.authenticate(usernameUpdate, decryptedPassword, function(err, auth) {
            if (auth == true) {
                adStat = true
                ad.findUser(email, function(err, usr) {
                    if(err){
                        var output = {
                            "token": "",
                            "status" : false,
                            "message": "System error",
                            "attribute":[]
                        }

                        res.contentType('application/json').status(401);
                        var valued = JSON.stringify(output);
                        res.send(valued);
                    }

                    if(!usr){
                        var output = {
                            "token": "",
                            "status" : false,
                            "message": "Wrong username or password",
                            "attribute":[]
                        }

                        res.contentType('application/json').status(401);
                        var valued = JSON.stringify(output);
                        res.send(valued);
                    }else{
                        pool.query('SELECT * FROM get_emp_data_byparam($1,$2,$3)', [typeUser ? (decryptedUsername.includes('@') ? decryptedUsername : decryptedUsername +'@aeonindonesia.co.id') : '',emp_id,decryptedPassword], (err, results) => { //change this part when move to new table HR

                            if (err) {
                                throw err
                            }
                    
                            data = results.rows;
                    
                            // console.log(data)

                            name = data[0].name
                            uid = data[0].iid
                
                            var dataToken =
                            {
                                "name": name,
                                "uid":uid
                            }

                            const token = jwt.sign({ dataToken }, jwtSecretKey);

                            var output = {
                                "token": token,
                                "status" : true,
                                "message": "Login successful",
                                "attribute":data
                            }
                            
                            res.contentType('application/json').status(200);
                            var valued = JSON.stringify(output);
                            res.send(valued);
                        }) 
                    }
                });       
            }else{
                var output = {
                    "token": "",
                    "status" : false,
                    "message": "Wrong username or password",
                    "attribute":[]
                }

                res.contentType('application/json').status(401);
                var valued = JSON.stringify(output);
                res.send(valued);
            }
        });
    }else{
        pool.query('SELECT * FROM get_emp_data_byparam($1,$2,$3)', [typeUser ? (decryptedUsername.includes('@') ? decryptedUsername : decryptedUsername +'@aeonindonesia.co.id') : '',emp_id,decryptedPassword], (err, results) => { //change this part when move to new table HR
            if (err) {
                throw err
            }
    
            data = results.rows;

            // console.log(data)

            name = data[0].name
            uid = data[0].iid

            var dataToken =
            {
                "name": name,
                "uid":uid
            }
    
            const token = jwt.sign({ dataToken }, jwtSecretKey);

            if (data.length > 0) {
                var output = {
                    "token": token,
                    "status" : true,
                    "message": "Login successful",
                    "attribute":data
                }

                res.contentType('application/json').status(200);
                var valued = JSON.stringify(output);
                res.send(valued);
            }else {
                var output = {
                    "token": "",
                    "status" : false,
                    "message": "Wrong username or password",
                    "attribute":[]
                }

                res.contentType('application/json').status(401);
                var valued = JSON.stringify(output);
                res.send(valued);
            }
        })
    }
})

// Get admin status
router.post("/check-status", function (req, res, next) {
    const in_email = req.body.in_email

    poolData.query('SELECT * FROM fn_arn_admins_check_by_emp_id($1)',[in_email], (err, results) => {
        if (err) {
          throw err
        }
        var output = {
            "status" : true,
            "message": "Get data successful",
            "data": results.rows[0].qty
        }
    
        res.contentType('application/json').status(200)
        var valued = JSON.stringify(output)
        res.send(valued)
    })
  })

// Default
router.get("/", function (req, res, next) {
    return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
        error: HttpStatus.getReasonPhrase(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
    })
});

module.exports = router;