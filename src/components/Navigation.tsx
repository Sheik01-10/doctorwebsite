import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // 🔐 CHECK ADMIN LOGIN STATE (optional – future use)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });
    return () => unsub();
  }, []);

  // ✅ WORKING SCROLL FOR ALL PAGES
  const scrollToSection = (id: string) => {
    setIsOpen(false);

    // 🔥 if not on home page, go home first
    if (window.location.pathname !== '/') {
      navigate('/');

      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const yOffset = -70; // navbar height
          const y =
            el.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 400); // wait for home to render
    } else {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -70;
        const y =
          el.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3"
          >
            <img
              src={logo}
              alt="Shanmuga Diabetic Clinic"
              className="h-9 w-9 object-contain"
            />
            <span className="text-lg font-bold text-blue-600">
              Shanmuga Diabetic Clinic
            </span>
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex space-x-8 items-center">
            <NavBtn label="Home" onClick={() => scrollToSection('home')} />
            <NavBtn label="About Us" onClick={() => scrollToSection('about')} />
            <NavBtn label="Doctors" onClick={() => scrollToSection('doctors')} />
            <NavBtn label="Contact" onClick={() => scrollToSection('location')} />

            {/* ADMIN LOGIN */}
            <button
              onClick={() => navigate('/admin/login')}
              className="text-red-600 font-semibold"
            >
              Admin Login
            </button>
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

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="flex flex-col px-6 py-4 space-y-4 font-medium text-gray-700">

            <MenuItem label="Home" onClick={() => scrollToSection('home')} />
            <MenuItem label="About Us" onClick={() => scrollToSection('about')} />
            <MenuItem label="Doctors" onClick={() => scrollToSection('doctors')} />
            <MenuItem label="Contact" onClick={() => scrollToSection('location')} />

            {/* UNIQUE ADMIN BUTTON */}
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/admin/login');
              }}
              className="mt-6 bg-red-600 text-white py-3 rounded-xl
                         font-bold shadow-md hover:bg-red-700 transition"
            >
              Admin Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* REUSABLE */
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
