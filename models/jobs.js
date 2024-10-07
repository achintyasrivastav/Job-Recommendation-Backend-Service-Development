const mongoose = require('mongoose');

//Creating Job Schema
const jobSchema = new mongoose.Schema({

    job_id: {
        type: Number,
        required: true
    },
    job_title: { 
        type: String,  
        required: true 
    },
    company: {
        type: String, 
    },
    location: {
        type: [String],  //Assuming if jobs opens for multiple location
    },
    job_type: { 
        type: String,  
    },
    required_skills: { 
        type: [String],  
    },
    experience_level: { 
        type: String,  
    }

});
  
module.exports = mongoose.model('JobDetails', jobSchema);