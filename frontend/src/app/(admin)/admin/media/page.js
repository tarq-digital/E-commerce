'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getCookie } from 'cookies-next';
import { Image as ImageIcon, Upload, Trash2, FolderOpen, MoreVertical, Copy, ShieldAlert } from 'lucide-react';
import { AdminCard } from '../../../../components/admin/ui/AdminCard';
import { AdminButton } from '../../../../components/admin/ui/AdminButton';

export default function MediaDashboard() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/media/assets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setAssets(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch media assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/media/assets/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const json = await res.json();
      if (json.success) {
        setAssets(prev => [json.data, ...prev]);
      } else {
        alert(json.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset? It may break images on the storefront if in use.")) return;
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/media/assets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAssets(prev => prev.filter(a => a.id !== id));
      } else {
        alert('Failed to delete asset');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="text-primary" size={24} /> Enterprise Media Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage, upload, and organize assets securely synchronized with Cloudinary.</p>
        </div>
        <div className="flex items-center gap-3">
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileUpload} 
             className="hidden"
             accept="image/jpeg, image/png, image/webp, image/gif, application/pdf"
           />
           <AdminButton onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center gap-2">
             {isUploading ? 'Uploading stream...' : <><Upload size={16} /> Upload Asset</>}
           </AdminButton>
        </div>
      </div>

      <AdminCard>
         {isLoading ? (
            <div className="p-12 text-center text-gray-400">Loading Media Library...</div>
         ) : assets.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
               <FolderOpen size={48} className="mb-4 text-gray-300" />
               <p className="font-medium text-gray-600 mb-1">No media assets found</p>
               <p className="text-sm">Upload images to Cloudinary to see them here.</p>
            </div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
               {assets.map(asset => (
                  <div key={asset.id} className="group relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 hover:border-primary/50 transition-all hover:shadow-md">
                     {/* Image Thumbnail */}
                     <div className="aspect-square w-full bg-gray-100 relative">
                        {asset.mime_type.includes('image') ? (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img 
                              src={asset.secure_url} 
                              alt={asset.filename}
                              className="w-full h-full object-cover"
                           />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-xs">
                              {asset.mime_type.split('/')[1].toUpperCase()}
                           </div>
                        )}
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                           <button 
                             onClick={() => {
                                navigator.clipboard.writeText(asset.secure_url);
                                alert("URL copied to clipboard!");
                             }}
                             className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors"
                             title="Copy URL"
                           >
                              <Copy size={14} />
                           </button>
                           <button 
                             onClick={() => handleDelete(asset.id)}
                             className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                             title="Delete Asset"
                           >
                              <Trash2 size={14} />
                           </button>
                        </div>
                     </div>
                     
                     {/* Metadata */}
                     <div className="p-3 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-900 truncate" title={asset.filename}>{asset.filename}</p>
                        <div className="flex justify-between items-center mt-1">
                           <span className="text-[10px] text-gray-500 font-mono">{(asset.size_bytes / 1024).toFixed(1)} KB</span>
                           <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{asset.mime_type.split('/')[1]}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </AdminCard>
    </div>
  );
}
