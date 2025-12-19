import { useEffect } from 'react';

import Hero from './Hero';
import About from './About';
import Doctors from './Doctors';
import Location from './Location';

interface Props {
  openAppointment: () => void;
  openQueue: () => void;
}

export default function HomePage({
  openAppointment,
  openQueue,
}: Props) {

  useEffect(() => {
    // 🔥 DIRECT URL CHECK (NETLIFY SAFE)
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source');

    if (source === 'qr') {
      // small delay to ensure modal state ready
      setTimeout(() => {
        openAppointment();
      }, 300);
    }
  }, [openAppointment]);

  return (
    <>
      <Hero
        onGetAppointment={openAppointment}
        onViewQueue={openQueue}
      />
      <About />
      <Doctors />
      <Location />
    </>
  );
}
