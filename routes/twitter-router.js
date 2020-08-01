'use strict'

const express = require('express');
const router = express.Router();

const TwitterController = require('../controllers/TwitterController');

router.get('/', TwitterController.index);
router.get('/sync', TwitterController.sync);

module.exports = router;