import React from 'react';
import { AdminCard } from '../ui/AdminCard';
import { Activity, User, ShoppingBag, Edit, Trash2 } from 'lucide-react';

export function ActivityFeedWidget({ activities = [] }) {
  const getIcon = (action) => {
    if (action.includes('LOGIN')) return User;
    if (action.includes('ORDER')) return ShoppingBag;
    if (action.includes('UPDATE') || action.includes('EDIT')) return Edit;
    if (action.includes('DELETE')) return Trash2;
    return Activity;
  };

  const getColor = (action) => {
    if (action.includes('LOGIN')) return 'bg-blue-100 text-blue-600';
    if (action.includes('ORDER')) return 'bg-emerald-100 text-emerald-600';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-600';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <AdminCard title="Recent Activity" className="h-full">
      <div className="space-y-6">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const Icon = getIcon(activity.action);
            const colorClass = getColor(activity.action);
            const isLast = index === activities.length - 1;

            return (
              <div key={activity.id} className="relative flex gap-4">
                {!isLast && (
                  <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-gray-200"></div>
                )}
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${colorClass}`}>
                  <Icon size={14} />
                </div>
                
                <div className="flex-1 pb-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">
                      {activity.first_name ? `${activity.first_name} ${activity.last_name}` : 'System'}
                    </span>
                    {' '}performed <span className="font-medium text-primary">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.created_at).toLocaleString('en-IN', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            No recent activity found.
          </div>
        )}
      </div>
    </AdminCard>
  );
}
