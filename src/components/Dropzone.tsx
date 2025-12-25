import { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

export function DropZone({ onFilesAdded, disabled = false }: DropZoneProps) {
  const [isHovering, setIsHovering] = useState(false);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      disabled,
      accept: {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/gif": [".gif"],
        "image/webp": [".webp"],
      },
      multiple: true,
      maxSize: 10 * 1024 * 1024, // 10MB per file
      onDrop: (acceptedFiles, fileRejections, event) => {
        console.log("react-dropzone onDrop event:", event);
        console.log("Accepted files:", acceptedFiles);
        console.log("Rejected files:", fileRejections);

        if (fileRejections.length) {
          toast.error(fileRejections[0].errors[0].message, {});
        }

        if (!acceptedFiles.length) return;
        onFilesAdded(acceptedFiles);
      },
    });

  const baseClasses =
    "relative border-2 border-dashed rounded-lg transition-all duration-200";

  const stateClasses = isDragActive
    ? "border-blue-500 bg-blue-900/20 scale-[1.02]"
    : isDragReject
    ? "border-red-400 bg-red-900/20"
    : isHovering
    ? "border-gray-400 bg-gray-800/50"
    : "border-gray-600 bg-gray-900/50";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  const dropzoneClassName = `${baseClasses} ${stateClasses} ${disabledClasses}`;

  return (
    <div
      {...getRootProps({
        className: dropzoneClassName,
        onMouseEnter: () => !disabled && setIsHovering(true),
        onMouseLeave: () => setIsHovering(false),
      })}
    >
      <input
        {...getInputProps({
          accept: "image/jpeg,image/jpg,image/png,image/gif,image/webp",
          multiple: true,
          disabled,
        })}
        className="hidden"
      />
      <div className="p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-500"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-100">
            {isDragActive ? "Drop images here" : "Drag and drop images here"}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            or{" "}
            <span className="font-medium text-blue-400 hover:text-blue-500">
              click to browse
            </span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supports JPG, PNG, GIF, WEBP (max 10MB per file)
          </p>
        </div>
      </div>
    </div>
  );
}
