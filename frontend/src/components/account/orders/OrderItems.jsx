import Link from 'next/link';

export function OrderItems({ items, currency = 'INR' }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="divide-y">
      {items.map((item) => {
        const itemTotal = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: currency
        }).format(item.price * item.quantity);

        const itemPrice = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: currency
        }).format(item.price);

        return (
          <div key={item.id} className="py-4 flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
              {/* In a real app, use next/image. Placeholder for now */}
              <div className="w-full h-full bg-gray-200"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <Link 
                href={`/product/${item.product_slug || '#'}`} 
                className="font-medium text-gray-900 hover:text-primary line-clamp-2"
              >
                {item.product_name}
              </Link>
              
              <div className="text-sm text-gray-500 mt-1">
                {item.variant_name && <p>Variant: {item.variant_name}</p>}
                <p>Qty: {item.quantity} x {itemPrice}</p>
              </div>
            </div>

            <div className="text-right font-medium text-gray-900 shrink-0 pl-4">
              {itemTotal}
            </div>
          </div>
        );
      })}
    </div>
  );
}
