import type { FileWithThumbnail } from "../types";

interface ImageCardProps {
  file: FileWithThumbnail;
  error?: string;
  onRemove: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
}

export function ImageCard({ file, onRemove }: ImageCardProps) {
  const getStatus = () => {
    if (file.error) {
      return "error";
    }
    const progress = file.progress as any;
    if (progress?.uploadComplete) return "complete";
    if (progress?.uploadStarted || progress?.bytesUploaded) return "uploading";
    return "pending";
  };

  const status = getStatus();
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getStatusColor = () => {
    switch (status) {
      case "complete":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "uploading":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "complete":
        return "Complete";
      case "error":
        return "Error";
      case "uploading":
        return `Uploading - ${file.progress.percentage || 0}%`;
      default:
        return "Pending";
    }
  };

  return (
    <div className="group relative bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg">
      <div className="relative bg-gray-700 overflow-hidden">
        <img
          src={file.uploadURL || file.preview}
          alt={file.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-gray-100 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formatFileSize(file.size || 0)}
        </p>

        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>
        </div>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onRemove(file.id)}
            className="flex-1 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-900/20 rounded transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
