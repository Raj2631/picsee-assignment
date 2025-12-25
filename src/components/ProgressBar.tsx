import type { UploadProgress } from "../types";

interface ProgressBarProps {
  progress: UploadProgress;
  isUploading: boolean;
}

export function ProgressBar({ progress, isUploading }: ProgressBarProps) {
  if (!isUploading && progress.completedFiles === 0) {
    return null;
  }

  const overallProgress =
    progress.totalFiles > 0
      ? (progress.completedFiles / progress.totalFiles) * 100
      : 0;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-100">
          Overall Progress
        </h3>
        <span className="text-sm text-gray-400">
          {progress.completedFiles} / {progress.totalFiles} files
        </span>
      </div>

      <div className="mb-3">
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">
          {Math.round(overallProgress)}% complete
        </p>
      </div>
    </div>
  );
}
