export function OrderSummary({ order }) {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: order.currency || 'INR'
    }).format(amount);
  };

  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{formatMoney(order.subtotal)}</span>
      </div>
      
      {Number(order.discount_total) > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-{formatMoney(order.discount_total)}</span>
        </div>
      )}
      
      {Number(order.tax_total) > 0 && (
        <div className="flex justify-between text-gray-600">
          <span>Taxes</span>
          <span>{formatMoney(order.tax_total)}</span>
        </div>
      )}
      
      <div className="flex justify-between text-gray-600">
        <span>Shipping</span>
        <span>
          {Number(order.shipping_total) === 0 
            ? <span className="text-green-600 uppercase text-xs font-bold tracking-wider">Free</span> 
            : formatMoney(order.shipping_total)
          }
        </span>
      </div>
      
      <div className="border-t pt-3 mt-3 flex justify-between font-bold text-gray-900 text-base">
        <span>Grand Total</span>
        <span>{formatMoney(order.grand_total)}</span>
      </div>

      <div className="mt-4 pt-4 border-t border-dashed">
        <p className="text-gray-500 mb-1">Payment Method</p>
        <p className="font-medium">Razorpay (Online)</p>
      </div>
    </div>
  );
}
