# 🫀 Cardiovascular Research Portal

An enterprise-grade, offline-first clinical web application designed for cardiovascular data collection, patient management, and real-time medical record synchronization. Built with a decoupled **Django REST Framework** backend and a high-performance **Next.js 14 App Router** frontend.

---

## 🌟 Key Features

* **🔐 Role-Based Access Control (RBAC):** 
  * **Data Collectors / Field Researchers:** Securely record, edit, and access only their self-collected patient registries.
  * **Superusers / System Admins:** Complete system-wide overview, metric dashboards, and patient record management across all collectors.
* **⚡ Offline-First Architecture:** Local sync engine (`syncEngine.js`) enables uninterrupted patient data intake in low-connectivity environments, automatically queueing and syncing records when back online.
* **📊 Live Dashboard Metrics:** Real-time patient collection counts, diagnostic summaries, and user status indicators.
* **🛡️ JWT Authentication:** Secure session handling with auto-refresh mechanisms and token storage.
* **🎨 Modern UI/UX:** Built with Tailwind CSS, supporting clean data tables, responsive navigation, and dynamic state loaders.

---

## 🛠️ Tech Stack

### **Backend**
* **Framework:** Python 3.x / Django 5.x
* **API Engine:** Django REST Framework (DRF)
* **Authentication:** SimpleJWT (JSON Web Tokens)
* **Database:** PostgreSQL (Production) / SQLite (Development)

### **Frontend**
* **Framework:** Next.js 14 (App Router)
* **Library:** React 18
* **Styling:** Tailwind CSS
* **Icons & UI Utilities:** Lucide React / Headless UI

---

## 📁 Repository Structure

```text
cardio-research-system/
├── backend/
│   ├── apps/
│   │   ├── authentication/    # Custom user authentication & JWT serializers
│   │   └── patients/          # Patient models, viewsets, and DRF routes
│   ├── config/                # Django settings and root URL routing
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js App Router (Dashboard, Patient Forms, Auth)
│   │   └── lib/               # API clients, auth helpers, and offline sync engine
│   └── package.json
└── README.md
