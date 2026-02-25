"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  X,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface AboutPagePreviewProps {
  content: any;
  isOpen: boolean;
  onClose: () => void;
}

type ViewportSize = "mobile" | "tablet" | "desktop" | "fullscreen";

export function AboutPagePreview({
  content,
  isOpen,
  onClose,
}: AboutPagePreviewProps) {
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop");

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getViewportWidth = () => {
    switch (viewportSize) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      case "desktop":
        return "1024px";
      case "fullscreen":
        return "100%";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`bg-white dark:bg-neutral-900 rounded-xl shadow-2xl flex flex-col ${
          viewportSize === "fullscreen"
            ? "w-full h-full"
            : "w-full max-w-6xl h-[90vh]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700 bg-linear-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-t-xl">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              About Page Preview
            </h2>

            <div className="flex items-center gap-1 border border-neutral-300 dark:border-neutral-600 rounded-lg p-1 bg-white dark:bg-neutral-800">
              <Button
                size="sm"
                variant={viewportSize === "mobile" ? "primary" : "ghost"}
                onClick={() => setViewportSize("mobile")}
                className="p-2"
                type="button"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewportSize === "tablet" ? "primary" : "ghost"}
                onClick={() => setViewportSize("tablet")}
                className="p-2"
                type="button"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewportSize === "desktop" ? "primary" : "ghost"}
                onClick={() => setViewportSize("desktop")}
                className="p-2"
                type="button"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewportSize === "fullscreen" ? "primary" : "ghost"}
                onClick={() => setViewportSize("fullscreen")}
                className="p-2"
                type="button"
              >
                {viewportSize === "fullscreen" ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open("/about", "_blank")}
              type="button"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open Live
            </Button>
            <Button size="sm" variant="outline" onClick={onClose} type="button">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden bg-neutral-100 dark:bg-neutral-800 p-4 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-linear-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
              <ExternalLink className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Preview Your About Page
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
              Click the button below to preview your About page in a new tab.
              Make sure to save your changes first.
            </p>
            <Button
              onClick={() => window.open("/about", "_blank")}
              className="bg-linear-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white"
              type="button"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Preview in New Tab
            </Button>

            <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg max-w-md">
              <p className="text-xs text-primary-700 dark:text-primary-300">
                <strong>Note:</strong> Save your changes before previewing to
                see the latest updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
