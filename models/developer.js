const mongoose = require('mongoose');

const devSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['BEGINNER', 'EXPERT']
    },
    address: {
        unit: String,
        street: String,
        suburb: String,
        state: String
    }
});

module.exports = mongoose.model("Developer", devSchema);