import React from 'react';
import { AdminCard } from '../ui/AdminCard';
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react';

export function StatCardsWidget({ stats }) {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Revenue',
      value: formatMoney(stats?.total_revenue || 0),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Active Orders',
      value: stats?.total_orders || 0,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Products',
      value: stats?.active_products || 0,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Customers',
      value: stats?.total_customers || 0,
      icon: Users,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <AdminCard key={index} className="!p-0">
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                <h4 className="text-2xl font-bold text-gray-900">{card.value}</h4>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${card.bgColor}`}>
                <Icon className={card.color} size={24} />
              </div>
            </div>
          </AdminCard>
        );
      })}
    </div>
  );
}
