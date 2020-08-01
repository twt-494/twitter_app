'use strict'

const kue = require('kue');
const Keyword = require('../models/Keyword');
const Tweet = require('../models/Tweet');
const TwitterClientService = require('./TwitterClientService');
const TweetServcie = require('./TweetService');

class QueueService {
    queue = null
    
    constructor () {
        if (!this.queue) {
            this.queue = kue.createQueue({
                jobEvents: false,
                redis: {
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT
                }
            });

        kue.app.listen(process.env.KUE_DASHBOARD_PORT);

        }
    }

    static getInstance() {
        if (QueueService.instance) {
          return QueueService.instance;
        }
        QueueService.instance = new QueueService();
        return QueueService.instance;
      }

    start() {
        
        this.queue.process('twitter', async (job, done) => {
            
            const {data} = job

            try {
                const result = await TwitterClientService.getTweets(data.keyword, data.since_id || '', data.max_id || '')
                
                const {statuses, search_metadata} = result
                const tweets = statuses.map(item => {
                    const {id_str: tweet_id, text, created_at, user: {id_str: id, name, screen_name}} = item
    
                    return {
                        tweet_id,
                        text,
                        keyword: data.keyword,
                        created_at,
                        user: {
                            id,
                            name,
                            screen_name,
                        }
                    }
                })
    
                await TweetServcie.saveTweets(tweets);
    
                if (search_metadata.next_results) {
                    this.createJob('twitter', {
                        keyword: data.keyword,
                        since_id: search_metadata.next_results.since_id,
                        max_id: search_metadata.next_results.match(/\?max_id=([0-9]+)/)[1]
                    })
                }
    
                done();
            } catch(e) {
                console.log(e);
            }
        })

        console.log('Queue worker started!');
    }

    async sync() {
        const keywords = await Keyword.find({}).distinct('value');

        const tweetsPromises = keywords.map(item => {
            return Tweet.findOne({keyword: item}).sort({created_at: -1});
        })

        const tweets = await Promise.all(tweetsPromises);
        const notSyncedKeywords = keywords.filter(keyword => tweets.findIndex(item => item && item.keyword === keyword) === -1)
        
        tweets.forEach(item => {
            if (item) {
                this.createJob('twitter', {
                    keyword: item.keyword,
                    sienc_id: item.tweet_id
                })
            }
        })

        notSyncedKeywords.map(item => {
            this.createJob('twitter', {
                keyword: item
            })
        })
        
        return tweets
    }

    createJob (name, data, priority = 'high') {
        this.queue.create(name, data)
        .priority(priority)
        .delay(5000)
        .save()
    }
}

module.exports = QueueService