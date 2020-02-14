// Models
const Event = require('../../models/Event');
const User = require('../../models/User');

// Formatters
const { formatEvent } = require('./merge');

// Resolvers
module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return formatEvent(event);
            });
        } catch (e) {
            throw e;
        }
    },
    createEvent: async (args, req) => {
        if (!req.authenticated) {
            throw new Error('Unauthorized!')
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });

        let createdEvent;

        try {
            const res = await event.save();
            createdEvent = formatEvent(res);
            const user = await User.findById(req.userId);

            if (!user) {
                throw new Error('User not found.');
            }
            user.createdEvents.push(event);
            await user.save();
            return  createdEvent;
        } catch (e) {
            throw e;
        }
    }
};