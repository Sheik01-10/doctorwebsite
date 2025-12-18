import { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Doctors from './components/Doctors';
import Location from './components/Location';
import AppointmentModal from './components/AppointmentModal';
import QueueModal from './components/QueueModal';

function App() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);

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
            &copy; 2025 Shanmuga Diabetic Clinic. All rights reserved. Providing quality healthcare with compassion.
          </p>
        </div>
      </footer>

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
      <QueueModal
        isOpen={isQueueModalOpen}
        onClose={() => setIsQueueModalOpen(false)}
      />
    </div>
  );
}

export default App;
