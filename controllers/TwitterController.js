'use strict'

const QueueService = require('../services/QueueService');
const TweetService = require('../services/TweetService');

const index = async (req, res) => {
    const tweets = await TweetService.getAll()
    return res.send(tweets);
}

const sync = async (req, res) => {
    const queue = QueueService.getInstance()

    const result = await queue.sync()
    return res.send({message: 'Started.'})
}

module.exports = {
    index,
    sync,
}


