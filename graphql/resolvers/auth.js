// Hashing
const bcrypt = require('bcrypt');

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
    }
};