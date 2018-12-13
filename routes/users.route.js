const controller = require('../controllers/users.controller');
const router = require('express').Router();

router.get('/username', (req, res) => controller.getUser(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));
router.post('/register', (req, res) => controller.register(req, res));
router.post('/vkToken', (req, res) => controller.vkToken(req, res));

module.exports = router;
