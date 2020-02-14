// Models
const Booking = require('../../models/Booking');
const Event = require('../../models/Event');

// Formatters
const {
    formatEvent,
    formatBooking
} = require('./merge');

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return formatBooking(booking)
            })
        } catch (e) {
            throw e;
        }
    },
    bookEvent: async args => {
        const event = await Event.findById(args.eventId);
        const booking = new Booking({
            user: '5e42b86890193b5da8398f86',
            event: event
        });
        const result = await booking.save();
        return formatBooking(result)
    },
    cancelBooking: async args => {
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