const { sendSuccess } = require('../../../utils/response');
const httpStatus = require('../../../constants/http-status');
const catchAsync = require('../../../utils/catch-async');
const AddressService = require('../../../modules/address/services/address.service');

const getAddresses = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const addresses = await AddressService.getAddresses(userId);
  
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Addresses retrieved successfully',
    data: { addresses },
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const getAddressById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const address = await AddressService.getAddressById(id, userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Address retrieved successfully',
    data: { address },
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const addAddress = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const address = await AddressService.addAddress(userId, req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Address added successfully',
    data: { address },
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const updateAddress = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const address = await AddressService.updateAddress(id, userId, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Address updated successfully',
    data: { address },
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

const deleteAddress = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  await AddressService.deleteAddress(id, userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Address deleted successfully',
    data: { id },
    meta: {},
    errors: null,
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  getAddresses,
  getAddressById,
  addAddress,
  updateAddress,
  deleteAddress
};
