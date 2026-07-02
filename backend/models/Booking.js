const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    seatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat',
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        required: true
    }
});

module.exports = mongoose.model('Booking', bookingSchema);