const express = require('express')
const router = express.Router()
const usersCtrl = require('../controllers/authcontroller')
const ensureLoggedIn = require('../config/ensureLoggedIn')

// GET /users/checkt-token
router.get('/check-token', ensureLoggedIn, usersCtrl.checkToken)

// POST /users

router.post ('/', usersCtrl.create)
router.post ('login', usersCtrl.login)

module.exports = router

