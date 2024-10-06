const express = require('express');
const router = express.Router();
const JobDetails = require('../models/jobs');
const getRecommendations = require('../content_based_algorithm/recommendationAlgo')

router.get('/', async(req, res) => {

    try{
        const jobDetails = await JobDetails.find();
        console.log('data fetched');
        res.status(200).json(jobDetails);
    }
    catch(err){

        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }
});

router.post('/', async(req, res) => {

    try{
        const data = req.body;

        const newData = new JobDetails(data);
        const response = await newData.save();

        console.log('data saved');
        res.status(200).json(response);       
    }
    catch(err){

        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }
});

router.post('/recommendations', async(req, res) => {

    try{
        const userData = req.body;

        const recommendedJobs = await getRecommendations(userData);

        if(!recommendedJobs){
            return res.status(404).json({err : 'No Jobs Found'});
        }

        console.log('Data is fetched');
        res.status(200).json(recommendedJobs);
    }
    catch(err){

        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }

});


module.exports = router;