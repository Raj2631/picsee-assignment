import { Toaster } from "react-hot-toast";
import "./App.css";
import { ActionButtons } from "./components/ActionButtons";
import { DropZone } from "./components/Dropzone";
import { ImageCard } from "./components/ImageCard";
import { MasonryGrid } from "./components/MasonryGrid";
import { useUppy } from "./hooks/useUppy";
import { ProgressBar } from "./components/ProgressBar";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallback";

function App() {
  const {
    files,
    handleFilesAdded,
    removeFile,
    uploadFiles,
    isUploading,
    progress,
    clearCompleted,
    cancelUploads,
    retryUploads,
  } = useUppy();

  const hasCompleted = files.some((f) => f.progress?.uploadComplete);
  const hasErrors = files.some((f) => f.error);
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Toaster />
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-3/4 mx-auto">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-100 mb-2">
                Image Uploader
              </h1>
              <p className="text-gray-400">
                Upload images to Cloudinary with a custom UI (No Uppy
                components)
              </p>
            </header>
          </div>
          <DropZone onFilesAdded={handleFilesAdded} />

          {files.length === 0 && (
            <div className="mt-8 text-center text-gray-400">
              <p>No files selected. Drag and drop images or click to browse.</p>
            </div>
          )}

          {files.length > 0 && (
            <>
              <ActionButtons
                hasFiles={files.length > 0}
                onUpload={uploadFiles}
                hasCompleted={hasCompleted}
                onClearCompleted={clearCompleted}
                hasErrors={hasErrors}
                onRetryUploads={retryUploads}
                isUploading={isUploading}
                onCancelUploads={cancelUploads}
              />

              {files.length && (
                <ProgressBar progress={progress} isUploading={isUploading} />
              )}

              <MasonryGrid>
                {files.map((file) => (
                  <div key={file.id}>
                    <ImageCard file={file} onRemove={removeFile} />
                  </div>
                ))}
              </MasonryGrid>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
