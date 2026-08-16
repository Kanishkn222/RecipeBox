import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, FileImage, AlertCircle } from 'lucide-react';

const ImageUploadZone = ({ onFileSelect }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');

    // Handle rejections (size limit or format faults)
    if (rejectedFiles && rejectedFiles.length > 0) {
      const reject = rejectedFiles[0];
      if (reject.errors[0]?.code === 'file-too-large') {
        setError('File is too large. Maximum allowed size is 5MB.');
      } else {
        setError('Invalid file type. Only JPEG, PNG, and WEBP formats are allowed.');
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Save file and generate instant local preview URL
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
      
      // Emit file select callback
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB limit
    multiple: false,
  });

  const clearSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Revoke object URL to prevent memory leaks
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
    onFileSelect(null);
  };

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <div className="w-full">
      {filePreview ? (
        // Thumbnail preview container
        <div className="relative w-full h-64 rounded-2xl border border-brand-200 overflow-hidden bg-slate-50 shadow-sm">
          <img
            src={filePreview}
            alt="Upload Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={clearSelection}
            className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-premium backdrop-blur-sm"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Dropzone area
        <div
          {...getRootProps()}
          className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center transition-premium cursor-pointer ${
            isDragActive
              ? 'border-brand-500 bg-brand-50/50 text-brand-500 scale-[0.99]'
              : 'border-slate-300 hover:border-brand-500 bg-white text-slate-500 hover:bg-brand-50/20'
          }`}
        >
          <input {...getInputProps()} />
          <div className="p-4 rounded-full bg-brand-50 text-brand-500 mb-4 group-hover:scale-105 transition-premium">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="font-display font-semibold text-slate-800 mb-1">
            {isDragActive ? 'Drop your recipe image here' : 'Drag & drop your recipe image'}
          </p>
          <p className="text-xs text-slate-400 mb-4">
            Supports JPEG, PNG, or WEBP (Max 5MB)
          </p>
          <span className="px-4 py-2 bg-slate-50 text-slate-700 hover:bg-brand-500 hover:text-white rounded-xl text-xs font-semibold border border-slate-200 transition-premium shadow-sm">
            Browse Files
          </span>
        </div>
      )}

      {/* Validation Error Notice */}
      {error && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-500 font-semibold bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploadZone;
