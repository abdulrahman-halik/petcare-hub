const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    getAccountSummary,
    listAccounts,
    getAccount,
    createAccount,
    updateAccount,
    updateAccountStatus,
    deleteAccount
} = require('../controllers/adminAccountController');

router.use(protect, authorize('admin'));

router.get('/summary', getAccountSummary);
router.route('/:accountType')
    .get(listAccounts)
    .post(createAccount);
router.get('/:accountType/:id', getAccount);
router.put('/:accountType/:id', updateAccount);
router.patch('/:accountType/:id/status', updateAccountStatus);
router.delete('/:accountType/:id', deleteAccount);

module.exports = router;
