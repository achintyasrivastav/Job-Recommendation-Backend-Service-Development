// Import necessary modules
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const sw = require('stopword');
const stopWords = new Set(sw.english);
const JobDetails = require('../models/jobs'); 

// Preprocessing function
const preprocessText = (text) => {
    if (!text || typeof text !== 'string') return [];

    let tokens = tokenizer.tokenize(text.toLowerCase());              //Tokenization & Lowercasing
    tokens = tokens.filter(token => !stopWords.has(token));           //Stop Word Removal
    return tokens;
};


// Function to calculate match score based on prioritized factors
const calculateMatchScore = (user, job) => {
    let score = 0;

    // Priority-based weights
    const weights = {
        desired_roles: 5,                                                                  //Highest priority
        skills: 4,
        job_type: 3,
        locations: 2                                                                       //Lowest priority
    };

    // Desired Roles Match
    const desiredRoles = user.preferences.desired_roles.map(role => role.toLowerCase());   //User desired_roles (lowercased)
    const jobTitleTokens = preprocessText(job.title || "");                                //Tokenized job title
    const rolesMatch = desiredRoles.some(role => jobTitleTokens.includes(role));           //Matching user role with job title
    if (rolesMatch) {
        score += weights.desired_roles;                                                    //if match => add the weight to score
    }


    // Skills Match
    const userSkills = user.skills.map(skill => skill.toLowerCase());                      //User skills (lowercased)
    const jobSkills = (job.required_skills || []).map(skill => skill.toLowerCase());       //Required skills for the job
    const matchingSkills = jobSkills.filter(skill => userSkills.includes(skill));          //Finding the matching data between user and job
    if (jobSkills.length > 0) {
        const skillMatchRatio = matchingSkills.length / jobSkills.length;                  //Proportion of matching skills
        score += skillMatchRatio * weights.skills;                                         //add the weight to score
    }


    // Job Type Match
    if (job.job_type && user.preferences.job_type 
       && user.preferences.job_type.toLowerCase() === job.job_type.toLowerCase()) {       //checking for if user's preferred job type matches job's type

        score += weights.job_type;                                                        //if match => add the weight to score
    }


    // Location Match
    const userLocations = user.preferences.locations.map(loc => loc.toLowerCase());       // User's preferred locations (lowercased)

    if (job.location && typeof job.location === 'string' 
        && userLocations.includes(job.location.toLowerCase())) {                          //if job location matches user's preferences
        score += weights.locations;                                                       //if match => add the weight to score
    }

    return score;
};


// Keyword Matching Fallback
const keywordMatching = (user, jobPostings) => {
    
    const userKeywords = [                                                         // Collect user keywords from :
        ...user.preferences.desired_roles,                                         // preferences => desired_roles (lowercased)
        ...user.skills,                                                            // skills (lowercased)
        user.preferences.job_type,                                                 // preferences => job_type  (lowercased)
        ...user.preferences.locations                                              // preferences => locations (lowercased)
    ].map(keyword => keyword.toLowerCase());

    return jobPostings.filter(job => {                                                  
        
        const jobKeywords = [                                                       // Collect job keywords from :
            ...preprocessText(job.title),                                           // title (lowercased)
            ...job.required_skills.map(skill => skill.toLowerCase()),               // required skills (lowercased)
            job.job_type.toLowerCase(),                                             // job type (lowercased)
            job.location.toLowerCase()                                              // and locationa (lowercased)
        ];

        return userKeywords.some(keyword => jobKeywords.includes(keyword));
    });
};

// Function to recommend jobs based on priority match or fallback to keyword matching
const getRecommendations = async (user) => {
    try {
        const allJobs = await JobDetails.find();                                    // Fetch all job postings from the database
        const recommendedJobs = [];

        
        allJobs.forEach(job => {
            const matchScore = calculateMatchScore(user, job);                      // Calculating the match score for the user and job
            if (matchScore > 0) {                                                   //if score is greater than zero, add the job and its score to the recommendations
                recommendedJobs.push({ job, score: matchScore });
            }
        });

        console.log(allJobs);

        //sorting
        recommendedJobs.sort((a, b) => b.score - a.score);                          // Sort recommendations by match score in descending order

        // keyword matching fallback
        if (recommendedJobs.length === 0) {
            const fallbackMatches = keywordMatching(user, allJobs);                 // Use keyword matching to find job
            return fallbackMatches;
        }

        return recommendedJobs.map(recommendation => recommendation.job);           // Return the sorted jobs
    }
    catch (error) {
        console.error("Error recommending jobs:", error);                           //Error handling
        return [];
    }
};

module.exports = getRecommendations;