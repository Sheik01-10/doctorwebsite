import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.png';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-3"
            >
              <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
              <span className="text-lg font-bold text-blue-600">
                Shanmuga Diabetic Centre
              </span>
            </button>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex space-x-8">
              <NavBtn label="Home" onClick={() => scrollToSection('home')} />
              <NavBtn label="About Us" onClick={() => scrollToSection('about')} />
              <NavBtn label="Doctors" onClick={() => scrollToSection('doctors')} />
              <NavBtn label="Appointments" onClick={() => scrollToSection('appointments')} />
              <NavBtn label="Contact" onClick={() => scrollToSection('location')} />
            </div>

            {/* MOBILE MENU ICON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg border-t">
            <div className="flex flex-col px-6 py-4 space-y-4 font-medium text-gray-700">

              <MenuItem label="Home" onClick={() => scrollToSection('home')} />
              <MenuItem label="About Us" onClick={() => scrollToSection('about')} />
              <MenuItem label="Doctors" onClick={() => scrollToSection('doctors')} />
              <MenuItem label="Appointments" onClick={() => scrollToSection('appointments')} />
              <MenuItem label="Contact" onClick={() => scrollToSection('location')} />

              {/* ADMIN BUTTON */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/admin';
                }}
                className="mt-4 bg-red-600 text-white py-2 rounded-lg font-semibold text-center"
              >
                Admin Login
              </button>

            </div>
          </div>
        )}
      </nav>
    </>
  );
}

function NavBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-gray-700 hover:text-blue-600 font-medium"
    >
      {label}
    </button>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left hover:text-blue-600"
    >
      {label}
    </button>
  );
}
