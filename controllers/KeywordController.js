'use strict'

const KeywordServcie = require('../services/KeywordService');
const QueueService = require('../services/QueueService');

const index = async (req, res) => {
    try {
        const keywords = await KeywordServcie.getAll(); 

        return res.send(keywords);
    } catch(e) {
        //log error
        res.status(500).send({
            message: 'Something went wrong, please try again.'
        });
    }
}

const create = async (req, res) => {
    const {keyword} = req.body;

    //validation :)
    if (!keyword) {
        return res.status(422).send({
            message: 'Validation failed.',
            errors: ['Keyword is required']
        });
    }
    
    const queue = QueueService.getInstance()
    queue.createJob('twitter', {
        keyword
    })
    
    try {
        await KeywordServcie.create(keyword);

        return res.status(201).send({message: 'Created.'});
    } catch(e) {
        //log error
        console.log(e);
        res.status(500).send({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports = {
    index,
    create
};

