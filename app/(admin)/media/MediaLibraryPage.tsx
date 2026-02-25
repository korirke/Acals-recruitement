"use client";

import { useState } from "react";
import { useMedia } from "@/hooks/useMedia";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import {
  Upload,
  Grid,
  List,
  Search,
  Trash2,
  Download,
  Eye,
  X,
  Image as ImageIcon,
  Film,
  File,
  Folder,
  RefreshCw,
  Cloud,
  Zap,
} from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUtils";
import type { MediaFile } from "@/types";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";

export default function MediaLibraryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const {
    files,
    stats,
    loading,
    uploading,
    uploadFiles,
    deleteFile,
    bulkDeleteFiles,
    refetch,
    filters,
    setFilters,
  } = useMedia();

  const handleSearch = (value: string) => {
    setSearchInput(value);
    // Debounce search
    const timer = setTimeout(() => {
      setFilters({ ...filters, search: value });
    }, 500);
    return () => clearTimeout(timer);
  };

  const handleFilterChange = (
    fileType: "all" | "image" | "video" | "document",
  ) => {
    setFilters({ ...filters, fileType });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string, size: "sm" | "lg" = "sm") => {
    const iconSize = size === "sm" ? "w-5 h-5" : "w-8 h-8";
    const icons = {
      image: <ImageIcon className={`${iconSize} text-blue-600`} />,
      video: <Film className={`${iconSize} text-purple-600`} />,
      document: <File className={`${iconSize} text-orange-600`} />,
      other: <File className={`${iconSize} text-neutral-600`} />,
    };
    return icons[fileType as keyof typeof icons] || icons.other;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(normalizeImageUrl(url));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.has(fileId) ? newSet.delete(fileId) : newSet.add(fileId);
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    const confirmed = confirm(`Delete ${selectedFiles.size} file(s)?`);
    if (confirmed) {
      const success = await bulkDeleteFiles(Array.from(selectedFiles));
      if (success) {
        setSelectedFiles(new Set());
      }
    }
  };

  const FilePreviewModal = () => {
    if (!previewFile) return null;

    const fileUrl = normalizeImageUrl(previewFile.url);

    return (
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setPreviewFile(null)}
      >
        <div
          className="relative max-w-5xl max-h-[90vh] bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {previewFile.originalName}
              </h3>
              <div className="flex items-center space-x-4 mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                <span>{formatFileSize(previewFile.size)}</span>
                <span>{previewFile.mimetype}</span>
                <span>
                  {new Date(previewFile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(previewFile.url)}
              >
                <Cloud className="w-4 h-4 mr-2" />
                Copy URL
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(fileUrl, "_blank")}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewFile(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="p-6 max-h-[70vh] overflow-auto">
            {previewFile.fileType === "image" && (
              <img
                src={fileUrl}
                alt={previewFile.originalName}
                className="max-w-full object-contain mx-auto rounded-xl"
              />
            )}
            {previewFile.fileType === "video" && (
              <video
                src={fileUrl}
                controls
                className="max-w-full mx-auto rounded-xl"
              />
            )}
            {previewFile.fileType !== "image" &&
              previewFile.fileType !== "video" && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-700 rounded-2xl flex items-center justify-center">
                    {getFileIcon(previewFile.fileType, "lg")}
                  </div>
                  <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    {previewFile.originalName}
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Preview not available
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded-2xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <AdminBreadcrumb />
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Media Library
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            {files.length} files total
          </p>
        </div>
        <div className="flex gap-3">
          {selectedFiles.size > 0 && (
            <Button
              variant="outline"
              onClick={handleBulkDelete}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete {selectedFiles.size}
            </Button>
          )}
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <Button disabled={uploading}>
              {uploading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatsCard
            title="Total"
            value={stats.total}
            icon={<Folder className="w-6 h-6" />}
            color="blue"
          />
          <StatsCard
            title="Images"
            value={stats.images}
            icon={<ImageIcon className="w-6 h-6" />}
            color="green"
          />
          <StatsCard
            title="Videos"
            value={stats.videos}
            icon={<Film className="w-6 h-6" />}
            color="purple"
          />
          <StatsCard
            title="Documents"
            value={stats.documents}
            icon={<File className="w-6 h-6" />}
            color="orange"
          />
          <StatsCard
            title="Storage"
            value={formatFileSize(stats.totalSize)}
            icon={<Cloud className="w-6 h-6" />}
            color="cyan"
          />
        </div>
      )}

      {/* Content Area */}
      <div
        className={`bg-white dark:bg-neutral-800 rounded-2xl border-2 shadow-xl overflow-hidden transition-colors ${
          dragOver
            ? "border-blue-400 bg-blue-50/50"
            : "border-neutral-200 dark:border-neutral-700"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Filters */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filters?.fileType || "all"}
                onChange={(e) => handleFilterChange(e.target.value as any)}
                className="px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Files</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
              </select>

              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              <div className="flex bg-neutral-100 dark:bg-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-600">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-l-xl transition-all ${viewMode === "grid" ? "bg-blue-500 text-white" : "hover:bg-neutral-50 dark:hover:bg-neutral-600"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-r-xl transition-all ${viewMode === "list" ? "bg-blue-500 text-white" : "hover:bg-neutral-50 dark:hover:bg-neutral-600"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Files Display */}
        <div className="p-6">
          {dragOver && (
            <div className="border-2 border-dashed border-blue-400 rounded-2xl p-12 text-center mb-6 bg-blue-50/50 dark:bg-blue-900/20">
              <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                Drop files to upload
              </h3>
            </div>
          )}

          {files.length === 0 ? (
            <div className="text-center py-16">
              <Upload className="w-24 h-24 text-neutral-400 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                No files found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Upload files to get started
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file) => (
                <div key={file.id} className="group relative">
                  <div className="border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                      className="absolute top-3 left-3 z-10 w-4 h-4"
                    />

                    <div
                      className="aspect-square bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center cursor-pointer"
                      onClick={() => setPreviewFile(file)}
                    >
                      {file.fileType === "image" ? (
                        <img
                          src={normalizeImageUrl(file.url)}
                          alt={file.originalName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getFileIcon(file.fileType, "lg")
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-neutral-800">
                      <p className="font-medium text-neutral-900 dark:text-white truncate text-sm">
                        {file.originalName}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-neutral-500">
                          {formatFileSize(file.size)}
                        </p>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(file.url);
                            }}
                            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                          >
                            <Cloud className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFile(file.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-750 rounded-xl border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                      className="w-4 h-4"
                    />
                    {file.fileType === "image" ? (
                      <img
                        src={normalizeImageUrl(file.url)}
                        alt={file.originalName}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                        {getFileIcon(file.fileType)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        {file.originalName}
                      </p>
                      <div className="flex space-x-3 text-sm text-neutral-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.mimetype}</span>
                        <span>
                          {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewFile(file)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(file.url)}
                    >
                      <Cloud className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFile(file.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FilePreviewModal />
    </div>
  );
}
