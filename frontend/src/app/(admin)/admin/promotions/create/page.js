'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { ArrowLeft, Save, Percent, IndianRupee, Tag, Clock } from 'lucide-react';
import { AdminCard } from '../../../../../components/admin/ui/AdminCard';
import { AdminInput } from '../../../../../components/admin/ui/AdminInput';
import { AdminButton } from '../../../../../components/admin/ui/AdminButton';

export default function CreatePromotionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_automatic: true,
    coupon_code: '',
    type: 'PERCENTAGE',
    discount_value: '',
    target_type: 'STORE',
    min_cart_value: 0,
    usage_limit: '',
    start_date: '',
    end_date: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const token = getCookie('token');
      
      const payload = {
          ...formData,
          discount_value: Number(formData.discount_value),
          min_cart_value: Number(formData.min_cart_value),
          usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
          start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
          end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      };

      if (payload.is_automatic) {
          payload.coupon_code = '';
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/promotions`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        router.push('/admin/promotions');
      } else {
        setError(data.message || 'Failed to create promotion');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      
      <div className="flex items-center gap-4">
        <Link href="/admin/promotions">
          <button className="p-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Promotion Rule</h1>
          <p className="text-gray-500 text-sm mt-1">Configure pricing engine rules, discounts, or coupons.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Rule Definition">
            <div className="space-y-4">
              <AdminInput 
                label="Promotion Name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Summer Sale 2026"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Internal)</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                  rows="2"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Method</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="is_automatic" checked={formData.is_automatic === true} onChange={() => setFormData(prev => ({...prev, is_automatic: true}))} className="accent-primary" />
                      Automatic Discount
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="is_automatic" checked={formData.is_automatic === false} onChange={() => setFormData(prev => ({...prev, is_automatic: false}))} className="accent-primary" />
                      Coupon Code
                    </label>
                  </div>
                </div>
                
                {!formData.is_automatic && (
                  <AdminInput 
                    label="Coupon Code" 
                    name="coupon_code"
                    value={formData.coupon_code}
                    onChange={handleChange}
                    placeholder="e.g. SUMMER50"
                    required={!formData.is_automatic}
                  />
                )}
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Discount Configuration">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>
              <AdminInput 
                label="Discount Value" 
                type="number"
                name="discount_value"
                value={formData.discount_value}
                onChange={handleChange}
                placeholder={formData.type === 'PERCENTAGE' ? 'e.g. 15' : 'e.g. 500'}
                min="0"
                step="0.01"
                required
              />
            </div>
          </AdminCard>
          
          <AdminCard title="Requirements & Constraints">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AdminInput 
                label="Minimum Cart Value (₹)" 
                type="number"
                name="min_cart_value"
                value={formData.min_cart_value}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
              {!formData.is_automatic && (
                <AdminInput 
                  label="Total Usage Limit" 
                  type="number"
                  name="usage_limit"
                  value={formData.usage_limit}
                  onChange={handleChange}
                  placeholder="Unlimited"
                  min="1"
                />
              )}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Scheduling">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  type="datetime-local" 
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1"><Clock size={12}/> Leave empty to start immediately</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input 
                  type="datetime-local" 
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1"><Clock size={12}/> Leave empty to run indefinitely</p>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Target Application">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apply To</label>
                <select 
                  name="target_type"
                  value={formData.target_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="STORE">Entire Store (Cart Level)</option>
                  <option value="CATEGORY" disabled>Specific Category (Coming Soon)</option>
                  <option value="PRODUCT" disabled>Specific Product (Coming Soon)</option>
                </select>
              </div>
            </div>
          </AdminCard>

          <div className="pt-4 flex justify-end">
             <AdminButton type="submit" disabled={isSubmitting} className="w-full flex justify-center gap-2">
                <Save size={18} />
                {isSubmitting ? 'Saving...' : 'Save Promotion Rule'}
             </AdminButton>
          </div>
        </div>

      </form>
    </div>
  );
}
