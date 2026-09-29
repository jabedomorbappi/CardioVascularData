import { getPendingOfflinePatients, openOfflineDB } from './db';
import { fetchWithAuth } from './api';

export async function syncOfflineRecords() {
  if (!navigator.onLine) return { synced: 0, failed: 0 };

  const pending = await getPendingOfflinePatients();
  if (pending.length === 0) return { synced: 0, failed: 0 };

  let syncedCount = 0;
  let failedCount = 0;

  const db = await openOfflineDB();

  for (const record of pending) {
    try {
      const { local_id, synced, ...patientPayload } = record;
      await fetchWithAuth('/patients/', {
        method: 'POST',
        body: JSON.stringify(patientPayload),
      });

      // Remove from IndexedDB on successful sync
      const tx = db.transaction('pending_patients', 'readwrite');
      tx.objectStore('pending_patients').delete(local_id);
      syncedCount++;
    } catch (err) {
      console.error(`Failed to sync offline record ${record.local_id}:`, err);
      failedCount++;
    }
  }

  return { synced: syncedCount, failed: failedCount };
}