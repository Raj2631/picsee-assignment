export type FileWithThumbnail = {
  id: string;
  name: string;
  type?: string;
  size?: number;
  preview?: string;
  progress?: any;
  error?: string | null;
  uploadURL?: string | undefined;
};

export type UploadProgress = {
  totalFiles: number;
  completedFiles: number;
  totalBytes: number;
  uploadedBytes: number;
};
