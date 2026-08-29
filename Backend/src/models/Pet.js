const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Pet name is required'],
        trim: true 
    },
    species: { 
        type: String, 
        required: [true, 'Species is required'],
        enum: ['dog', 'cat', 'bird', 'fish', 'small-pet', 'reptile', 'other'],
        default: 'dog'
    },
    breed: { 
        type: String, 
        default: 'Mixed / Other',
        trim: true 
    },
    age: { 
        type: Number, 
        min: [0, 'Age cannot be negative'],
        default: 1 
    },
    birthDate: { 
        type: Date 
    },
    gender: { 
        type: String, 
        enum: ['male', 'female', 'unknown'], 
        default: 'unknown' 
    },
    weight: { 
        type: Number, 
        min: [0, 'Weight cannot be negative'],
        default: 5 
    },
    activityLevel: { 
        type: String, 
        enum: ['low', 'moderate', 'high'], 
        default: 'moderate' 
    },
    medicalConditions: [{ 
        type: String,
        trim: true 
    }],
    allergies: [{ 
        type: String,
        trim: true 
    }],
    dietaryPreferences: [{ 
        type: String,
        trim: true 
    }],
    microchipNumber: { 
        type: String,
        trim: true 
    },
    imageUrl: { 
        type: String, 
        default: '' 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Pet owner is required'] 
    }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
