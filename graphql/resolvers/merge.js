// Models
const Event = require('../../models/Event');
const User = require('../../models/User');

// Helpers
const { dateToString } = require('../../helpers/date');

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (e) {
        throw e;
    }
};

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}});
        return events.map(event => {
            return formatEvent(event);
        })
    } catch (e) {
        throw e;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await  Event.findById(eventId);
        return formatEvent(event);
    } catch (e) {
        throw e;
    }
};

const formatEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
};

const formatBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
};

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
exports.formatEvent = formatEvent;
exports.formatBooking = formatBooking;