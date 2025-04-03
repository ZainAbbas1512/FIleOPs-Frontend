// types/file-explorer.d.ts

// Base types
type UUID = string;
type Base64 = string;
type FilePath = string;

// File DTOs
export interface CreateFileRequest {
  name: string;
  folderPath?: string;
  size: number;
  data: string;
  fileType: string;
}

export interface UpdateFileRequest {
  id: string;
  name?: string;
  folderPath?: string;
  size?: number;
  data?: string;
  fileType?: string;
}

export interface FindFilesInFolderRequest {
  folderPath: string;
}

export interface GetFilesByTypeRequest {
  fileType: string;
}

export interface DeleteFileRequest {
  id: string;
}

export interface FileTypeRequest {
  fileType: string;
}

export interface FindFilesRequest {
  id?: UUID;
}

export interface FolderFilesRequest {
  folderPath: FilePath;
}

export interface FolderFilesByTypeRequest {
  folderPath: FilePath;
  fileType: string;
}

// Folder DTOs
export interface CreateFolderRequest {
  path: FilePath;
}

export interface RenameFolderRequest {
  newName: string;
}

// Response DTOs
export interface FileResponse {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderResponse {
  id: UUID;
  name: string;
  path: FilePath;
  contents?: Array<FileResponse | FolderResponse>;
  createdAt: string;
  updatedAt: string;
}

export interface FileTypeResponse {
  id: UUID;
  name: string;
  extensions: string[];
  icon?: string;
}