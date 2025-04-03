// lib/api/file-explorer.ts
import type {
    CreateFileRequest,
    UpdateFileRequest,
    FileResponse,
    FolderResponse,
    FileTypeResponse,
    FindFilesInFolderRequest,
    GetFilesByTypeRequest,
    FolderFilesByTypeRequest,
    CreateFolderRequest,
    RenameFolderRequest,
    DeleteFileRequest
  } from '@/app/types/file-explorer';
  
  class FileExplorerApiClient {
    private baseUrl: string;
  
    constructor(baseUrl: string = 'http://localhost:8080/api') {
        this.baseUrl = baseUrl;
      }
    
      // Add this helper method to check network connectivity
      private async checkNetwork(): Promise<void> {
        if (!navigator.onLine) {
          throw new ApiError(0, 'Network connection unavailable');
        }
      }
  
    // ==================== Files API ====================
    async getAllFiles(): Promise<FileResponse[]> {
        try {
          await this.checkNetwork();
          const response = await fetch(`${this.baseUrl}/files`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          return this.handleResponse(response);
        } catch (error) {
          console.error('Failed to fetch files:', error);
          throw error;
        }
      }
  
    async createFile(data: CreateFileRequest): Promise<FileResponse> {
      const response = await fetch(`${this.baseUrl}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    }
  
    async getFileById(id: string): Promise<FileResponse> {
      const response = await fetch(`${this.baseUrl}/files/${id}`);
      return this.handleResponse(response);
    }
  
    async findFilesInFolder(data: FindFilesInFolderRequest): Promise<FileResponse[]> {
      const response = await fetch(`${this.baseUrl}/files/folder-files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    }
  
    async updateFile(data: UpdateFileRequest): Promise<FileResponse> {
      const response = await fetch(`${this.baseUrl}/files`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    }
  
    async getFilesByType(data: GetFilesByTypeRequest): Promise<FileResponse[]> {
      const response = await fetch(`${this.baseUrl}/files/by-type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    }
  
    async findFilesInFolderByType(data: FolderFilesByTypeRequest): Promise<FileResponse[]> {
      const response = await fetch(`${this.baseUrl}/files/folder-files-by-type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    }
  
    async deleteFile(data: DeleteFileRequest): Promise<void> {
      const response = await fetch(`${this.baseUrl}/files`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await this.handleResponse(response);
    }
  
    // ==================== Folders API ====================
    async getAllFolders(): Promise<FolderResponse[]> {
        try {
          await this.checkNetwork();
          const response = await fetch(`${this.baseUrl}/folders`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          return this.handleResponse(response);
        } catch (error) {
          console.error('Failed to fetch folders:', error);
          throw error;
        }
      }
  
    async getFoldersByParentId(parentId: string): Promise<FolderResponse[]> {
      const response = await fetch(
        `${this.baseUrl}/folders/get-all-folders-of-specific-folder/${parentId}`
      );
      return this.handleResponse(response);
    }
  
    async createFolder(data: CreateFolderRequest): Promise<FolderResponse> {
        try {
          await this.checkNetwork();
          const response = await fetch(`${this.baseUrl}/folders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          return this.handleResponse(response);
        } catch (error) {
          console.error('Failed to create folder:', error);
          throw error;
        }
      }
  
    async renameFolder(folderId: string, data: RenameFolderRequest): Promise<FolderResponse> {
      const response = await fetch(`${this.baseUrl}/folders/${folderId}/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    }
  
    async deleteFolder(folderId: string): Promise<void> {
      const response = await fetch(`${this.baseUrl}/folders/${folderId}`, {
        method: 'DELETE',
      });
      await this.handleResponse(response);
    }
  
    // ==================== FileType API ====================
    async getAllFileTypes(): Promise<FileTypeResponse[]> {
      const response = await fetch(`${this.baseUrl}/fileType`);
      return this.handleResponse(response);
    }
  
    async getFileTypeById(id: string): Promise<FileTypeResponse> {
      const response = await fetch(`${this.baseUrl}/fileType/${id}`);
      return this.handleResponse(response);
    }
  
    // ==================== Helper Methods ====================
    private async handleResponse(response: Response): Promise<any> {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || 'An error occurred',
          errorData
        );
      }
      return response.json();
    }
  }
  
  class ApiError extends Error {
    constructor(
      public status: number,
      message: string,
      public data?: any
    ) {
      super(message);
      this.name = 'ApiError';
    }
  }
  
  export const fileExplorerApi = new FileExplorerApiClient();