const controller = require('../controllers/friends.controller');
const router = require('express').Router();


router.get('/', (req, res) => controller.getFriends(req, res));


module.exports = router;
