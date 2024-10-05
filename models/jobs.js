const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({

    job_title: { 
        type: String,
        required: true 
    },
    company: {
        type: String,
        required: true 
    },
    location: {
        type: String,
        required: true
    },
    job_type: { 
        type: String, 
        required: true 
    },
    required_skills: { 
        type: [String], 
        required: true 
    },
    experience_level: { 
        type: String, 
        required: true 
    },

});
  
module.exports = mongoose.model('Job', jobSchema);