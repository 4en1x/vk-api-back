const controller = require('../controllers/history.controller');
const router = require('express').Router();


router.get('/', (req, res) => controller.getHistory(req, res));


module.exports = router;
