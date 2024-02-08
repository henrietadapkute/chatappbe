import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 6

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minLength: 5,
        required: true
    },
    profileImage: {
        type: String
    },
    bio: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            return ret
        }
    }
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, SALT_ROUNDS)
    return next()
})

const User = mongoose.model('User', userSchema)
export default User