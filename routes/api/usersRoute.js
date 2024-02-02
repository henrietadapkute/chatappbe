import express from 'express'
import usersCtrl from '../../controllers/authcontroller.js'
import ensureLoggedIn from '../../config/ensureLoggedIn.js'
import userProfile from '../../controllers/userProfile.js'

const router = express.Router()
// GET /users/check-token
router.get('/check-token', ensureLoggedIn, usersCtrl.checkToken)

// /users/:user
router.get('/user', ensureLoggedIn, (req, res) => {
    const tokenPayload = req.user
    const userId = tokenPayload.userId

    userProfile.getUserProfile(userId)
    .then((userProfileData) => {
        res.json(userProfileData)
    })
    .catch((error) => {
        res.status(500).json
    })
})

// POST /users
router.post ('/', usersCtrl.create)
router.post ('login', usersCtrl.login)

export const userRouter = router


