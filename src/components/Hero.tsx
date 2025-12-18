import { Calendar, Users } from 'lucide-react';
import logo from '../assets/logo.png';

interface HeroProps {
  onGetAppointment: () => void;
  onViewQueue: () => void;
}

export default function Hero({ onGetAppointment, onViewQueue }: HeroProps) {
  return (
    <section
      id="home"
      className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Text + Logo */}
          <div className="text-center md:text-left">

            {/* LOGO */}
            <div className="flex justify-center md:justify-start mb-6">
              <img
                src={logo}
                alt="Shanmuga Diabetic Centre"
                className="h-24 sm:h-28 md:h-32 w-auto"
              />
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Welcome to
              <br />
              <span className="text-blue-600">
                Shanmuga Diabetic Clinic
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Compassionate diabetes and internal medicine care by an
              experienced medical professional you can trust.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={onGetAppointment}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                <Calendar size={20} />
                Get Appointment
              </button>

              <button
                onClick={onViewQueue}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-blue-600"
              >
                <Users size={20} />
                View Queue
              </button>
            </div>
          </div>

          {/* Right side reserved */}
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
