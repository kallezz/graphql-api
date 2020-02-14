const bcrypt = require('bcrypt');
const Event = require('../../models/Event');
const User = require('../../models/User');

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                createdEvents: events.bind(this, user._doc.createdEvents)
            };
        })
        .catch(e => {
            throw e;
        })
};

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    creator: user.bind(this, event.creator)
                };
            })
        })
        .catch(e => {
            throw e;
        })
};

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc,
                        creator: user.bind(this, event._doc.creator)
                    };
                });
            })
            .catch(e => {
                console.error(e);
                throw e;
            });
    },
    createEvent: args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5e42b86890193b5da8398f86'
        });

        let createdEvent;

        return event
            .save()
            .then(res => {
                createdEvent = {
                    ...res._doc,
                    creator: user.bind(this, res._doc.creator)
                };
                return User.findById('5e42b86890193b5da8398f86');
            })
            .then(user => {
                if (!user) {
                    throw new Error('User not found.')
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                return  createdEvent;
            })
            .catch(e => {
                console.error(e);
                throw e;
            });
    },
    createUser: args => {
        return User.findOne({email: args.userInput.email})
            .then(user => {
                if (user) {
                    throw new Error('User already exists.');
                }
                return bcrypt.hash(args.userInput.password, 10)
            })
            .then(hash => {
                const user = new User({
                    email: args.userInput.email,
                    password: hash
                });

                return user.save();
            })
            .then(result => {
                return {...result._doc, password: null}
            })
            .catch(e => {
                throw e;
            });
    }
};