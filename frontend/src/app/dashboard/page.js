'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import { syncOfflineRecords } from '@/lib/syncEngine';

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const router = useRouter();

  const loadPatients = async () => {
    try {
      const data = await fetchWithAuth('/patients/');
      setPatients(data.results || data);
    } catch (err) {
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const result = await syncOfflineRecords();
      setSyncStatus(`Synced: ${result.synced}, Failed: ${result.failed}`);
      await loadPatients();
    } catch (err) {
      setSyncStatus('Sync failed. Please check network connection.');
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold">Cardiovascular Research Portal</h1>
          <p className="text-xs text-slate-400">Multi-Modal Clinical Data Intake</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded text-sm font-medium transition"
          >
            {syncing ? 'Syncing...' : 'Sync Offline Records'}
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 rounded text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6">
        {syncStatus && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-md text-sm">
            {syncStatus}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Enrolled Patient Registry</h2>
          <Link
            href="/patients/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            + Register New Patient
          </Link>
        </div>

        {/* Patient Table */}
        {loading ? (
          <p className="text-slate-500">Loading records...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-sm font-semibold">
                  <th className="p-4">Patient Code</th>
                  <th className="p-4">Age / Gender</th>
                  <th className="p-4">Diagnosis</th>
                  <th className="p-4">Residence</th>
                  <th className="p-4">Reports Uploaded</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-400">
                      No patient records found. Click above to register a new record.
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-medium text-indigo-600">{patient.patient_code}</td>
                      <td className="p-4">{patient.age} yrs / {patient.gender}</td>
                      <td className="p-4 font-medium text-slate-800">{patient.diagnosis_type}</td>
                      <td className="p-4 text-slate-600">{patient.residence_area}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                          {patient.reports?.length || 0} files
                        </span>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/patients/${patient.id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}