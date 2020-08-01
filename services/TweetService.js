'use strict'

const Tweet = require('../models/Tweet');

class TweetServcie {

    static async getAll() {
        return Tweet.find({})
    }

    static async saveTweets(tweets) {
        if (!Array.isArray(tweets)) {
            throw new Error('saveTweets function parameter is not an array.')
        }

        return Tweet.insertMany(tweets)
    }
}

module.exports = TweetServcie