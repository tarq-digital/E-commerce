'use client';

import { useMemo } from 'react';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';

export function OrderTimeline({ timeline, currentStatus }) {
  // Sort timeline chronologically (earliest first)
  const sortedTimeline = useMemo(() => {
    return [...timeline].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [timeline]);

  // Standard forward progression
  const standardSteps = [
    { key: 'CONFIRMED', label: 'Order Confirmed' },
    { key: 'PACKED', label: 'Packed' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' }
  ];

  // If order is cancelled, we modify the stepper
  const isCancelled = currentStatus === 'CANCELLED';

  const stepsToRender = useMemo(() => {
    if (isCancelled) {
      // Find where it was cancelled
      const cancelEvent = sortedTimeline.find(t => t.status === 'CANCELLED');
      const timeOfCancel = cancelEvent ? new Date(cancelEvent.created_at) : new Date();
      return [
        { key: 'CONFIRMED', label: 'Order Confirmed', completed: true, timestamp: sortedTimeline.find(t => t.status === 'PAID')?.created_at },
        { key: 'CANCELLED', label: 'Order Cancelled', completed: true, isError: true, timestamp: timeOfCancel }
      ];
    }

    return standardSteps.map((step) => {
      // Find if this step exists in timeline
      const event = sortedTimeline.find(t => t.status === step.key);
      // It's also completed if the current status is ahead of it
      const currentIndex = standardSteps.findIndex(s => s.key === currentStatus);
      const stepIndex = standardSteps.findIndex(s => s.key === step.key);
      const isCompleted = !!event || (currentIndex !== -1 && currentIndex >= stepIndex);
      
      return {
        ...step,
        completed: isCompleted,
        timestamp: event?.created_at
      };
    });
  }, [sortedTimeline, currentStatus, isCancelled]);

  return (
    <div className="py-4">
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-200"></div>

        <div className="space-y-8 relative z-10">
          {stepsToRender.map((step, index) => {
            const Icon = step.completed 
              ? (step.isError ? XCircle : CheckCircle2) 
              : Circle;
            
            return (
              <div key={step.key} className="flex items-start gap-4">
                <div className="bg-white rounded-full">
                  <Icon 
                    size={32} 
                    className={
                      step.completed 
                        ? (step.isError ? 'text-red-500' : 'text-green-500') 
                        : 'text-gray-300'
                    } 
                    fill="white"
                  />
                </div>
                <div className="pt-1">
                  <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.label}
                  </h4>
                  {step.timestamp && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(step.timestamp).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
