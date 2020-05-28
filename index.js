const Twitter = require('twitter-lite');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const user = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
});

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
            q: "Lenín Moreno", // The search term
            lang: "es",        // Let's only get English tweets
            count: 100,        // Limit the results to 100 tweets
        });

        // Loop over all the tweets and print the text
        for (tweet of response.statuses) {
            console.dir(tweet.text);
        }
    } catch(e) {
        console.log("There was an error calling the Twitter API");
        console.dir(e);
    }
})();