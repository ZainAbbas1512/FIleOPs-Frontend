// components/file-explorer/FileExplorer.tsx
import { fileExplorerApi } from "@/app/lib/api/file-explorer";
import { FolderResponse } from "@/app/types/file-explorer";
import { FileIcon, FolderIcon, Loader2, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface FileExplorerItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  path: string;
}

interface FileExplorerProps {
  loading: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
  onDeleteFile: (id: string) => Promise<void>;
  onRenameFolder: (id: string, newName: string) => Promise<FolderResponse>;
}

export function FileExplorer({
  loading,
  currentPath,
  onNavigate,
  onDeleteFile,
  onRenameFolder,
}: FileExplorerProps) {
  const [items, setItems] = useState<FileExplorerItem[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setApiLoading(true);
      setError(null);
      try {
        // 1️⃣ Get all folders & find the current folder by name
        const allFolders = await fileExplorerApi.getAllFolders();
        const targetFolder = allFolders.find((folder: any) => folder.name === currentPath);

        if (!targetFolder) {
          throw new Error(`Folder "${currentPath}" not found`);
        }

        // 2️⃣ Get subfolders of the current folder
        const subFolders = await fileExplorerApi.getFoldersByParentId(targetFolder.id);
        const transformedFolders = subFolders.map((folder: any) => ({
          id: folder.id,
          name: folder.name,
          type: "folder" as const,
          path: folder.path || "",
        }));

        // 3️⃣ Get files inside the current folder
        const fileData = await fileExplorerApi.findFilesInFolder({ folderPath: currentPath });
        const transformedFiles = fileData.map((file: any) => ({
          id: file.id,
          name: file.name,
          type: "file" as const,
          size: file.size,
          path: file.path,
        }));

        // 4️⃣ Update state with folders & files
        setItems([...transformedFolders, ...transformedFiles]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load items");
      } finally {
        setApiLoading(false);
      }
    };

    fetchItems();
  }, [currentPath]); // Re-run when folder changes

  // 📌 Function to go back to the parent folder
  const handleGoBack = () => {
    if (currentPath === "root") return; // Prevent going above root
    const pathParts = currentPath.split("/");
    pathParts.pop(); // Remove last part (current folder)
    const parentPath = pathParts.join("/") || "root"; // Default to root
    onNavigate(parentPath);
  };

  return (
    <div className="divide-y divide-gray-700">
      {/* Breadcrumbs & Back Button */}
      <div className="p-4 bg-gray-800/50 flex items-center space-x-2 overflow-x-auto">
        {currentPath !== "root" && (
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </button>
        )}
        {currentPath.split("/").map((segment, i, arr) => (
          <button
            key={i}
            onClick={() => onNavigate(arr.slice(0, i + 1).join("/"))}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            {segment || "Root"}
            {i < arr.length - 1 && <span className="mx-2 text-gray-500">/</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading || apiLoading ? (
          <div className="flex items-center justify-center h-full p-8">
            <Loader2 className="animate-spin text-blue-400 h-8 w-8" />
          </div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {items.map((item) => (
              <li key={item.id} className="hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    {item.type === "folder" ? (
                      <button
                        onClick={() => onNavigate(`${item.name}`)}
                        className="flex items-center space-x-2 text-left flex-1"
                      >
                        <FolderIcon className="text-blue-400 h-5 w-5" />
                        <span className="text-gray-200">{item.name}</span>
                      </button>
                    ) : (
                      <>
                        <FileIcon className="text-purple-400 h-5 w-5" />
                        <span className="text-gray-300">{item.name}</span>
                        {item.size && (
                          <span className="text-gray-500 text-sm ml-2">
                            {(item.size / 1024).toFixed(2)} KB
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {item.type === "folder" && (
                      <button
                        onClick={() => {
                          const newName = prompt("New folder name:", item.name);
                          if (newName) onRenameFolder(item.id, newName);
                        }}
                        className="text-gray-400 hover:text-yellow-400"
                      >
                        Rename
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteFile(item.id)}
                      className="text-gray-400 hover:text-red-400 ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
