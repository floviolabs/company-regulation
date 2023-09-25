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

//Get categories
router.post("/get-all", function (req, res, next) {
  pool.query('SELECT * FROM fn_arn_categories_get()', (err, results) => {
      if (err) {
        throw err
      }
      var output = {
          "status" : true,
          "message": "Get data successfull",
          "data": results.rows
      }
      // console.log(output)
      res.contentType('application/json').status(200)
      var valued = JSON.stringify(output)
      res.send(valued)
  })
})

// Submit category
router.post("/submit", async function (req, res, next) {
  const { in_mcat_id, in_mcat_name, in_mcat_isactive, in_priority } = req.body
  // console.log(in_priority)
  pool.query('call sp_arn_categories_submit($1,$2,$3,$4)', [in_mcat_id, in_mcat_name, in_mcat_isactive, in_priority], (err, results) => {
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
  const { in_mcat_id } = req.body
 
  pool.query('call sp_arn_categories_delete($1)', [in_mcat_id], (err, results) => {
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