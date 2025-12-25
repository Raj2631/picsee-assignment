import { useRef } from "react";
import type { ChangeEvent } from "react";

interface MobileGalleryButtonProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

export function MobileGalleryButton({
  onFilesAdded,
  disabled = false,
}: MobileGalleryButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      onFilesAdded(filesArray);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="md:hidden w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        📷 Upload from Gallery
      </button>
    </>
  );
}
