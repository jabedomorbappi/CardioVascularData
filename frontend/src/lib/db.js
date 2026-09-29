// IndexedDB setup for offline field data collection
const DB_NAME = 'CardioResearchOfflineDB';
const DB_VERSION = 1;

export function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending_patients')) {
        db.createObjectStore('pending_patients', { keyPath: 'local_id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('pending_reports')) {
        db.createObjectStore('pending_reports', { keyPath: 'local_id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflinePatient(patientData) {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending_patients', 'readwrite');
    const store = tx.objectStore('pending_patients');
    const req = store.add({ ...patientData, synced: false, created_at: new Date().toISOString() });

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingOfflinePatients() {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending_patients', 'readonly');
    const store = tx.objectStore('pending_patients');
    const req = store.getAll();

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}