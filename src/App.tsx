import { useEffect, useRef, useState } from "react";
import "./App.css";
import { DropZone } from "./components/Dropzone";
import Uppy from "@uppy/core";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import type { FileWithThumbnail } from "./types";
import { ImageCard } from "./components/ImageCard";
import { MasonryGrid } from "./components/MasonryGrid";

function App() {
  const [files, setFiles] = useState<FileWithThumbnail[]>([]);
  const uppyRef = useRef<Uppy>(null);

  const handleFilesAdded = (files: File[]) => {
    if (!uppyRef.current) return;
    files.forEach((file) => {
      uppyRef.current?.addFile(file);
    });

    console.log("Uppy files:", uppyRef.current?.getFiles());
  };

  const convertFile = (file: any): FileWithThumbnail => {
    return {
      id: file.id,
      name: file.name || "Unknown",
      type: file.type,
      size: file.size ?? undefined,
      preview: file.preview,
    };
  };

  useEffect(() => {
    const uppy = new Uppy();
    uppy.use(ThumbnailGenerator, {
      thumbnailWidth: 200,
      thumbnailHeight: 200,
    });

    uppy.on("file-added", (file) => {
      setFiles((prev) => [...prev, convertFile(file)]);
    });

    uppy.on("thumbnail:generated", (file, preview) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, preview } : f))
      );
    });

    uppy.on("file-removed", (file) => {
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    });

    uppyRef.current = uppy;
  }, []);

  const removeFile = (fileId: string) => {
    if (!uppyRef.current) return;
    uppyRef.current.removeFile(fileId);
  };

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
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => console.log(files)}
          >
            Log
          </button>

          {files.length && (
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
