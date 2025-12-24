import type { FileWithThumbnail } from "../types";

interface ImageCardProps {
  file: FileWithThumbnail;
  error?: string;
  onRemove: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
}

export function ImageCard({ file, onRemove }: ImageCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg">
      <div className="relative bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src={file.preview}
          alt={file.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatFileSize(file.size || 0)}
        </p>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onRemove(file.id)}
            className="flex-1 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
