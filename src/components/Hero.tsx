import { Calendar, MessageCircle } from 'lucide-react';
import logo from '../assets/logo.png';

interface HeroProps {
  onGetAppointment: () => void;
}

export default function Hero({ onGetAppointment, }: HeroProps) {
  return (
    <section
      id="home"
      className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="text-center md:text-left">

            {/* LOGO */}
            <div className="flex justify-center md:justify-start mb-6">
              <img
                src={logo}
                alt="Shanmuga Diabetic Clinic"
                className="h-24 sm:h-28 md:h-32 w-auto"
              />
            </div>

            {/* HEADING */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Welcome to
              <br />
              <span className="text-blue-600">
                Shanmuga Diabetic Clinic
              </span>
            </h1>

            {/* CONTACT LINE */}
            <p className="text-base sm:text-lg text-gray-700 mb-4">
              For any query contact:
              <a
                href="tel:8825151522"
                className="ml-2 font-semibold text-blue-600 hover:underline"
              >
                88251 51522
              </a>
            </p>

            {/* DESCRIPTION */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Compassionate diabetes and internal medicine care by an
              experienced medical professional you can trust.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={onGetAppointment}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                <Calendar size={20} />
                Get Appointment
              </button>
            </div>

            {/* CANCEL APPOINTMENT – WHATSAPP */}
            <a
              href="https://wa.me/918825151522?text=Hello%20Doctor%2C%20I%20want%20to%20cancel%20my%20appointment"
              target="_blank"
              rel="noopener noreferrer"
               className="mt-5 inline-flex items-center gap-1 text-lg sm:text-xl font-bold text-green-600 justify-center md:justify-start"
            >
              <MessageCircle size={20} />
              If any cancel appointment, click here
            </a>

          </div>

          {/* RIGHT SIDE (future use) */}
          {/*
          <div className="hidden md:flex justify-center">
            <img src="/doctor.png" alt="Doctor" className="max-h-[450px]" />
          </div>
          */}

        </div>
      </div>
    </section>
  );
}
