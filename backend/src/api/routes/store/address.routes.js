const express = require('express');
const addressController = require('../../controllers/store/address.controller');
const { requireAuth } = require('../../../middlewares/auth.middleware');

const router = express.Router();

// All address routes require the user to be logged in
router.use(requireAuth);

router.get('/', addressController.getAddresses);
router.post('/', addressController.addAddress);
router.get('/:id', addressController.getAddressById);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
