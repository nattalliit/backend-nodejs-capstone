require('dotenv').config();
const express = require('express');
const axios = require('axios');
// const logger = require('./logger');
// const logger = require('./node_modules/logger');
const logger = require('./logger');

// const logger = require('./node_modules/logger');
// const expressPino = require('express-pino-logger')({ logger });
// const pinoLogger = require('./logger');

// Task 1: import the natural library
const natural = require("natural");

// Task 2: initialize the express server
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// app.use(expressPino);

// Define the sentiment analysis route
// Task 3: create the POST /sentiment analysis

app.post("/sentiment", async (req, res) => {

    // Task 4: extract the sentence parameter
    const { sentence } = req.query;

    console.log(sentence)


    if (!sentence) {
        logger.error('No sentence provided');
        // log.console('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer with the Natural's PorterStemmer and "English" language
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");

    // Perform sentiment analysis
    try {
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        let sentiment = "neutral";

        // Task 5: set sentiment to negative or positive based on score rules
        // {{insert code here}}
        if ( analysisResult < 0 )
        {
            sentiment = "negative";
        }
        else if ( (analysisResult > 0) && (analysisResult < 0.33) )
        {
            sentiment = "neutral";
        } 
        else
        {
            sentiment = "positive";
        }

        // Logging the result
        logger.info(`Sentiment analysis result: ${analysisResult}`);
        // log.console(`Sentiment analysis result: ${analysisResult}`);

        // Task 6: send a status code of 200 with both sentiment score and the sentiment txt in the format { sentimentScore: analysisResult, sentiment: sentiment }
        // {{insert code here}}
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });

    } catch (error) {
        logger.error(`Error performing sentiment analysis: ${error}`);
        // log.console(`Error performing sentiment analysis: ${error}`);
        // Task 7: if there is an error, return a HTTP code of 500 and the json {'message': 'Error performing sentiment analysis'}
        // {{insert code here}}
        res.status(500).json({ "error": error.info });
    }
});

app.listen(port, () => {
    // logger.error(`Server running on port ${port}`);
    logger.info('/ called');

    // log.console(`Server running on port ${port}`);
    // pinoLogger.info(`Server running on port ${port}`);
});
