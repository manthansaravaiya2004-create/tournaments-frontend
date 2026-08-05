'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminFilesPage() {
  const { user, token, loading } = useAuth();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'superadmin' && token) {
      loadFiles();
    }
  }, [user, token]);

  const loadFiles = async () => {
    try {
      const data = await api.adminListFiles(token);
      setFiles(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${filename}?`)) return;
    setBusy(true);
    try {
      await api.adminDeleteFile(filename, token);
      setFiles(files.filter(f => f.name !== filename));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return '🖼️';
    if (ext === 'pdf') return '📕';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return '📗';
    if (['doc', 'docx', 'txt'].includes(ext)) return '📄';
    return '📁';
  };

  if (loading) return null;

  if (!user || user.role !== 'superadmin') {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-xl font-semibold text-mist-100">Super Admin access required</h1>
        <p className="mt-2 text-sm text-mist-400">This page is restricted to super admin accounts.</p>
      </div>
    );
  }

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5000';

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-mist-100 mb-2">File Manager</h1>
          <p className="mt-1 text-sm text-mist-400">View and manage all uploaded files in the system.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-mist-400">Total Files</p>
          <p className="font-mono text-2xl text-mist-100">{files.length}</p>
        </div>
      </div>

      {error && <p className="mb-6 rounded-md bg-signal-red/10 p-3 text-sm text-signal-red border border-signal-red/20">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-ink-700 bg-ink-900/50">
        <table className="min-w-full divide-y divide-ink-700 text-sm">
          <thead className="bg-ink-950/50">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-mist-400">File</th>
              <th className="px-5 py-3 text-left font-medium text-mist-400">Size</th>
              <th className="px-5 py-3 text-left font-medium text-mist-400">Uploaded</th>
              <th className="px-5 py-3 text-right font-medium text-mist-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700">
            {files.length === 0 && (
              <tr>
                <td colSpan="4" className="px-5 py-8 text-center text-mist-400">
                  No files found in the uploads directory.
                </td>
              </tr>
            )}
            {files.map(file => (
              <tr key={file.name} className="hover:bg-ink-800/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getFileIcon(file.name)}</span>
                    <a 
                      href={`${API_BASE}${file.url}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="font-medium text-mist-100 hover:text-signal-teal transition-colors"
                    >
                      {file.name}
                    </a>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-mist-400">{formatSize(file.size)}</td>
                <td className="px-5 py-3 text-mist-400">{new Date(file.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <a
                    href={`${API_BASE}${file.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mr-4 text-mist-200 hover:text-white transition-colors"
                  >
                    View
                  </a>
                  <button 
                    onClick={() => handleDelete(file.name)}
                    disabled={busy}
                    className="text-signal-red hover:text-red-400 disabled:opacity-30 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
