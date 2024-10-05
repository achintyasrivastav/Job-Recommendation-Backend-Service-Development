const mongoose = require('mongoose');

const mongoURL = 'mongodb://localhost:27017/job-data';

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', ()=>{
    console.log('Connected to MongoDB server');
})

db.on('error', ()=>{
    console.log('MongoDB connection error :', err);
})

db.on('disconnected', () => {
    console.log('MongoDB Disconnected');
});

module.exports = db;