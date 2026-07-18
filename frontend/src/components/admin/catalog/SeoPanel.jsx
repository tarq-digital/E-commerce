import React from 'react';
import { AdminInput } from '../ui/AdminInput';

export function SeoPanel({ data, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  // Google Search Preview
  const siteUrl = 'https://weebster.in';
  const previewTitle = data.seo_title || data.name || 'Product Title';
  const previewDesc = data.seo_description || data.short_description || 'Product description will appear here in search results. Make it catchy and relevant.';
  const previewSlug = data.slug || 'product-slug';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <AdminInput
          label="Meta Title"
          name="seo_title"
          value={data.seo_title || ''}
          onChange={handleChange}
          placeholder="e.g., Buy Weebster Exclusive Anime Figures"
          helperText={`${data.seo_title?.length || 0} / 60 characters`}
        />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Meta Description</label>
          <textarea
            name="seo_description"
            value={data.seo_description || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="e.g., Get the latest anime merchandise..."
          />
          <span className="text-xs text-gray-500">
            {data.seo_description?.length || 0} / 160 characters
          </span>
        </div>

        <AdminInput
          label="URL Slug"
          name="slug"
          value={data.slug || ''}
          onChange={handleChange}
          placeholder="leave-blank-to-auto-generate"
          helperText="Unique identifier for the URL. Will be auto-generated if left blank."
        />
      </div>

      {/* SEO Preview Placeholder */}
      <div className="mt-6 border-t border-gray-100 pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Search Engine Preview</h4>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 font-sans max-w-xl">
          <div className="text-sm text-[#202124] truncate flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold">W</div>
            <div className="flex flex-col leading-tight">
              <span>Weebster</span>
              <span className="text-xs text-gray-500 truncate">{siteUrl}/products/{previewSlug}</span>
            </div>
          </div>
          <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate mb-1">
            {previewTitle}
          </div>
          <div className="text-sm text-[#4d5156] line-clamp-2 leading-snug">
            {previewDesc}
          </div>
        </div>
      </div>
    </div>
  );
}
