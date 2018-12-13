const controller = require('../controllers/groups.controller');
const router = require('express').Router();


router.post('/:groupId/post/:postId/like', (req, res) => controller.like(req, res));
router.get('/:id', (req, res) => controller.getWallById(req, res));
router.post('/subscribe', (req, res) => controller.subscribe(req, res));
router.post('/unsubscribe', (req, res) => controller.unsubscribe(req, res));
router.get('/', (req, res) => controller.getGroups(req, res));


module.exports = router;
