const mongoose = require('mongoose');

// MongoDB connection URL (replace with your MongoDB URI from Atlas)
const mongoURI = "mongodb+srv://edc_pict:j7pGlVwEWMOI59KM@edc-attendance-cluster.2aggt.mongodb.net/?retryWrites=true&w=majority&appName=edc-attendance-cluster";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });