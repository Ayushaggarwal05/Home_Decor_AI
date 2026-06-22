'use client';

import React from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useRoomStore } from '@/store/roomStore';
import { cn } from '@/lib/utils';

export default function UploadDropzone() {
  const { setUploadFile, setErrorMessage, errorMessage } = useRoomStore();
  const [isDragActive, setIsDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    // Basic file validations
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Unsupported file format. Please upload a valid image (JPEG, PNG, WEBP).');
      return;
    }

    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB limit
    if (file.size > maxSizeInBytes) {
      setErrorMessage('File size exceeds the 10MB limit. Please upload a smaller image.');
      return;
    }

    setUploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl border-2 border-dashed glass-panel flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 group",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[1.01] shadow-[0_0_30px_rgba(139,92,246,0.1)]" 
            : "border-border hover:border-foreground/30 hover:bg-muted/10"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />

        <div className="p-4 bg-muted/50 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 relative">
          <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute inset-0 rounded-2xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <h3 className="text-base font-bold text-foreground mb-1.5 flex items-center justify-center">
          Drag & Drop Room Photo
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm px-4 mb-4">
          Select or drop a high-resolution photo of your room to initialize spatial mesh mappings.
        </p>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-muted/40 rounded-lg text-[10px] font-semibold text-muted-foreground border border-border">
          <ImageIcon className="h-3 w-3" />
          <span>JPEG, PNG, WEBP — Max 10MB</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center space-x-2 animate-in slide-in-from-top-2 duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
