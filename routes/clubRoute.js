const router = require('express').Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const {
    clubPortController,
    rankingClubGetController,
    clubGetController
 } = require('../controllers/clubController');



router.post('/add-club', isAuthenticated, clubPortController );
router.get('/get-ranking-club' , rankingClubGetController );
router.get('/get-all-club', clubGetController );



module.exports = router