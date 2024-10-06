const natural = require('natural');
const tokenizer = new natural.WordTokenizer(); // Initialize the tokenizer
const stopWords = new Set(["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "just", "ll", "me", "more", "most", "mustn't", "my", "myself", "needn't", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "our", "ours", "ourselves", "out", "over", "own", "re", "s", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "t", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "ve", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "will", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"]);
const JobDetails = require('../models/jobs');

// Preprocess function
const preprocessText = (text) => {

    let tokens = tokenizer.tokenize(text);  //Tokenization
    tokens = tokens.map(token => token.toLowerCase());  //Lowercasing
    tokens = tokens.filter(token => !stopWords.has(token));  //Stop Word Removal

    return tokens;
};


// Function to create a template string for job data
const createUserTemplateString = (user) => {

    return `${user.skills} 
            ${user.experience_level} 
            ${user.preferences.desired_roles} 
            ${user.preferences.locations} 
            ${user.preferences.job_type}`;
};


// Function to create a template string for job data
const createJobTemplateString = (job) => {

    return `${job.job_title} 
            ${job.location} 
            ${job.job_type} 
            ${job.required_skills} 
            ${job.experience_level}`;
};


// Calculate TF-IDF 
const calculateTFIDF = (documents) => {
    const N = documents.length;
    const termFrequencies = {};
    const docFrequencies = {};

    // Calculate Term Frequencies and Document Frequencies
    for (const doc of documents) {
        const uniqueTerms = new Set(doc);
        for (const term of doc) {
            termFrequencies[term] = (termFrequencies[term] || 0) + 1;
        }
        for (const term of uniqueTerms) {
            docFrequencies[term] = (docFrequencies[term] || 0) + 1;
        }
    }

    // Calculate TF-IDF scores for each document
    const tfidfScores = documents.map(doc => {
        const scores = {};
        for (const term of doc) {
            const tf = termFrequencies[term];
            const normalizedTF = 1 + Math.log(tf);
            const df = docFrequencies[term];
            const idf = Math.log((N + 1) / (df + 1)) + 1;
            scores[term] = normalizedTF * idf;
        }
        return scores;
    });

    return tfidfScores;
};


const getRecommendations = async (user) => {
    try {
        const jobPostings = await JobDetails.find();

        const userString = createUserTemplateString(user);
        const userTokens = preprocessText(userString);
        const [userTFIDF] = calculateTFIDF([userTokens]); // Get user TF-IDF

        console.log("User TF-IDF:", userTFIDF);

        const jobScores = jobPostings.map((job) => {
            const jobString = createJobTemplateString(job);
            const jobTokens = preprocessText(jobString);
            const [jobTFIDF] = calculateTFIDF([jobTokens]); // Get job TF-IDF

            return {
                job_id: job.job_id,
                score: Object.values(jobTFIDF).reduce((a, b) => a + b, 0), // Sum the TF-IDF scores
            };
        });

        console.log("Job Scores:", jobScores);

        const thresholdScore = 5; // Adjust this threshold as needed

        // Sort jobs based on their score
        const sortedJobs = jobScores.filter(job => job.score >= thresholdScore).sort((a, b) => b.score - a.score);
        
        console.log('Recommended Jobs:', sortedJobs);
        return sortedJobs; 

    } 
    catch (err) {
        console.error('Error fetching or processing job postings:', err);
    }
};



module.exports = getRecommendations;