const express = require('express')
const { signupUser, authUser, allUsers } = require('../controllers/userControllers')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/').post(signupUser).get(protect, allUsers)
router.post('/login', authUser)


module.exports = router;