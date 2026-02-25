// components/admin/ui/ImagePreviewModal.tsx
"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface ImagePreviewModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export function ImagePreviewModal({
  imageUrl,
  onClose,
}: ImagePreviewModalProps) {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <div
        className="relative max-w-7xl w-full max-h-[90vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageUrl}
          alt="Preview"
          width={1920}
          height={1080}
          className="w-full h-full object-contain rounded-xl shadow-2xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAwLDE1MCkiPjxjaXJjbGUgcj0iMzAiIGZpbGw9IiNkMWQ1ZGIiLz48cG9seWdvbiBwb2ludHM9Ii0xNSwtMTAgMTUsLTEwIDAsMTAiIGZpbGw9IiM5Y2EzYWYiLz48L2c+PHRleHQgeD0iNTAlIiB5PSI4MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+SW1hZ2Ugbm90IGF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";
          }}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-60 rounded-full p-3 hover:bg-opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Close preview"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}