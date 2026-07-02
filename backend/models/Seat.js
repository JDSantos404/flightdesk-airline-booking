const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    seatNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'maintenance'],
        required: true
    }
});

module.exports = mongoose.model('Seat', seatSchema);