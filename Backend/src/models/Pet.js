const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String },
    age: { type: Number },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
