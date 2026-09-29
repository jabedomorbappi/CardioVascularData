'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';
import { saveOfflinePatient } from '@/lib/db';

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Core Vitals Form State
  const [formData, setFormData] = useState({
    patient_code: `PAT-${Date.now().toString().slice(-6)}`,
    age: '',
    gender: 'M',
    occupation: '',
    residence_area: '',
    diagnosis_type: 'MI',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    ejection_fraction_pct: '',
  });

  // Behavioral & Dietary State (JSON fields)
  const [lifestyle, setLifestyle] = useState({
    sleep_hours: '7',
    screen_time_hours: '4',
    smoking_status: 'No',
  });

  const [dietary, setDietary] = useState({
    street_food_freq_per_week: '3',
    primary_oil_source: 'Mustard / Palm Oil Mix',
  });

  // Scan / Report File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportType, setReportType] = useState('ECG');
  const [reportTitle, setReportTitle] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      age: parseInt(formData.age, 10),
      blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic, 10) : null,
      blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic, 10) : null,
      ejection_fraction_pct: formData.ejection_fraction_pct ? parseFloat(formData.ejection_fraction_pct) : null,
      lifestyle_data: lifestyle,
      dietary_data: dietary,
    };

    try {
      if (navigator.onLine) {
        // 1. Create Patient Record via API
        const createdPatient = await fetchWithAuth('/patients/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        // 2. Upload Medical Scan/File if attached
        if (selectedFile && createdPatient.id) {
          const fileData = new FormData();
          fileData.append('patient', createdPatient.id);
          fileData.append('report_type', reportType);
          fileData.append('title', reportTitle || `${reportType} File`);
          fileData.append('file', selectedFile);

          await fetchWithAuth('/reports/', {
            method: 'POST',
            body: fileData,
          });
        }

        router.push('/dashboard');
      } else {
        // Offline Fallback: Save locally to IndexedDB
        await saveOfflinePatient(payload);
        alert('Saved offline locally. It will sync automatically when back online.');
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Error creating patient record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Clinical Patient Enrollment</h1>
            <p className="text-sm text-slate-500">Multi-Modal Vitals, Lifestyle & Diagnostic File Intake</p>
          </div>
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-800 font-medium text-sm">
            ← Cancel & Return
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Demographics */}
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-3">1. Patient Demographics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Patient Code</label>
                <input
                  type="text"
                  name="patient_code"
                  value={formData.patient_code}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Age (Years)</label>
                <input
                  type="number"
                  name="age"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="e.g. 28"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  required
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="e.g. Software Engineer, Student"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Residence Area</label>
                <input
                  type="text"
                  name="residence_area"
                  required
                  value={formData.residence_area}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="e.g. Foy's Lake, Chattogram"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Vitals */}
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-3">2. Diagnosis & Vitals</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Primary Diagnosis</label>
                <select
                  name="diagnosis_type"
                  value={formData.diagnosis_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="MI">Myocardial Infarction</option>
                  <option value="STROKE">Stroke</option>
                  <option value="BOTH">MI & Stroke</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  name="blood_pressure_systolic"
                  value={formData.blood_pressure_systolic}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  name="blood_pressure_diastolic"
                  value={formData.blood_pressure_diastolic}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="80"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Ejection Fraction (%)</label>
                <input
                  type="number"
                  step="0.1"
                  name="ejection_fraction_pct"
                  value={formData.ejection_fraction_pct}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="55.0"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Diagnostic Scan Upload */}
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-3">3. Attach Scan / PDF Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                >
                  <option value="ECG">ECG Scan</option>
                  <option value="ECHO">Echo Report</option>
                  <option value="EEG">EEG Scan</option>
                  <option value="LIPID">Lipid Profile</option>
                  <option value="BLOOD">Blood Test</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Report Title / Note</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  placeholder="e.g. Admission ECG"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Select File (JPG/PNG/PDF)</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Submitting Record...' : 'Save & Submit Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}