import { OrderList } from '../../../../components/account/orders/OrderList';
import { ErrorState } from '../../../../components/ui/ErrorState/ErrorState';
import { cookies } from 'next/headers';

async function getOrders(searchParams) {
  const query = new URLSearchParams(searchParams).toString();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
  
  const token = cookies().get('access_token')?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${apiUrl}/store/orders?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  } catch (error) {
    console.error('Order Fetch Error:', error);
    return null;
  }
}

export const metadata = {
  title: 'My Orders | Weebster',
  description: 'View your order history'
};

export default async function OrdersPage({ searchParams }) {
  const result = await getOrders(searchParams);

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ErrorState 
          title="Unable to load orders" 
          message="Please ensure you are logged in and try again later."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <OrderList 
        orders={result.data} 
        meta={result.meta}
        searchParams={searchParams}
      />
    </div>
  );
}
