import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Doctors from './components/Doctors';
import Location from './components/Location';
import AppointmentModal from './components/AppointmentModal';
import QueueModal from './components/QueueModal';
import AppointmentPopup from './components/AppointmentPopup';

// 🔐 ADMIN
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// appointment type
interface Appointment {
  name: string;
  phone: string;
  date: string;
  time: string;
  doctor: string;
  reason?: string;
}

export default function App() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [latestAppointment, setLatestAppointment] =
    useState<Appointment | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <Routes>
        {/* 🏠 HOME */}
        <Route
          path="/"
          element={
            <>
              <Hero
                onGetAppointment={() => setIsAppointmentModalOpen(true)}
                onViewQueue={() => setIsQueueModalOpen(true)}
              />
              <About />
              <Doctors />
              <Location />
            </>
          }
        />

        {/* 🔐 ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🔒 ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* FOOTER (ALL PAGES) */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2025 Shanmuga Diabetic Clinic. All rights reserved.
          </p>
        </div>
      </footer>

      {/* BOOK APPOINTMENT MODAL */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onBooked={(data) => setLatestAppointment(data)}
      />

      {/* QUEUE MODAL */}
      <QueueModal
        isOpen={isQueueModalOpen}
        onClose={() => setIsQueueModalOpen(false)}
      />

      {/* 🔥 SUCCESS POPUP */}
      {latestAppointment && (
        <AppointmentPopup
          data={latestAppointment}
          onClose={() => setLatestAppointment(null)}
        />
      )}
    </div>
  );
}
