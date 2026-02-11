const express = require('express');
const walletController = require('../controllers/walletController');

const router = express.Router();

router.get('/', walletController.listWallets);

module.exports = router;
