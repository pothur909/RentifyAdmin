

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';
import { Upload, Download, FileSpreadsheet, CheckCircle, X } from 'lucide-react';

const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';

export default function BulkLeadsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stats, setStats] = useState<{ totalRows: number; created: number; failed: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setMessage(null);
    setStats(null);
  };

  const handleDownloadTemplate = () => {
    // just hit backend static file
    window.location.href = `${baseurl}/lead-bulk-template.xlsx`;
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select an Excel file' });
      return;
    }

    setUploading(true);
    setMessage(null);
    setStats(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${baseurl}/api/leads/bulk-upload`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to upload leads');
      }

      setStats(json.stats || null);
      setMessage({
        type: 'success',
        text: `Bulk upload completed. Created: ${json.stats?.created || 0}, Failed: ${json.stats?.failed || 0}`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload leads' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Bulk Upload Leads</h1>
          <button
            onClick={() => router.push('/leads')}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Back to leads
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-5">
          {/* Step 1 */}
          <div className="flex items-center gap-3 mb-2">
            <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="font-semibold text-slate-800">Step 1: Download template</p>
              <p className="text-sm text-slate-500">
                Template already has dropdowns for flatType and areaKey. One row per lead.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            <Download className="w-4 h-4" />
            Download Excel template
          </button>

          <div className="mt-3 text-xs text-slate-600 space-y-1 border border-slate-100 rounded-xl p-3 bg-slate-50">
            <p><span className="font-semibold">Required columns:</span> name, phoneNumber</p>
            <p><span className="font-semibold">phoneNumber:</span> with +91, example <span className="font-mono">+919876543210</span></p>
            <p><span className="font-semibold">address:</span> you can keep <span className="font-mono">Bangalore</span> for all rows</p>
            <p><span className="font-semibold">flatType:</span> select from dropdown in Excel</p>
            <p><span className="font-semibold">areaKey:</span> select from dropdown in Excel</p>
            <p><span className="font-semibold">budget:</span> number only, example <span className="font-mono">25000</span></p>
          </div>

          {/* Step 2 */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <p className="font-semibold text-slate-800">Step 2: Upload filled file</p>

            <label className="mt-2 flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-300 rounded-2xl p-6 cursor-pointer hover:border-indigo-500 hover:bg-slate-50 transition-colors">
              <Upload className="w-6 h-6 text-slate-500 mb-2" />
              <span className="text-sm text-slate-700">
                {file ? file.name : 'Click to choose Excel file (.xlsx, .xls)'}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </label>

            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload and create leads</span>
                </>
              )}
            </button>
          </div>

          {message && (
            <div
              className={`mt-3 p-3 rounded-xl flex items-start gap-2 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 mt-0.5" />
              ) : (
                <X className="w-4 h-4 mt-0.5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {stats && (
            <div className="mt-2 text-xs text-slate-600">
              <p>Total rows: {stats.totalRows}</p>
              <p>Created: {stats.created}</p>
              <p>Failed: {stats.failed}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
