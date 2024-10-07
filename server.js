const express = require('express');                      // Import Express framework
const db = require('./db');                              // Import database connection

const bodyParser = require('body-parser');               // Import body-parser for parsing request bodies
const { TfIdf } = require('natural');                    // Import TfIdf from natural library
const Job = require('./models/jobs')                     // Import Job model
  
const jobRoutes = require('./routes/jobRoutes');         // Import job routes

const app = express();
app.use(bodyParser.json());


//Server health check
app.get('/', function(req, res){              
    res.send('Backend services');
});

//using router
app.use('/jobs', jobRoutes);

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
});