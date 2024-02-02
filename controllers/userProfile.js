import User from '../models/User.js'

async function getUserProfile(req, res) {
    try {
        const userId = req.params.id
        const user = await User.findbyId(userId, '-password')

        if (!user) {
            return res.status(404).json({ message: 'User not found'})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message })
    }
}

async function updateUserProfile(req, res) {

}

async function deleteUser(req, res) {

}

export default {
    getUserProfile,
    updateUserProfile,
    deleteUser
}