export type FileWithThumbnail = {
  id: string;
  name: string;
  type?: string;
  size?: number;
  preview?: string;
  progress?: any;
  error?: string;
};

export type UploadProgress = {
  totalFiles: number;
  completedFiles: number;
};
