const express = require('express');
const router = express.Router();

const path = require('path');
require('dotenv').config("../..");

router.use(express.json());
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../public/index/index.html')) });


module.exports = router;