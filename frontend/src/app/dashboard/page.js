'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import { syncOfflineRecords } from '@/lib/syncEngine';

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const router = useRouter();

  const loadInitialData = async () => {
    try {
      const userProfile = await fetchWithAuth('/auth/me/');
      setCurrentUser(userProfile);

      const patientData = await fetchWithAuth('/patients/');
      setPatients(patientData.results || patientData);
    } catch (err) {
      console.error('Failed to load user or patients:', err);
    } font-finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const result = await syncOfflineRecords();
      setSyncStatus(`Synced: ${result.synced}, Failed: ${result.failed}`);
      await loadInitialData();
    } catch (err) {
      setSyncStatus('Sync failed. Check network connection.');
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
      {/* Header */}
      <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold">Cardiovascular Research Portal</h1>
          <p className="text-xs text-slate-400">
            Collector: <span className="text-indigo-300 font-semibold">{currentUser?.username || 'Loading...'}</span> 
            {currentUser?.is_staff && <span className="ml-2 bg-indigo-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Admin</span>}
          </p>
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

      {/* Main Area */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {syncStatus && (
          <div className="p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-md text-sm">
            {syncStatus}
          </div>
        )}

        {/* Collection Metric Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              {currentUser?.is_staff ? 'Total System Records' : 'My Total Records Collected'}
            </span>
            <div className="text-3xl font-bold text-slate-800 mt-1">{patients.length} Records</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {currentUser?.is_staff ? 'System-Wide Patient Registry' : 'My Collection Registry'}
          </h2>
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
                  <th className="p-4">Collector</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-400">
                      No records found for your account.
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-medium text-indigo-600">{patient.patient_code}</td>
                      <td className="p-4">{patient.age} yrs / {patient.gender}</td>
                      <td className="p-4 font-medium text-slate-800">{patient.diagnosis_type}</td>
                      <td className="p-4 text-slate-600">{patient.residence_area}</td>
                      <td className="p-4 font-medium text-slate-700">{patient.collected_by_username || 'Self'}</td>
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