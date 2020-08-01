const mongoose = require('mongoose');

const KeywordSchema = new mongoose.Schema({
    value: {type: String, required: true, unique: true},
});

module.exports = mongoose.model('Keyword', KeywordSchema, 'keywords');
