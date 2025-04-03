// app/FileOps/page.tsx
'use client';

import Link from "next/link";
import { useState } from "react";
import { useFileExplorerApi } from "@/app/hooks/useFileExplorerApi";
import { FileExplorer } from "@/app/components/file-explorer/FileExplorer";
import { FolderCreator } from "@/app/components/file-explorer/FolderCreator";
import { FileUploader } from "@/app/components/file-explorer/FileUploader";
import { fileExplorerApi } from "../lib/api/file-explorer";

const handleFileUpload = async (fileData: {
    name: string;
    size: number;
    data: string;
    fileType: string;
    folderPath?: string;
  }) => {
    try {
      return await fileExplorerApi.createFile({
        name: fileData.name,
        size: fileData.size,
        data: fileData.data,
        fileType: fileData.fileType,
        folderPath: fileData.folderPath
      });
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

export default function FileOps() {
  const [currentPath, setCurrentPath] = useState<string>("root"); 
  const { 
    loading, 
    error,
    findFilesInFolder,
    createFolder,
    deleteFile,
    renameFolder
  } = useFileExplorerApi();

  const handleNavigate = async (path: string) => {
    setCurrentPath(path);
    await findFilesInFolder(path);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-zinc-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            File Explorer
          </h1>
          <Link
            href="/"
            className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
          >
            Back to Home
          </Link>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300">{error.message}</p>
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <FileUploader 
              onUpload={handleFileUpload} 
              currentPath={currentPath}
              className="space-y-4"
            />
            {/* <FileUploader 
            onUpload={handleFileUpload}
            currentPath={currentPath}
            /> */}
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <FolderCreator 
              onCreate={createFolder} 
              currentPath={currentPath}
              className="space-y-4"
            />
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-300">Current Path</h3>
              <div className="p-3 bg-gray-900 rounded-lg text-gray-400 font-mono text-sm">
                {currentPath || '/'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Explorer */}
        <div className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
          <FileExplorer
            loading={loading}
            onNavigate={handleNavigate}
            onDeleteFile={deleteFile}
            onRenameFolder={renameFolder}
            currentPath={currentPath}
          />
        </div>
      </div>
    </div>
  );
}