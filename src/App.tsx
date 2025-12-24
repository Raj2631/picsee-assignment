import "./App.css";
import { DropZone } from "./components/Dropzone";
import { ImageCard } from "./components/ImageCard";
import { MasonryGrid } from "./components/MasonryGrid";
import { useUppy } from "./hooks/useUppy";

function App() {
  const { files, handleFilesAdded, removeFile } = useUppy();

  return (
    <>
      <div className="min-h-screen  bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-3/4 mx-auto">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Image Uploader
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Upload images to Cloudinary with a custom UI (No Uppy
                components)
              </p>
            </header>
          </div>
          <DropZone onFilesAdded={handleFilesAdded} />

          {files.length === 0 && (
            <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
              <p>No files selected. Drag and drop images or click to browse.</p>
            </div>
          )}

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer my-4"
            onClick={() => console.log(files)}
          >
            Log
          </button>

          {files.length > 0 && (
            <MasonryGrid>
              {files.map((file) => (
                <div key={file.id}>
                  <ImageCard file={file} onRemove={removeFile} />
                </div>
              ))}
            </MasonryGrid>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
