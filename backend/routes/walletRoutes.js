const express = require('express');
const walletController = require('../controllers/walletController');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router.get('/', walletController.listWallets);
router.get('/:address/transactions', transactionController.listWalletTransactions);

module.exports = router;
