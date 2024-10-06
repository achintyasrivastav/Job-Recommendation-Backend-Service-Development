const express = require('express');        
const db = require('./db');

const bodyParser = require('body-parser');
const { TfIdf } = require('natural');
const Job = require('./models/jobs')

const jobRoutes = require('./routes/jobRoutes');

const app = express();
app.use(bodyParser.json());

 
app.get('/', function(req, res){              //Server Fit check
    res.send('Backend services');
});

//using router
app.use('/jobs', jobRoutes);

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
});


/*
const preprocessText = (text) => {
    // Step 1: Tokenization
    let tokens = tokenizer.tokenize(text);

    // Step 2: Lowercasing
    tokens = tokens.map(token => token.toLowerCase());

    // Step 3: Stop Word Removal
    tokens = tokens.filter(token => !stopWords.has(token));

    return tokens;
};

const calculateTFIDF = (documents) => {
    const N = documents.length; // Total number of documents
    const termFrequencies = {};
    const docFrequencies = {};

    // Step 1: Calculate Term Frequencies and Document Frequencies
    for (const doc of documents) {
        const uniqueTerms = new Set();
        
        for (const term of doc) {
            termFrequencies[term] = (termFrequencies[term] || 0) + 1;
            uniqueTerms.add(term); // Track unique terms for document frequency
        }

        // Update document frequencies for unique terms
        for (const term of uniqueTerms) {
            docFrequencies[term] = (docFrequencies[term] || 0) + 1;
        }
    }

    // Step 2: Calculate TF-IDF
    const tfidfScores = {};
    for (const term in termFrequencies) {
        const tf = termFrequencies[term];
        const normalizedTF = 1 + Math.log(tf); // Normalized TF
        const df = docFrequencies[term];
        const idf = Math.log((N + 1) / (df + 1)) + 1; // IDF
        tfidfScores[term] = normalizedTF * idf; // TF-IDF
    }

    return tfidfScores;
};
*/


//////


/*
const getTFIDFScore = (userProfile, job) => {
    const tfidf = new TfIdf();
    const skillsCombined = job.required_skills.join(' ');
    
    // Add both job and user profile's skills for comparison
    tfidf.addDocument(userProfile.skills.join(' '));
    tfidf.addDocument(skillsCombined);

    const jobSkillsVector = [];
    tfidf.listTerms(1).forEach(term => {
        jobSkillsVector.push(term.tfidf);
    });

    const userSkillsVector = [];
    tfidf.listTerms(0).forEach(term => {
        userSkillsVector.push(term.tfidf);
    });

    // Cosine Similarity Calculation
    return cosineSimilarity(userSkillsVector, jobSkillsVector);
};


// Main Recommendation Algorithm
const recommendJobs = async (userProfile) => {
    let jobs;

    // Step 1: Filter by job title
    if (userProfile.preferences.desired_roles.length > 0) {
        jobs = await Job.find({
            job_title: { $in: userProfile.preferences.desired_roles }
        });
    }

    // Step 2: Further filter by company (if provided)
    if (userProfile.company) {
        jobs = jobs.filter(job => job.company === userProfile.company);
    }

    // Step 3: Fallback to TF-IDF based matching (skills, experience, location, etc.)
    if (jobs.length === 0) {
        jobs = await Job.find();  // Get all jobs if no strict filters matched
    }

    const scoredJobs = jobs.map(job => {
        const score = getTFIDFScore(userProfile, job);
        return { job, score };
    });

    // Sort jobs by similarity score (highest first)
    scoredJobs.sort((a, b) => b.score - a.score);

    // Returning top 5 recommendations (can be adjusted)
    return scoredJobs.slice(0, 5).map(j => j.job);
};
*/
