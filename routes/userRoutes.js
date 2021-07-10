const { 
    registerPostController,
    allUserGetController, 
    loginPostController, 
    changePasswordPutController, 
    singleUserGetController ,
    userUpdateController,
} = require('../controllers/userController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const router = require('express').Router();

router.post('/register', registerPostController );
router.post('/login', loginPostController );
router.put('/login', isAuthenticated, changePasswordPutController);
router.patch('/update-user', isAuthenticated, userUpdateController);
router.get('/single-user/:userId',isAuthenticated, singleUserGetController)
router.get('/',isAuthenticated, allUserGetController)





module.exports = router