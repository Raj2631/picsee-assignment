interface ActionButtonsProps {
  hasFiles: boolean;
  onUpload: () => void;
}

export function ActionButtons({ hasFiles, onUpload }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {hasFiles && (
        <button
          onClick={onUpload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload All
        </button>
      )}
    </div>
  );
}
