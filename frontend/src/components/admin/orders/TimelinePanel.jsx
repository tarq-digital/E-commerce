import React, { useState } from 'react';
import { AdminButton } from '../ui/AdminButton';
import { Send, Clock } from 'lucide-react';

export function TimelinePanel({ events = [], onAddNote }) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setIsSubmitting(true);
    await onAddNote(note);
    setNote('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex-1">
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add an internal note..."
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[80px]"
          />
        </div>
        <AdminButton type="submit" isLoading={isSubmitting} icon={<Send size={16} />}>
          Add
        </AdminButton>
      </form>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        {events.map((event, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Timeline Dot */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Clock size={12} />
            </div>
            
            {/* Event Card */}
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-gray-900 text-sm">
                  {event.status ? event.status.replace(/_/g, ' ') : 'NOTE'}
                </div>
                <time className="text-xs text-gray-500">
                  {new Date(event.created_at).toLocaleString()}
                </time>
              </div>
              {event.notes && (
                <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {event.notes}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-2 text-right">
                By {event.created_by_type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
