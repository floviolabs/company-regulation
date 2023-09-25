var express = require('express');
var router = express.Router();
const cors = require('cors');

var accessController = require('../controllers/accessController');
var categoryController = require('../controllers/categoryController');
var menuController = require('../controllers/menuController');
var logController = require('../controllers/logController');

const app = express();
app.use(cors());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PT. AEON INDONESIA' });
});
  
router.use('/access', accessController);
router.use('/categories', categoryController);
router.use('/menus', menuController);
router.use('/logs', logController);

module.exports = router;