import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Doctors from './components/Doctors';
import Location from './components/Location';
import AppointmentModal from './components/AppointmentModal';
import QueueModal from './components/QueueModal';
import AppointmentPopup from './components/AppointmentPopup';

// appointment type
interface Appointment {
  name: string;
  phone: string;
  date: string;
  time: string;
  doctor: string;
  reason?: string;
}

function App() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);

  // 🔹 popup state
  const [latestAppointment, setLatestAppointment] = useState<Appointment | null>(null);

  // 🔹 load saved appointment on page load
  useEffect(() => {
    const saved = localStorage.getItem('latestAppointment');
    if (saved) {
      setLatestAppointment(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <Hero
        onGetAppointment={() => setIsAppointmentModalOpen(true)}
        onViewQueue={() => setIsQueueModalOpen(true)}
      />

      <About />
      <Doctors />
      <Location />

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 Shanmuga Diabetic Clinic. All rights reserved.
            Providing quality healthcare with compassion.
          </p>
        </div>
      </footer>

      {/* BOOK APPOINTMENT MODAL */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />

      {/* QUEUE MODAL */}
      <QueueModal
        isOpen={isQueueModalOpen}
        onClose={() => setIsQueueModalOpen(false)}
      />

      {/* 🔥 APPOINTMENT BOOKED POPUP */}
      {latestAppointment && (
        <AppointmentPopup
          data={latestAppointment}
          onClose={() => {
            setLatestAppointment(null);
            localStorage.removeItem('latestAppointment');
          }}
        />
      )}
    </div>
  );
}

export default App;
