'use client';

import React, { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { Settings, Save, Shield, CheckCircle, Search, Sliders } from 'lucide-react';
import { AdminCard } from '../../../../components/admin/ui/AdminCard';
import { AdminButton } from '../../../../components/admin/ui/AdminButton';

export default function SettingsDashboard() {
  const [settings, setSettings] = useState({});
  const [activeGroup, setActiveGroup] = useState('GENERAL');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setSettings(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (group, key, value) => {
    setPendingChanges(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (Object.keys(pendingChanges).length === 0) return;
    setIsSaving(true);
    try {
      const token = getCookie('token');
      const updates = Object.entries(pendingChanges).map(([key, value]) => ({ key, value }));
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ updates })
      });
      
      if (res.ok) {
        setPendingChanges({});
        await fetchSettings();
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Configurations...</div>;
  }

  const groups = [
    { id: 'GENERAL', label: 'General' },
    { id: 'BRANDING', label: 'Branding' },
    { id: 'TAX', label: 'Tax' },
    { id: 'SHIPPING', label: 'Shipping' },
    { id: 'PAYMENT', label: 'Payment' },
    { id: 'EMAIL', label: 'Email (SMTP)' },
    { id: 'LEGAL', label: 'Legal' },
    { id: 'SYSTEM', label: 'System' }
  ];

  const activeSettings = settings[activeGroup] || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Settings className="text-primary" size={24} /> Enterprise Store Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage global configurations. Changes are versioned and audited.</p>
        </div>
        <div className="flex items-center gap-3">
           {Object.keys(pendingChanges).length > 0 && (
              <span className="text-sm font-medium text-amber-600 flex items-center gap-1">
                 <Shield size={16} /> Unsaved changes
              </span>
           )}
           <AdminButton onClick={handleSave} disabled={isSaving || Object.keys(pendingChanges).length === 0} className="flex items-center gap-2">
             {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
           </AdminButton>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
         
         {/* Sidebar Navigation */}
         <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 border-r border-gray-200 pr-4">
            {groups.map(group => (
               <button
                 key={group.id}
                 onClick={() => setActiveGroup(group.id)}
                 className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                   activeGroup === group.id 
                     ? 'bg-primary/10 text-primary' 
                     : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                 }`}
               >
                  <Sliders size={16} className={activeGroup === group.id ? 'text-primary' : 'text-gray-400'} />
                  {group.label}
               </button>
            ))}
         </div>

         {/* Settings Editor */}
         <div className="flex-1 w-full">
            <AdminCard>
               <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">{groups.find(g => g.id === activeGroup)?.label} Configuration</h3>
               
               {Object.keys(activeSettings).length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-sm">
                     No settings found in this group yet.
                  </div>
               ) : (
                  <div className="space-y-6">
                     {Object.entries(activeSettings).map(([key, value]) => {
                        const isSecret = key.endsWith('_SECRET') || key.endsWith('_PASSWORD');
                        const displayValue = pendingChanges[key] !== undefined ? pendingChanges[key] : value;
                        
                        return (
                           <div key={key} className="flex flex-col gap-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                 {key.replace(/_/g, ' ')}
                                 {isSecret && <Shield size={14} className="text-amber-500" title="Encrypted at rest" />}
                              </label>
                              
                              {typeof value === 'boolean' ? (
                                 <select
                                    value={displayValue}
                                    onChange={(e) => handleInputChange(activeGroup, key, e.target.value === 'true')}
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none max-w-md"
                                 >
                                    <option value="true">Enabled</option>
                                    <option value="false">Disabled</option>
                                 </select>
                              ) : (
                                 <input
                                    type={isSecret ? "password" : "text"}
                                    value={displayValue || ''}
                                    onChange={(e) => handleInputChange(activeGroup, key, e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none w-full max-w-xl"
                                    placeholder={isSecret ? "********" : `Enter ${key.toLowerCase()}`}
                                 />
                              )}
                           </div>
                        );
                     })}
                  </div>
               )}
            </AdminCard>
         </div>

      </div>
    </div>
  );
}
