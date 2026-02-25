"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { useToast } from "@/components/admin/ui/Toast";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  Upload,
  GripVertical,
  ExternalLink,
  Users,
  Building2,
  Globe,
  Sparkles,
  Star,
  RefreshCw,
} from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUtils";

// Services and Types
import { clientsService } from "@/services/web-services";
import { uploadService } from "@/services/web-services/upload.service";
import type { Client } from "@/types/admin/clients.types";
import type { ClientStats } from "@/types/admin/clients.types";

export default function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [stats, setStats] = useState<ClientStats>({
    total: 0,
    active: 0,
    withIndustry: 0,
    withWebsite: 0,
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientsService.getAll();
      setClients(data);
      setStats(clientsService.calculateStats(data));
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load clients",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveClients = async () => {
    setSaving(true);
    try {
      await clientsService.updateAll(clients);

      showToast({
        type: "success",
        title: "Success",
        message: "Clients updated successfully!",
      });

      setEditingClient(null);
      await fetchClients();
    } catch (error) {
      console.error("Failed to save clients:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to update clients",
      });
    } finally {
      setSaving(false);
    }
  };

  const addClient = () => {
    const newClient = clientsService.createNew(clients.length + 1);
    setClients([...clients, newClient]);
    setEditingClient(newClient.id);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((clients) =>
      clients.map((client) =>
        client.id === id ? { ...client, ...updates } : client,
      ),
    );
  };

  const deleteClient = (id: string) => {
    setClients((clients) => clients.filter((client) => client.id !== id));
    showToast({
      type: "success",
      title: "Client Deleted",
      message: "Client has been removed successfully",
    });
  };

  const moveClient = (id: string, direction: "up" | "down") => {
    const updatedClients = clientsService.moveClient(clients, id, direction);
    setClients(updatedClients);
  };

  const handleImageUpload = async (
    clientId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = uploadService.validateFile(file);
    if (!validation.valid) {
      showToast({
        type: "error",
        title: "Invalid File",
        message: validation.error || "Invalid file",
      });
      return;
    }

    setUploading(clientId);

    try {
      const response = await uploadService.uploadImage(file);
      updateClient(clientId, { logo: response.url });
      showToast({
        type: "success",
        title: "Upload Successful",
        message: "Logo uploaded successfully!",
      });
    } catch (error) {
      console.error("Upload error:", error);
      showToast({
        type: "error",
        title: "Upload Failed",
        message: "Failed to upload logo. Please try again.",
      });
    } finally {
      setUploading(null);
    }
  };

  const toggleClientStatus = (id: string) => {
    updateClient(id, { isActive: !clients.find((c) => c.id === id)?.isActive });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col space-y-6">
        <AdminBreadcrumb icon={Users} />
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl"
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="h-80 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600"
                children={undefined}
              ></Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sortedClients = clientsService.sortByPosition(clients);

  return (
    <div className="min-h-screen space-y-6">
      <AdminBreadcrumb icon={Users} />

      {/* Header */}
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Clients Management
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              Manage client logos displayed in the "Our Clients" section
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => fetchClients()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={addClient}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="truncate">Add New Client</span>
          </Button>
          <Button
            onClick={saveClients}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
            ) : (
              <Save className="w-4 h-4 shrink-0" />
            )}
            <span className="truncate">
              {saving ? "Saving..." : "Save All Changes"}
            </span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Clients"
          value={stats.total}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          change={{ value: 12, type: "increase" }}
        />
        <StatsCard
          title="Active Clients"
          value={stats.active}
          icon={<Eye className="w-6 h-6" />}
          color="green"
          change={{ value: 8, type: "increase" }}
        />
        <StatsCard
          title="With Industry"
          value={stats.withIndustry}
          icon={<Building2 className="w-6 h-6" />}
          color="purple"
          change={{ value: 5, type: "increase" }}
        />
        <StatsCard
          title="With Website"
          value={stats.withWebsite}
          icon={<Globe className="w-6 h-6" />}
          color="orange"
          change={{ value: 3, type: "increase" }}
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedClients.map((client, index) => (
          <Card
            key={client.id}
            className="overflow-hidden group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 hover:border-primary-200 dark:hover:border-primary-800"
          >
            <div className="p-6">
              {/* Client Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <span className="font-medium">
                    Position #{client.position}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Status Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleClientStatus(client.id)}
                    className={`p-2 transition-all duration-300 ${
                      client.isActive
                        ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-900/30"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  {/* Move Buttons */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveClient(client.id, "up")}
                    disabled={index === 0}
                    className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveClient(client.id, "down")}
                    disabled={index === sortedClients.length - 1}
                    className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>

                  {/* Edit/Save Toggle */}
                  {editingClient === client.id ? (
                    <Button
                      onClick={() => setEditingClient(null)}
                      size="sm"
                      className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 p-2"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingClient(client.id)}
                      className="p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Delete Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteClient(client.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Client Preview */}
              <div className="mb-6">
                <div className="w-full h-28 bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-600 flex items-center justify-center p-4 group-hover:border-primary-300 dark:group-hover:border-primary-700 transition-all duration-300">
                  {client.logo ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={normalizeImageUrl(client.logo)}
                        alt={`${client.name} logo`}
                        fill
                        className="object-contain filter grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/150x60/6B7280/FFFFFF?text=${encodeURIComponent(client.name.split(" ")[0])}`;
                        }}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        No logo uploaded
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Info */}
              {editingClient === client.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Client Name
                    </label>
                    <Input
                      value={client.name}
                      onChange={(e) =>
                        updateClient(client.id, { name: e.target.value })
                      }
                      placeholder="Enter client name"
                      className="bg-white dark:bg-neutral-700 border-2 focus:border-primary-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Industry
                    </label>
                    <Input
                      value={client.industry || ""}
                      onChange={(e) =>
                        updateClient(client.id, { industry: e.target.value })
                      }
                      placeholder="e.g. Technology, Finance, Healthcare"
                      className="bg-white dark:bg-neutral-700 border-2 focus:border-primary-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Website
                    </label>
                    <Input
                      value={client.website || ""}
                      onChange={(e) =>
                        updateClient(client.id, { website: e.target.value })
                      }
                      placeholder="https://example.com"
                      type="url"
                      className="bg-white dark:bg-neutral-700 border-2 focus:border-primary-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Logo
                    </label>
                    <div className="space-y-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(client.id, e)}
                        className="hidden"
                        id={`logo-upload-${client.id}`}
                        disabled={uploading === client.id}
                      />
                      <label
                        htmlFor={`logo-upload-${client.id}`}
                        className={`inline-flex items-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl text-sm bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 cursor-pointer transition-all duration-300 ${
                          uploading === client.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-primary-400 dark:hover:border-primary-500"
                        }`}
                      >
                        {uploading === client.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {uploading === client.id
                          ? "Uploading..."
                          : "Upload New Logo"}
                      </label>
                      <div className="relative">
                        <Input
                          type="url"
                          placeholder="Or enter logo URL"
                          value={client.logo}
                          onChange={(e) =>
                            updateClient(client.id, { logo: e.target.value })
                          }
                          className="bg-white dark:bg-neutral-700 border-2 focus:border-primary-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      {client.name}
                    </h3>

                    {client.industry && (
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-neutral-500" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {client.industry}
                        </span>
                      </div>
                    )}

                    {client.website && (
                      <div className="mb-4">
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          Visit Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                          client.isActive
                            ? "bg-linear-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-400 shadow-md"
                            : "bg-linear-to-r from-gray-100 to-neutral-100 text-gray-800 dark:from-gray-900/20 dark:to-neutral-900/20 dark:text-gray-400"
                        }`}
                      >
                        {client.isActive ? (
                          <>
                            <Star className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          "Inactive"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-primary-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none rounded-2xl"></div>
          </Card>
        ))}

        {/* Add New Client Card */}
        <Card className="border-2 border-dashed border-gray-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 group cursor-pointer overflow-hidden">
          <div
            className="p-8 h-full flex flex-col items-center justify-center text-center group-hover:bg-linear-to-br group-hover:from-primary-50/50 group-hover:to-purple-50/50 dark:group-hover:from-primary-900/10 dark:group-hover:to-purple-900/10 transition-all duration-300"
            onClick={addClient}
          >
            <div className="w-16 h-16 bg-linear-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Add New Client
            </h3>
            <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-xs">
              Click to add a new client logo to your showcase
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
