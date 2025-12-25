import { useCallback, useEffect, useRef, useState } from "react";
import Uppy from "@uppy/core";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import XHRUpload from "@uppy/xhr-upload";
import type { FileWithThumbnail, UploadProgress } from "../types";

const convertFile = (file: any): FileWithThumbnail => {
  return {
    id: file.id,
    name: file.name || "Unknown",
    type: file.type,
    size: file.size ?? undefined,
    preview: file.preview,
    progress: file.progress,
  };
};

export function useUppy() {
  const [files, setFiles] = useState<FileWithThumbnail[]>([]);
  const uppyRef = useRef<Uppy | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [progress, setProgress] = useState<UploadProgress>({
    totalFiles: 0,
    completedFiles: 0,
  });

  useEffect(() => {
    const uppy = new Uppy({
      restrictions: {
        maxFileSize: 10 * 1024 * 1024,
        allowedFileTypes: [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ],
        maxNumberOfFiles: 100,
      },
    });

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

    uppy.use(XHRUpload, {
      endpoint: `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_NAME
      }/image/upload`,
      formData: true,
      allowedMetaFields: ["upload_preset"],
    });

    uppy.on("upload", () => {
      setIsUploading(true);
      const allFiles = uppy.getFiles();
      setProgress({
        totalFiles: allFiles.length,
        completedFiles: 0,
      });
    });

    uppy.on("complete", () => {
      setIsUploading(false);
    });

    uppy.on("upload-progress", (file) => {
      if (!file) return;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, progress: file.progress } : f
        )
      );
    });

    uppy.on("upload-success", (file) => {
      if (!file) return;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, progress: { ...file.progress, uploadComplete: true } }
            : f
        )
      );
      setProgress((prev) => ({
        ...prev,
        completedFiles: prev.completedFiles + 1,
      }));
    });

    uppy.on("upload-error", (file, error) => {
      if (!file) return;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, progress: file.progress, error: error?.message }
            : f
        )
      );
    });

    uppyRef.current = uppy;

    return () => {
      uppy.cancelAll();
      uppyRef.current = null;
    };
  }, []);

  const handleFilesAdded = useCallback((files: File[]) => {
    if (!uppyRef.current) return;

    files.forEach((file) => {
      uppyRef.current?.addFile(file);
    });

    console.log("Uppy files:", uppyRef.current?.getFiles());
  }, []);

  const removeFile = useCallback((fileId: string) => {
    if (!uppyRef.current) return;
    uppyRef.current.removeFile(fileId);
  }, []);

  const uploadFiles = useCallback(async () => {
    if (!uppyRef.current) return;

    const filesToUpload = uppyRef.current.getFiles();
    filesToUpload.forEach((file) => {
      uppyRef.current?.setFileMeta(file.id, {
        upload_preset: import.meta.env.VITE_UPLOAD_PRESET_NAME,
      });
    });

    await uppyRef.current.upload();
  }, []);

  return {
    uppy: uppyRef.current,
    files,
    handleFilesAdded,
    removeFile,
    uploadFiles,
    isUploading,
    progress,
  };
}
