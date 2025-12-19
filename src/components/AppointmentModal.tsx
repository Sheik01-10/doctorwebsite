import { X, Calendar, Clock, User, Phone } from 'lucide-react';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBooked: (data: any) => void; // 🔥 IMPORTANT
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onBooked,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    doctor: 'Dr. Saravanan',
    reason: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 SAVE TO FIRESTORE (ADMIN LIVE UPDATE)
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'Pending',
      });

      // 🔥 TRIGGER POPUP IN HOME
      onBooked(formData);

      setSubmitted(true);

      // close modal after short delay
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          phone: '',
          date: '',
          time: '',
          doctor: 'Dr. Saravanan',
          reason: '',
        });
        onClose();
      }, 1200);

    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* SUCCESS */}
        {submitted ? (
          <div className="p-8 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Appointment Booked!
            </h3>
            <p className="text-gray-600 text-lg">
              Please wait while we confirm your appointment.
            </p>
          </div>
        ) : (
          /* FORM */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <User size={16} className="inline mr-1" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Phone size={16} className="inline mr-1" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Calendar size={16} className="inline mr-1" /> Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Clock size={16} className="inline mr-1" /> Time
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg"
                >
                  <option value="">Select time</option>
                  <option value="07:00 PM">07:00 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="09:00 PM">09:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
