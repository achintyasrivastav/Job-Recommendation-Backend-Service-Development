const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const { TfIdf } = require('natural');

const app = express();
app.arguments(bodyParser.json());

app.get('/', function(req, res){
    res.send('Backend services');
});

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
});