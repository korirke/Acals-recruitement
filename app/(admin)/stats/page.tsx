"use client";

import { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { IconPicker } from '@/components/ui/IconPicker';
import { useToast } from '@/components/admin/ui/Toast';
import {
  Plus,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  GripVertical,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { api } from '@/lib/apiClient';
import { Stat, ApiResponse } from '@/types';
import { getIconComponent } from '@/components/icons/IconRegistry';

export default function AdminStatsManager() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<Stat[]>>('/stats');
      const data = response.data || response;
      setStats(Array.isArray(data) ? data.sort((a: Stat, b: Stat) => a.position - b.position) : []);
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      const errorMessage = error?.message || 'Failed to connect to backend server';
      setError(errorMessage);
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveStats = async () => {
    setSaving(true);
    try {
      const cleanedStats = stats.map(({ id, createdAt, updatedAt, ...stat }) => ({
        ...stat,
        ...(id.startsWith('temp-') ? {} : { id })
      }));
      
      await api.put('/admin/stats', { stats: cleanedStats });
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Statistics updated successfully!',
      });
      
      setEditingId(null);
      await fetchStats();
    } catch (error: any) {
      console.error('Failed to save stats:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: error?.message || 'Failed to save statistics',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteStatItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this statistic?')) {
      try {
        if (!id.startsWith('temp-')) {
          await api.delete(`/admin/stats/${id}`);
        }
        setStats(stats => stats.filter(s => s.id !== id));
        showToast({
          type: 'success',
          title: 'Deleted',
          message: 'Statistic deleted successfully',
        });
      } catch (error: any) {
        console.error('Failed to delete stat:', error);
        showToast({
          type: 'error',
          title: 'Delete Failed',
          message: error?.message || 'Failed to delete statistic',
        });
      }
    }
  };

  const addStat = () => {
    const newStat: Stat = {
      id: `temp-${Date.now()}`,
      number: '100+',
      label: 'New Statistic',
      icon: 'TrendingUp',
      color: 'text-primary-600',
      isActive: true,
      position: stats.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStats([...stats, newStat]);
    setEditingId(newStat.id);
  };

  const updateStat = (id: string, updates: Partial<Stat>) => {
    setStats(stats =>
      stats.map(stat =>
        stat.id === id ? { ...stat, ...updates } : stat
      )
    );
  };

  const moveStat = (id: string, direction: 'up' | 'down') => {
    const currentIndex = stats.findIndex(s => s.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === stats.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedStats = [...stats];
    [updatedStats[currentIndex], updatedStats[newIndex]] = 
    [updatedStats[newIndex], updatedStats[currentIndex]];
    
    updatedStats.forEach((stat, index) => {
      stat.position = index + 1;
    });

    setStats(updatedStats);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <Card className="p-16 text-center border-2 border-red-200 dark:border-red-800">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Backend Connection Error
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {error}
            </p>
            <Button
              onClick={fetchStats}
              className="flex items-center gap-2 mx-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Statistics Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
            Manage website statistics and achievements • {stats.length} statistics
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={addStat}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Statistic
          </Button>
          <Button
            onClick={saveStats}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      {/* Statistics List */}
      <div className="space-y-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon ? getIconComponent(stat.icon) : null;
          
          return (
            <Card
              key={stat.id}
              className="overflow-hidden border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl"
            >
              <div className="p-6 bg-linear-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/10 dark:to-blue-900/10 border-b border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <GripVertical className="w-5 h-5 text-neutral-400 shrink-0" />
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 font-mono bg-white dark:bg-neutral-800 px-3 py-1 rounded-full shrink-0">
                      #{stat.position}
                    </div>

                    {IconComponent && (
                      <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}

                    {editingId === stat.id ? (
                      <div className="space-y-2 flex-1 min-w-0">
                        <Input
                          value={stat.number}
                          onChange={(e) => updateStat(stat.id, { number: e.target.value })}
                          className="font-bold text-xl"
                          placeholder="5,000+"
                        />
                        <Input
                          value={stat.label}
                          onChange={(e) => updateStat(stat.id, { label: e.target.value })}
                          placeholder="Companies Trust Us"
                        />
                      </div>
                    ) : (
                      <div className="min-w-0 flex-1">
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                          {stat.number}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                          {stat.label}
                        </p>
                      </div>
                    )}

                    <label className="flex items-center gap-2 text-sm bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 shrink-0">
                      <input
                        type="checkbox"
                        checked={stat.isActive}
                        onChange={(e) => updateStat(stat.id, { isActive: e.target.checked })}
                        className="rounded border-neutral-300 dark:border-neutral-600 text-green-600 focus:ring-green-500"
                      />
                      <span className="font-medium">Active</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveStat(stat.id, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveStat(stat.id, 'down')}
                      disabled={index === stats.length - 1}
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    {editingId === stat.id ? (
                      <Button
                        onClick={() => setEditingId(null)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        title="Save"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(stat.id)}
                        title="Edit"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteStatItem(stat.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {editingId === stat.id && (
                <div className="p-6">
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                        Icon (Optional)
                      </label>
                      <IconPicker
                        value={stat.icon || ''}
                        onChange={(icon) => updateStat(stat.id, { icon })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Number/Value
                      </label>
                      <Input
                        value={stat.number}
                        onChange={(e) => updateStat(stat.id, { number: e.target.value })}
                        placeholder="e.g., 5,000+ or 99%"
                      />
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Use + suffix or % for better visual impact
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Label/Description
                      </label>
                      <Input
                        value={stat.label}
                        onChange={(e) => updateStat(stat.id, { label: e.target.value })}
                        placeholder="e.g., Companies Trust Us"
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        {stats.length === 0 && (
          <Card className="p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                No statistics yet
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Start showcasing your achievements by adding your first statistic.
              </p>
              <Button
                onClick={addStat}
                className="flex items-center gap-2 mx-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4" />
                Add First Statistic
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
