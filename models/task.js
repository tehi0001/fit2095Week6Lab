const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    name: String,
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    dueDate: Date,
    status: {
        type: String,
        enum: ['InProgress', 'Complete']
    },
    description: String
})

module.exports = mongoose.model("Task", taskSchema);