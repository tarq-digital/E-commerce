import React, { useState, useRef } from 'react';
import { UploadCloud, X, GripVertical, Star } from 'lucide-react';
import Image from 'next/image';

export function MediaUploader({ files = [], onChange }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    // Only accept images
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    // Create preview URLs
    const filesWithPreviews = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
      isPrimary: files.length === 0, // First one is primary by default
    }));

    onChange([...files, ...filesWithPreviews]);
  };

  const removeFile = (idToRemove) => {
    const updatedFiles = files.filter(f => f.id !== idToRemove);
    // If we removed the primary, make the first remaining one primary
    if (files.find(f => f.id === idToRemove)?.isPrimary && updatedFiles.length > 0) {
      updatedFiles[0].isPrimary = true;
    }
    onChange(updatedFiles);
  };

  const setPrimary = (idToPrimary) => {
    const updatedFiles = files.map(f => ({
      ...f,
      isPrimary: f.id === idToPrimary
    }));
    onChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-primary">
          <UploadCloud size={24} />
        </div>
        <p className="font-semibold text-gray-900 mb-1">Click to upload or drag and drop</p>
        <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 10MB)</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={file.id} className="relative group rounded-lg border border-gray-200 overflow-hidden bg-white aspect-square">
              <Image src={file.url} alt="Preview" fill className="object-cover" />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPrimary(file.id); }}
                    className={`p-1.5 rounded-md ${file.isPrimary ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:text-primary'}`}
                    title="Set as Cover"
                  >
                    <Star size={14} className={file.isPrimary ? "fill-current" : ""} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                    className="p-1.5 rounded-md bg-white text-red-600 hover:bg-red-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Cover Badge */}
              {file.isPrimary && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[10px] font-bold uppercase py-1 text-center backdrop-blur-sm">
                  Cover Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
