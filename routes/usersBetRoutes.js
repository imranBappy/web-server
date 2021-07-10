const router = require('express').Router();
const { 
    betPostController , 
    betGetController,
    userBetStatusUpdateController,
    userBetGetController
} = require('../controllers/usersBetController');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.post('/adduserbet',isAuthenticated, betPostController)
router.get('/', isAuthenticated, betGetController);
router.patch('/result-status-update', isAuthenticated, userBetStatusUpdateController);
router.get(`/user-bet-get`, isAuthenticated, userBetGetController)


module.exports = router