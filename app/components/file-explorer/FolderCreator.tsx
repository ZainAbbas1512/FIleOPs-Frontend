// components/file-explorer/FolderCreator.tsx
import { FolderResponse } from "@/app/types/file-explorer";
import { FolderPlus } from "lucide-react";
import { useState } from "react";

interface FolderCreatorProps {
  onCreate: (path: string) => Promise<FolderResponse>;
  currentPath: string;
  className?: string;
}

export function FolderCreator({
  onCreate,
  currentPath,
  className = ''
}: FolderCreatorProps) {
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setIsCreating(true);
    setError('');
    try {
      const fullPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      await onCreate(fullPath);
      setFolderName('');
    } catch (err) {
      setError('Failed to create folder');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-medium text-gray-300 mb-3">Create Folder</h3>
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">

        <div className="flex space-x-2">
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="New folder name"
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            <FolderPlus className="h-5 w-5" />
            <span>{isCreating ? 'Creating...' : 'Create'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}