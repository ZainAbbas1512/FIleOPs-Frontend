// components/file-explorer/FileUploader.tsx
'use client';

import { FileResponse } from "@/app/types/file-explorer";
import { UploadCloud, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";

interface FileUploaderProps {
    onUpload: (file: { 
      name: string; 
      size: number; 
      data: string; 
      fileType: string;
      folderPath?: string;
    }) => Promise<FileResponse>; // Changed from Promise<void>
    currentPath: string;
    className?: string;
  }

export function FileUploader({ 
  onUpload, 
  currentPath, 
  className = '' 
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    await handleFiles(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFiles = useCallback(async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await uploadFile(file);
        setUploadProgress(((i + 1) / files.length) * 100);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [currentPath]);

  const uploadFile = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        // Optional: Handle progress for individual files
      };
      
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result?.toString().split(',')[1] || '';
          await onUpload({
            name: file.name,
            size: file.size,
            data: base64Data,
            fileType: file.type || 'application/octet-stream',
            folderPath: currentPath || undefined
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('File reading failed'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-medium text-gray-300 mb-3">Upload Files</h3>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-colors ${
          isDragging 
            ? 'border-blue-400 bg-blue-900/20' 
            : 'border-gray-600 hover:border-gray-500'
        } ${isUploading ? 'pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <p className="text-gray-400">Uploading... {Math.round(uploadProgress)}%</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <UploadCloud className={`h-10 w-10 ${
              isDragging ? 'text-blue-400' : 'text-gray-400'
            }`} />
            <p className="text-center text-gray-400">
              {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
            </p>
            <p className="text-xs text-gray-500">
              Supports multiple files
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              multiple
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Select Files
            </label>
          </>
        )}
      </div>
    </div>
  );
}