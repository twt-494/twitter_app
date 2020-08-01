'use strict'

const moment = require('moment');
const twitterClient = require('../utils/TwitterClient');

class TwitterClientService {
    static async getTweets(keyword, since_id = '', max_id = '') {
        const now = moment()
        now.subtract(7, 'd')

        return new Promise((resolve, reject) => {
            twitterClient.get('https://api.twitter.com/1.1/search/tweets.json', {
                count: 100,
                until: now.format("YYYY-MM-DD"),
                lang: 'en',
                q: keyword,
                since_id,
                max_id,
            }, (error, tweets, response) => {
                if (error) {
                    reject(error);
                }
                resolve(tweets);
            })
        })

    }
}

module.exports = TwitterClientService