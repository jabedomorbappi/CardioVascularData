'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';

export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatientDetails() {
      try {
        const data = await fetchWithAuth(`/patients/${id}/`);
        setPatient(data);
      } catch (err) {
        console.error('Error fetching patient details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadPatientDetails();
  }, [id]);

  if (loading) return <div className="p-8 text-slate-500">Loading patient details...</div>;
  if (!patient) return <div className="p-8 text-red-500">Patient record not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-800 font-medium text-sm">
            ← Return to Dashboard
          </Link>
          <span className="font-mono bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded">
            {patient.patient_code}
          </span>
        </div>

        {/* Patient Profile Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Patient Dossier</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
            <div>
              <span className="text-slate-400 block text-xs">AGE & GENDER</span>
              <span className="font-semibold">{patient.age} years ({patient.gender})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">DIAGNOSIS</span>
              <span className="font-semibold text-red-600">{patient.diagnosis_type}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">BLOOD PRESSURE</span>
              <span className="font-semibold">{patient.blood_pressure_systolic}/{patient.blood_pressure_diastolic} mmHg</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">EJECTION FRACTION</span>
              <span className="font-semibold">{patient.ejection_fraction_pct ? `${patient.ejection_fraction_pct}%` : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Reports Gallery */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Uploaded Diagnostic Scans & PDFs</h2>
          {patient.reports?.length === 0 ? (
            <p className="text-sm text-slate-400">No medical scans uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patient.reports.map((report) => (
                <div key={report.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs font-bold text-indigo-600 uppercase">{report.report_type}</span>
                  <p className="text-sm font-medium text-slate-800 mt-1">{report.title || 'Diagnostic Report'}</p>
                  <a
                    href={report.file}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition"
                  >
                    View File
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}