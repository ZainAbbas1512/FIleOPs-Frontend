// hooks/useFileExplorerApi.ts
import { useState, useCallback } from 'react';
import { fileExplorerApi } from '../lib/api/file-explorer';
import type {
  CreateFileRequest,
  UpdateFileRequest,
  FileResponse,
  FolderResponse,
  // ... other types
} from '@/app/types/file-explorer';

export function useFileExplorerApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const wrapRequest = useCallback(async <T>(request: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await request();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Request failed');
      setError(error);
      console.error('API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // File Operations
  const createFile = useCallback((data: CreateFileRequest) => 
    wrapRequest(() => fileExplorerApi.createFile(data)), [wrapRequest]);

  const updateFile = useCallback((data: UpdateFileRequest) => 
    wrapRequest(() => fileExplorerApi.updateFile(data)), [wrapRequest]);

  // Folder Operations
  const createFolder = useCallback(async (path: string) => {
    return wrapRequest(() => fileExplorerApi.createFolder({ path }));
  }, [wrapRequest]);

  const renameFolder = useCallback(async (folderId: string, newName: string) => {
    return wrapRequest(() => fileExplorerApi.renameFolder(folderId, { newName }));
  }, [wrapRequest]);

  // File Type Operations
  const getFilesByType = useCallback((fileType: string) => 
    wrapRequest(() => fileExplorerApi.getFilesByType({ fileType })), [wrapRequest]);

  return {
    loading,
    error,
    resetError: () => setError(null),
    
    // File methods
    createFile,
    updateFile,
    deleteFile: useCallback((id: string) => 
      wrapRequest(() => fileExplorerApi.deleteFile({ id })), [wrapRequest]),
    findFilesInFolder: useCallback((folderPath: string) => 
      wrapRequest(() => fileExplorerApi.findFilesInFolder({ folderPath })), [wrapRequest]),
    findFilesInFolderByType: useCallback((folderPath: string, fileType: string) => 
      wrapRequest(() => fileExplorerApi.findFilesInFolderByType({ folderPath, fileType })), [wrapRequest]),
    
    // Folder methods
    createFolder,
    renameFolder,
    deleteFolder: useCallback((folderId: string) => 
        wrapRequest(() => fileExplorerApi.deleteFolder(folderId)), [wrapRequest]),
    
    // File type methods
    getFilesByType,
  };
}