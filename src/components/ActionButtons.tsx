interface ActionButtonsProps {
  hasFiles: boolean;
  onUpload: () => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
  hasErrors: boolean;
  onRetryUploads: () => void;
  isUploading: boolean;
  onCancelUploads: () => void;
}

export function ActionButtons({
  hasFiles,
  onUpload,
  hasCompleted,
  onClearCompleted,
  hasErrors,
  onRetryUploads,
  isUploading,
  onCancelUploads,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3 my-4">
      {hasFiles && (
        <button
          onClick={onUpload}
          className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload All
        </button>
      )}

      {isUploading && (
        <button
          onClick={onCancelUploads}
          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Cancel Upload
        </button>
      )}

      {hasErrors && (
        <button
          onClick={onRetryUploads}
          className="px-4 py-2 cursor-pointer bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
        >
          Retry Failed
        </button>
      )}

      {hasCompleted && (
        <button
          onClick={onClearCompleted}
          className="px-4 py-2 cursor-pointer bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Clear Completed
        </button>
      )}
    </div>
  );
}
