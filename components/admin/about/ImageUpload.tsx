'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, Image as ImageIcon, Loader2, Edit3, Trash2, ExternalLink, AlertCircle } from 'lucide-react';
import { normalizeImageUrl } from '@/lib/imageUtils';
import { uploadFile, validateFile } from '@/lib/uploadUtils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'auto' | 'hero';
  maxSize?: number;
  alt?: string;
  onAltChange?: (alt: string) => void;
  showAltField?: boolean;
}

export function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  placeholder = "Upload an image...",
  aspectRatio = 'auto',
  maxSize = 10,
  alt = '',
  onAltChange,
  showAltField = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    hero: 'aspect-[16/9]',
    auto: ''
  };

  const handleFileUpload = async (file: File) => {
    // Validate
    const validation = validateFile(file, {
      maxSize,
      allowedTypes: ['image/'],
    });

    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      setTimeout(() => setError(null), 5000);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const result = await uploadFile(file, (progress) => {
        setUploadProgress(progress.percentage);
      });

      onChange(result.url);

      if (!alt && onAltChange) {
        const filename = file.name.split('.')[0];
        onAltChange(filename.replace(/[-_]/g, ' '));
      }
      
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleRemove = () => {
    onRemove ? onRemove() : onChange('');
    setError(null);
  };

  if (value) {
    return (
      <div className="space-y-3">
        <div className="relative group">
          <div className={`relative overflow-hidden rounded-lg border-2 border-neutral-200 dark:border-neutral-700 ${aspectRatioClasses[aspectRatio]} min-h-[200px]`}>
            <img
              src={normalizeImageUrl(value)}
              alt={alt || "Uploaded image"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.png';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/90 hover:bg-white text-neutral-900"
                  type="button"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Replace
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleRemove}
                  className="bg-red-500/90 hover:bg-red-500 text-white"
                  type="button"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
            
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              <a 
                href={normalizeImageUrl(value)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary-300"
              >
                <ExternalLink className="w-3 h-3" />
                View
              </a>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {showAltField && onAltChange && (
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => onAltChange(e.target.value)}
              placeholder="Describe this image..."
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          dragOver 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400'
        } ${aspectRatioClasses[aspectRatio]} min-h-[200px]`}
      >
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          {isUploading ? (
            <div className="space-y-4 w-full max-w-xs">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Uploading...
                </p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-linear-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                  {uploadProgress}%
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                <ImageIcon className="w-8 h-8 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {placeholder}
                </p>
                <p className="text-xs text-neutral-500">
                  Max: {maxSize}MB • JPG, PNG, WebP, GIF
                </p>
              </div>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
              >
                <Upload className="w-3 h-3 mr-1" />
                Choose File
              </Button>
              <p className="text-xs text-neutral-500">or drag and drop</p>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
