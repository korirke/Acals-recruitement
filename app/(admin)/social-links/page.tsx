"use client";

import { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Plus, Trash2, Edit3, Save, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { api } from '@/lib/apiClient';
import { SocialLink, ApiResponse } from '@/types';
import { getIconComponent } from '@/components/icons/IconRegistry';

export default function AdminSocialLinksManager() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const socialPlatforms = [
    { name: 'LinkedIn', icon: 'Linkedin', placeholder: 'https://linkedin.com/company/your-company' },
    { name: 'Twitter', icon: 'Twitter', placeholder: 'https://twitter.com/yourcompany' },
    { name: 'Facebook', icon: 'Facebook', placeholder: 'https://facebook.com/yourcompany' },
    { name: 'Instagram', icon: 'Instagram', placeholder: 'https://instagram.com/yourcompany' },
    { name: 'YouTube', icon: 'Youtube', placeholder: 'https://youtube.com/@yourcompany' },
    { name: 'GitHub', icon: 'Github', placeholder: 'https://github.com/yourcompany' },
    { name: 'Discord', icon: 'MessageCircle', placeholder: 'https://discord.gg/yourserver' },
    { name: 'Telegram', icon: 'Send', placeholder: 'https://t.me/yourcompany' }
  ];

  const iconOptions = [
    'Linkedin', 'Twitter', 'Facebook', 'Instagram', 'Youtube', 'Github', 
    'MessageCircle', 'Send', 'Globe', 'Share2', 'Link', 'ExternalLink'
  ];

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await api.get<ApiResponse<ApiResponse<SocialLink[]>>>('/social-links');
      const data = response.data?.data || [];
      setSocialLinks(Array.isArray(data) ? data.sort((a: SocialLink, b: SocialLink) => a.position - b.position) : []);
    } catch (error) {
      console.error('Failed to fetch social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSocialLinks = async () => {
    setSaving(true);
    try {
      const cleanedSocialLinks = socialLinks.map(({ id, createdAt, updatedAt, ...link }) => ({
        ...link,
        ...(id.startsWith('temp-') ? {} : { id })
      }));
      
      await api.put('/admin/social-links', { socialLinks: cleanedSocialLinks });
      setEditingId(null);
      await fetchSocialLinks();
      alert('Social links updated successfully!');
    } catch (error) {
      console.error('Failed to save social links:', error);
      alert('Failed to save social links');
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = (platform?: typeof socialPlatforms[0]) => {
    const newLink: SocialLink = {
      id: `temp-${Date.now()}`,
      name: platform?.name || 'Custom Platform',
      icon: platform?.icon || 'Link',
      href: platform?.placeholder || 'https://example.com',
      isActive: true,
      position: socialLinks.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSocialLinks([...socialLinks, newLink]);
    setEditingId(newLink.id);
  };

  const deleteSocialLink = (id: string) => {
    if (confirm('Are you sure you want to delete this social link?')) {
      setSocialLinks(socialLinks => socialLinks.filter(l => l.id !== id));
    }
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setSocialLinks(socialLinks =>
      socialLinks.map(link =>
        link.id === id ? { ...link, ...updates } : link
      )
    );
  };

  const moveSocialLink = (id: string, direction: 'up' | 'down') => {
    const currentIndex = socialLinks.findIndex(l => l.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === socialLinks.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedSocialLinks = [...socialLinks];
    [updatedSocialLinks[currentIndex], updatedSocialLinks[newIndex]] = 
    [updatedSocialLinks[newIndex], updatedSocialLinks[currentIndex]];
    
    updatedSocialLinks.forEach((link, index) => {
      link.position = index + 1;
    });

    setSocialLinks(updatedSocialLinks);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-24 bg-gray-200 dark:bg-neutral-700" children={undefined}></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Social Links Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage social media links ({socialLinks.length} links)
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Social Link
            </Button>
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-2">
                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 px-2">Quick Add:</div>
                {socialPlatforms.slice(0, 4).map((platform) => {
                  const IconComponent = getIconComponent(platform.icon);
                  return (
                    <button
                      key={platform.name}
                      onClick={() => addSocialLink(platform)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      {platform.name}
                    </button>
                  );
                })}
                <hr className="my-2 border-neutral-200 dark:border-neutral-700" />
                <button
                  onClick={() => addSocialLink()}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                >
                  <Plus className="w-4 h-4" />
                  Custom Link
                </button>
              </div>
            </div>
          </div>
          <Button
            onClick={saveSocialLinks}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {socialLinks.map((link, index) => {
          const IconComponent = getIconComponent(link.icon);
          
          return (
            <Card key={link.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                      #{link.position.toString().padStart(2, '0')}
                    </div>
                    
                    <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                      {IconComponent && <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    </div>

                    <div className="flex-1">
                      {editingId === link.id ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                              Platform Name
                            </label>
                            <Input
                              value={link.name}
                              onChange={(e) => updateSocialLink(link.id, { name: e.target.value })}
                              placeholder="Platform name"
                              size="sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                              Icon
                            </label>
                            <select
                              value={link.icon}
                              onChange={(e) => updateSocialLink(link.id, { icon: e.target.value })}
                              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-sm"
                            >
                              {iconOptions.map(icon => (
                                <option key={icon} value={icon}>{icon}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                              URL
                            </label>
                            <Input
                              value={link.href}
                              onChange={(e) => updateSocialLink(link.id, { href: e.target.value })}
                              placeholder="https://..."
                              size="sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white text-sm flex items-center gap-2">
                            {link.name}
                            <ExternalLink className="w-3 h-3 text-neutral-400" />
                          </div>
                          <div className="text-sm text-blue-600 dark:text-blue-400 truncate max-w-md">
                            {link.href}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        link.isActive 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {link.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSocialLink(link.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSocialLink(link.id, 'down')}
                      disabled={index === socialLinks.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    {editingId === link.id ? (
                      <Button
                        onClick={() => setEditingId(null)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(link.id)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSocialLink(link.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {editingId === link.id && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={link.isActive}
                        onChange={(e) => updateSocialLink(link.id, { isActive: e.target.checked })}
                        className="rounded border-neutral-300 dark:border-neutral-600"
                      />
                      <span className="text-sm font-medium">Active</span>
                    </label>
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {socialLinks.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-neutral-400 dark:text-neutral-500">
              <ExternalLink className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No social links yet</h3>
              <p className="mb-4">Connect your social media accounts to display in the footer.</p>
              <Button onClick={() => addSocialLink()} className="flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                Add First Social Link
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
