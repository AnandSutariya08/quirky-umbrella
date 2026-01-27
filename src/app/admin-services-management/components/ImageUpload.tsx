'use client';

import { useState, useRef } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import Icon from '@/components/ui/AppIcon';

interface ImageUploadProps {
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
  onImageRemove: () => void;
  folder?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onUploadComplete,
  onImageRemove,
  folder = 'services'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setError('Failed to upload image. Please try again.');
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(downloadURL);
          setIsUploading(false);
        }
      );
    } catch (err) {
      console.error('Error initiating upload:', err);
      setError('Error initiating upload. Please try again.');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return;

    // Optional: If you want to delete from Firebase Storage as well
    // Note: This requires the full storage path which we might not have easily
    // For now, we'll just clear it from the form
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">
        Service Image
      </label>

      {currentImageUrl ? (
        <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-border group">
          <img
            src={currentImageUrl}
            alt="Service Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
              title="Change Image"
            >
              <Icon name="PencilIcon" size={20} />
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-2 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors"
              title="Remove Image"
            >
              <Icon name="TrashIcon" size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-md aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group"
        >
          <div className="p-3 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
            <Icon name="CloudArrowUpIcon" size={24} className="text-muted-foreground group-hover:text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Click to upload image</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
          </div>
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {isUploading && (
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Uploading...</span>
            <span className="text-primary font-medium">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <Icon name="ExclamationCircleIcon" size={16} />
          {error}
        </p>
      )}
    </div>
  );
}