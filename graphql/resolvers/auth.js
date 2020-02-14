// Hashing
const bcrypt = require('bcrypt');

// Token
const jwt = require('jsonwebtoken');

// Models
const User = require('../../models/User');

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email});
            if (existingUser) {
                throw new Error('User already exists.');
            }
            const hash = await bcrypt.hash(args.userInput.password, 10);
            const user = new User({
                email: args.userInput.email,
                password: hash
            });
            const result = await user.save();
            return {...result._doc, password: null}
        } catch (e) {
            throw e;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        // TODO: Secure secret for JWT
        const token = jwt.sign({userId: user._id, email: user.email}, 'somesecretforlocal', {
            expiresIn: '24h'
        });
        return {
            userId: user._id,
            token,
            tokenExpiration: 24
        }
    }
};