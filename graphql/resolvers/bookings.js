// Models
const Booking = require('../../models/Booking');
const Event = require('../../models/Event');

// Formatters
const {
    formatEvent,
    formatBooking
} = require('./merge');

module.exports = {
    bookings: async req => {
        if (!req.authenticated) {
            throw new Error('Unauthorized!')
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return formatBooking(booking)
            })
        } catch (e) {
            throw e;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.authenticated) {
            throw new Error('Unauthorized!')
        }
        const event = await Event.findById(args.eventId);
        const booking = new Booking({
            user: req.userId,
            event: event
        });
        const result = await booking.save();
        return formatBooking(result)
    },
    cancelBooking: async (args, req) => {
        if (!req.authenticated) {
            throw new Error('Unauthorized!')
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = formatEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (e) {
            throw e;
        }
    }
};