// src/components/admin/InquiryDetailModal.tsx
'use client';

import React, { useState } from 'react';
import { X, Save, Trash2, Clock, Mail, User, MessageSquare, Calendar } from 'lucide-react';
import { useContactInquiry } from '@/hooks/useContact';

interface InquiryDetailModalProps {
  inquiryId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export default function InquiryDetailModal({ inquiryId, onClose, onUpdate }: InquiryDetailModalProps) {
  const { inquiry, loading, updating, updateInquiry, deleteInquiry } = useContactInquiry(inquiryId);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  React.useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status);
      setNotes(inquiry.notes || '');
    }
  }, [inquiry]);

  const handleUpdate = async () => {
    const success = await updateInquiry({ status, notes });
    if (success) {
      onUpdate();
      onClose();
    }
  };

  const handleDelete = async () => {
    const success = await deleteInquiry();
    if (success) {
      onUpdate();
      onClose();
    }
  };

  if (loading || !inquiry) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Inquiry Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Name</div>
                  <div className="font-semibold text-neutral-900 dark:text-white">
                    {inquiry.fullName} {inquiry.lastName}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Email</div>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {inquiry.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Inquiry Type</div>
                  <div className="font-semibold text-neutral-900 dark:text-white">{inquiry.inquiry}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Submitted</div>
                  <div className="font-semibold text-neutral-900 dark:text-white">
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4">
              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Message
              </div>
              <p className="text-neutral-900 dark:text-white whitespace-pre-wrap">{inquiry.message}</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Add internal notes about this inquiry..."
              />
            </div>

            {/* Metadata */}
            {inquiry.metadata && (
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4">
                <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                  Submission Details
                </div>
                <div className="space-y-2 text-xs">
                  {inquiry.metadata.userAgent && (
                    <div>
                      <span className="text-neutral-600 dark:text-neutral-400">User Agent: </span>
                      <span className="text-neutral-900 dark:text-white font-mono">
                        {inquiry.metadata.userAgent}
                      </span>
                    </div>
                  )}
                  {inquiry.metadata.ipAddress && (
                    <div>
                      <span className="text-neutral-600 dark:text-neutral-400">IP Address: </span>
                      <span className="text-neutral-900 dark:text-white font-mono">
                        {inquiry.metadata.ipAddress}
                      </span>
                    </div>
                  )}
                  {inquiry.metadata.referer && (
                    <div>
                      <span className="text-neutral-600 dark:text-neutral-400">Referer: </span>
                      <span className="text-neutral-900 dark:text-white font-mono">
                        {inquiry.metadata.referer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                Delete Inquiry?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                This action cannot be undone. Are you sure you want to delete this inquiry?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
