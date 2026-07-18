const { z } = require('zod');

const addressSchema = z.object({
  phone: z.string().min(10, 'Phone is required'),
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
});

const initiateCheckoutSchema = z.object({
  body: z.object({
    shipping_address: addressSchema,
    billing_address: addressSchema.optional(),
    payment_method: z.string().optional(),
    notes: z.string().optional()
  })
});

module.exports = {
  initiateCheckoutSchema
};
