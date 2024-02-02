import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import bcrypt from 'bcrypt'

async function create(req, res) {
    try {
       console.log('Hi')
        const user = await User.create(req.body)
         console.log(user)
        const token = createJWT(user)
        res.status(202).json(token)
    } catch(err) {
        res.status(400).json(err)
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne(
            {email: req.body.email})
            if (!user) throw new Error()
            const match = await bcrypt.compare(req.body.password, user.password)
            if (!match) throw new Error()
            res.json( createJWT(user) )
    } catch {
        res.status(400).json('Bad Credentials')
    }
}

function checkToken(req, res) {
    console.log('req.user', req.user)
    res.json(req.exp)
}

function createJWT(user) {
    return jwt.sign(
        { user },
        process.env.SECRET,
        { expiresIn: '24h' }
    )
}

export default {
    create,
    login,
    checkToken
}