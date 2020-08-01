const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
    tweet_id: {type: String, required: true},
    text: {type: String, required: true},
    keyword: {type: String, required: true},
    user: {
        id: {type: String, required: true},
        name: {type: String},
        screen_name: {type: String},
    },
    created_at: {type: Date, required: true},
});

module.exports = mongoose.model('Tweet', TweetSchema, 'tweets');
