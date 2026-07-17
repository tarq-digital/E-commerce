const AddressRepository = require('../repositories/address.repository');
const ApiError = require('../../../utils/api-error');
const httpStatus = require('../../../constants/http-status');

class AddressService {
  async getAddresses(userId) {
    if (!userId) throw new ApiError(httpStatus.UNAUTHORIZED, 'User must be logged in to view addresses');
    return await AddressRepository.findByUserId(userId);
  }

  async getAddressById(id, userId) {
    const address = await AddressRepository.findById(id, userId);
    if (!address) throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
    return address;
  }

  async addAddress(userId, data) {
    this.validateAddressData(data);
    
    // Check if this is the first address, if so make it default
    const existing = await AddressRepository.findByUserId(userId);
    if (existing.length === 0) {
      data.is_default = true;
    }

    if (data.is_default) {
      await AddressRepository.removeDefaultFlags(userId);
    }

    const addressId = await AddressRepository.create({ ...data, user_id: userId });
    return await AddressRepository.findById(addressId, userId);
  }

  async updateAddress(id, userId, data) {
    this.validateAddressData(data);
    
    const existing = await AddressRepository.findById(id, userId);
    if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');

    if (data.is_default && !existing.is_default) {
      await AddressRepository.removeDefaultFlags(userId);
    }

    await AddressRepository.update(id, userId, data);
    return await AddressRepository.findById(id, userId);
  }

  async deleteAddress(id, userId) {
    const existing = await AddressRepository.findById(id, userId);
    if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');

    await AddressRepository.delete(id, userId);

    // If we deleted the default, set another one as default
    if (existing.is_default) {
      const remaining = await AddressRepository.findByUserId(userId);
      if (remaining.length > 0) {
        await AddressRepository.update(remaining[0].id, userId, { ...remaining[0], is_default: true });
      }
    }
    return { id };
  }

  validateAddressData(data) {
    const { first_name, last_name, phone, address_line1, city, state, pincode } = data;
    
    if (!first_name || first_name.length < 2) throw new ApiError(httpStatus.BAD_REQUEST, 'Valid first name is required');
    if (!last_name || last_name.length < 2) throw new ApiError(httpStatus.BAD_REQUEST, 'Valid last name is required');
    
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phone || !phoneRegex.test(phone)) throw new ApiError(httpStatus.BAD_REQUEST, 'Valid phone number is required (10-15 digits)');
    
    if (data.email) {
      const emailRegex = /^[\w.\-]+@([\w\-]+\.)+[\w\-]{2,4}$/;
      if (!emailRegex.test(data.email)) throw new ApiError(httpStatus.BAD_REQUEST, 'Valid email is required');
    }

    if (!address_line1 || address_line1.length < 5) throw new ApiError(httpStatus.BAD_REQUEST, 'Address Line 1 must be at least 5 characters');
    if (!city || city.length < 2) throw new ApiError(httpStatus.BAD_REQUEST, 'Valid city is required');
    if (!state || state.length < 2) throw new ApiError(httpStatus.BAD_REQUEST, 'Valid state is required');
    
    const pinRegex = /^[0-9a-zA-Z\s\-]{4,10}$/; // Generic pincode validation for international support
    if (!pincode || !pinRegex.test(pincode)) throw new ApiError(httpStatus.BAD_REQUEST, 'Valid pincode is required');
  }
}

module.exports = new AddressService();
