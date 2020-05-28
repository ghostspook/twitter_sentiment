const Twitter = require('twitter-lite');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const user = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
});

const query = 'Lenín Moreno';

// Wrap the following code in an async function that is called
// immediately so that we can use "await" statements.
(async function() {
    try {
        let response = await user.getBearerToken();
        const app = new Twitter({
            bearer_token: response.access_token,
        });

        // Search for recent tweets from the twitter API
        response = await app.get(`/search/tweets`, {
            q: query, // The search term
            lang: "es",        // Let's only get English tweets
            count: 100,        // Limit the results to 100 tweets
        });

        // Loop over all the tweets and print the text
        for (tweet of response.statuses) {
            console.dir(tweet.text);
        }

        let allTweets = "";
        for (tweet of response.statuses) {
            allTweets += tweet.text + "\n";
        }
        
        const sentimentScore = await getSentimentScore(allTweets);
        console.log(`The sentiment about ${query} is: ${sentimentScore}`);
    } catch(e) {
        console.log("There was an error calling the Twitter API");
        console.dir(e);
    }    
})();

// *********** GetSentiment function ************

const language = require('@google-cloud/language');
const languageClient = new language.LanguageServiceClient();

async function getSentimentScore(text) {
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [result] = await languageClient.analyzeSentiment({document: document});
    const sentiment = result.documentSentiment;

    return sentiment.score;
}

// ******** End of GetSentiment function *********