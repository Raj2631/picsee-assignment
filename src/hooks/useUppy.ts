import { useEffect, useRef, useState } from "react";
import Uppy from "@uppy/core";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import XHRUpload from "@uppy/xhr-upload";
import type { FileWithThumbnail, UploadProgress } from "../types";
import toast from "react-hot-toast";

const convertFile = (file: any): FileWithThumbnail => {
  return {
    id: file.id,
    name: file.name || "Unknown",
    type: file.type,
    size: file.size ?? undefined,
    preview: file.preview,
    progress: file.progress,
    uploadURL: file.uploadURL,
  };
};

const DEFAULT_PROGRESS = {
  totalFiles: 0,
  completedFiles: 0,
  totalBytes: 0,
  uploadedBytes: 0,
};

export function useUppy() {
  const [files, setFiles] = useState<FileWithThumbnail[]>([]);
  const uppyRef = useRef<Uppy | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>(DEFAULT_PROGRESS);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);

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
      thumbnailWidth: 400,
      thumbnailHeight: 400,
    });

    const updateProgressAndFiles = () => {
      if (!uppyRef.current) return;
      const allFiles = uppyRef.current.getFiles();
      const totalBytes = allFiles.reduce((sum, f) => sum + (f.size || 0), 0);

      setProgress((prev) => ({
        ...prev,
        totalFiles: allFiles.length,
        totalBytes,
      }));
    };

    uppy.on("file-added", (file) => {
      if (files.length === 0) {
        setIsGeneratingThumbnails(true);
      }
      setFiles((prev) => [...prev, convertFile(file)]);
      updateProgressAndFiles();
    });

    uppy.on("thumbnail:generated", (file, preview) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, preview } : f))
      );

      setIsGeneratingThumbnails(false);
    });

    uppy.on("file-removed", (file) => {
      setFiles((prev) => {
        const updatedFiles = prev.filter((f) => f.id !== file.id);
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
        return updatedFiles;
      });
      updateProgressAndFiles();
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
      const completedFiles = allFiles.filter(
        (f) => f.progress?.uploadComplete
      ).length;
      setProgress((prev) => ({
        ...prev,
        totalFiles: allFiles.length,
        completedFiles,
      }));
    });

    uppy.on("upload-success", (file, response) => {
      if (!file) return;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                uploadURL: response.uploadURL,
                error: null,
              }
            : f
        )
      );

      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
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

      const allFiles = uppy.getFiles();

      const totalBytes = allFiles.reduce((sum, f) => sum + (f.size || 0), 0);
      const uploadedBytes = allFiles.reduce(
        (sum, f) => sum + (f.progress?.bytesUploaded || 0),
        0
      );

      setProgress((prev) => ({
        ...prev,
        totalBytes,
        uploadedBytes,
      }));
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

  const handleFilesAdded = (files: File[]) => {
    if (!uppyRef.current) return;

    files.forEach((file) => {
      uppyRef.current?.addFile(file);
    });
  };

  const removeFile = (fileId: string) => {
    if (!uppyRef.current) return;
    uppyRef.current.removeFile(fileId);
  };

  const uploadFiles = async () => {
    if (!uppyRef.current) return;

    const filesToUpload = uppyRef.current.getFiles();
    filesToUpload.forEach((file) => {
      uppyRef.current?.setFileMeta(file.id, {
        upload_preset: import.meta.env.VITE_UPLOAD_PRESET_NAME,
      });
    });

    await uppyRef.current.upload();
  };

  const clearCompleted = () => {
    if (!uppyRef.current) return;
    const state = uppyRef.current.getState();
    const completedFiles = Object.values(state.files).filter(
      (f) => f.progress?.uploadComplete
    );
    completedFiles.forEach((file) => {
      uppyRef.current?.removeFile(file.id);
    });

    setProgress((prev) => ({
      ...prev,
      totalFiles: prev.totalFiles - completedFiles.length,
      completedFiles: 0,
      uploadedBytes: 0,
    }));
    toast.success("Cleared uploaded images successfully");
  };

  const cancelUploads = () => {
    if (!uppyRef.current) return;
    uppyRef.current.cancelAll();
    toast.success("Cancelled uploads");
    setProgress(DEFAULT_PROGRESS);
  };

  const retryUploads = () => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.error) {
          return {
            ...f,
            error: undefined,
            progress: undefined,
          };
        }
        return f;
      })
    );
    uppyRef.current?.retryAll();
  };

  return {
    uppy: uppyRef.current,
    files,
    handleFilesAdded,
    removeFile,
    uploadFiles,
    isUploading,
    progress,
    clearCompleted,
    retryUploads,
    cancelUploads,
    isGeneratingThumbnails,
  };
}
