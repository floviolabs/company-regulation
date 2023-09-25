var express = require('express')
const Pool = require('pg').Pool
const { tokenvalidation } = require('../libs/tokenvalidation')

require('dotenv').config()

const pool = new Pool({
  user: process.env.DEV_DATABASE_DATA_USERNAME,
  host: process.env.DEV_DATABASE_DATA_HOST,
  database: process.env.DEV_DATABASE_DATA_NAME,
  password: process.env.DEV_DATABASE_DATA_PASSWORD,
  port: process.env.DEV_DATABASE_DATA_PORT,
})

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  if(!tokenvalidation(token))
  {
    var output = {
      "status" : false,
      "message": "unrecognize"
      }

      res.contentType('application/json').status(200);
      var valued = JSON.stringify(output);
      return res.send(valued);
  }
  next();
};

var router = express.Router()
router.use(authenticateToken)

// Get menus
router.post("/get-all", function (req, res, next) {
  pool.query('SELECT * FROM fn_arn_menus_get_all()', (err, results) => {
      if (err) {
        throw err
      }
      var output = {
          "status" : true,
          "message": "Get data successfull",
          "data": results.rows
      }
  
      res.contentType('application/json').status(200)
      var valued = JSON.stringify(output)
      res.send(valued)
  })
})

router.post("/get-active", function (req, res, next) {
  pool.query('SELECT * FROM fn_arn_menus_get_active()', (err, results) => {
      if (err) {
        throw err
      }
      var output = {
          "status" : true,
          "message": "Get data successfull",
          "data": results.rows
      }
  
      res.contentType('application/json').status(200)
      var valued = JSON.stringify(output)
      res.send(valued)
  })
})

// Submit menu
router.post("/submit", async function (req, res, next) {
  const { in_mmen_id, in_mmen_mcat_id, in_mmen_name, in_mmen_link, in_mmen_sso_key, in_mmen_icon, in_mmen_image, in_mmen_isactive } = req.body
  
  pool.query('call sp_arn_menus_submit($1,$2,$3,$4,$5,$6,$7,$8)', [in_mmen_id, in_mmen_mcat_id, in_mmen_name, in_mmen_link, in_mmen_sso_key, in_mmen_icon, in_mmen_image, in_mmen_isactive], (err, results) => {
    if (err) {
      throw err
    }

    var output = {
      "status" : true,
      "message": "Data has been saved"
    }

    res.contentType('application/json').status(200)
    var valued = JSON.stringify(output)
    res.send(valued)
  })
})

router.post("/delete", async function (req, res, next) {
  const { in_mmen_id } = req.body
 
  pool.query('call sp_arn_menus_delete($1)', [in_mmen_id], (err, results) => {
    if (err) {
      throw err
    }

    var output = {
      "status" : true,
      "message": "Data has been deleted"
    }

    res.contentType('application/json').status(200)
    var valued = JSON.stringify(output)
    res.send(valued)
  })
})

module.exports = router