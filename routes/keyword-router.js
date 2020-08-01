'use strict'

const express = require('express');
const router = express.Router();

const KeywordController = require('../controllers/KeywordController');

router.get('/', KeywordController.index);
router.post('/', KeywordController.create);

module.exports = router;