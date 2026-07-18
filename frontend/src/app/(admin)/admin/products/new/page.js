'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';

import { AdminCard } from '../../../../../components/admin/ui/AdminCard';
import { AdminInput } from '../../../../../components/admin/ui/AdminInput';
import { AdminSelect } from '../../../../../components/admin/ui/AdminSelect';
import { AdminButton } from '../../../../../components/admin/ui/AdminButton';
import { MediaUploader } from '../../../../../components/admin/catalog/MediaUploader';
import { SeoPanel } from '../../../../../components/admin/catalog/SeoPanel';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    sku: '',
    base_price: '',
    initial_stock: '',
    low_stock_threshold: '10',
    status: 'DRAFT',
    visibility: 'VISIBLE',
    seo_title: '',
    seo_description: '',
    slug: ''
  });
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSeoChange = (newSeoData) => {
    setFormData(prev => ({ ...prev, ...newSeoData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = getCookie('token');
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append files (staged in memory)
      files.forEach(f => {
        formDataToSend.append('images', f.file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type, let the browser set it with the boundary for FormData
        },
        body: formDataToSend
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/products');
      } else {
        alert(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <button type="button" className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Product</h1>
        </div>
        <div className="flex items-center gap-3">
          <AdminButton type="button" variant="secondary" icon={<Eye size={16} />}>
            Preview
          </AdminButton>
          <AdminButton type="submit" isLoading={isLoading} icon={<Save size={16} />}>
            Save Product
          </AdminButton>
        </div>
      </div>

      {/* Main Grid: Scrolling Content + Sticky Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column - Main Details */}
        <div className="flex-1 w-full space-y-8">
          
          <AdminCard title="Basic Information">
            <div className="space-y-4">
              <AdminInput 
                label="Product Name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Hatsune Miku 1/7 Scale Figure"
                required
              />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Detailed product description..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Short Description</label>
                <textarea 
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Appears on cards and lists..."
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Media">
            <MediaUploader files={files} onChange={setFiles} />
          </AdminCard>

          <AdminCard title="Pricing & Inventory">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput 
                label="Base Price (₹)" 
                type="number"
                name="base_price"
                value={formData.base_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
              <AdminInput 
                label="SKU (Stock Keeping Unit)" 
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
              />
              <AdminInput 
                label="Initial Stock" 
                type="number"
                name="initial_stock"
                value={formData.initial_stock}
                onChange={handleChange}
                min="0"
                required
              />
              <AdminInput 
                label="Low Stock Threshold" 
                type="number"
                name="low_stock_threshold"
                value={formData.low_stock_threshold}
                onChange={handleChange}
                min="0"
              />
            </div>
          </AdminCard>

          <AdminCard title="Search Engine Optimization">
            <SeoPanel data={formData} onChange={handleSeoChange} />
          </AdminCard>

        </div>

        {/* Right Column - Sticky Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-8 lg:sticky lg:top-24">
          
          <AdminCard title="Product Status">
            <div className="space-y-4">
              <AdminSelect 
                label="Lifecycle Stage"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { label: 'Draft', value: 'DRAFT' },
                  { label: 'Ready for Review', value: 'READY_FOR_REVIEW' },
                  { label: 'Published', value: 'PUBLISHED' },
                  { label: 'Archived', value: 'ARCHIVED' }
                ]}
              />
              <AdminSelect 
                label="Visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                options={[
                  { label: 'Visible to public', value: 'VISIBLE' },
                  { label: 'Hidden from store', value: 'HIDDEN' }
                ]}
              />
            </div>
          </AdminCard>

          <AdminCard title="Organization">
            <div className="space-y-4">
              <AdminSelect 
                label="Category"
                name="category_id"
                value={formData.category_id || ''}
                onChange={handleChange}
                options={[
                  { label: 'Select a category...', value: '' },
                  // To be populated dynamically from categories API
                ]}
              />
              <AdminSelect 
                label="Brand"
                name="brand_id"
                value={formData.brand_id || ''}
                onChange={handleChange}
                options={[
                  { label: 'Select a brand...', value: '' },
                  // To be populated dynamically from brands API
                ]}
              />
            </div>
          </AdminCard>

        </div>
      </div>
    </form>
  );
}
