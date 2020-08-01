'use strict'

const Keyword = require('../models/Keyword');

class KeywordService {
    static async getAll() {
        return Keyword.find({})
    }

    static async create(value) {
        return Keyword.create({value})
    }
}

module.exports = KeywordService