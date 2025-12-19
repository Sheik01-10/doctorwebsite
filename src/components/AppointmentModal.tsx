import { X, Calendar, Clock, User, Phone } from 'lucide-react';
import { useState } from 'react';
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';

/* ================= TYPES ================= */

export interface AppointmentData {
  name: string;
  phone: string;
  date: string;
  time: string;
  doctor: string;
  queueNumber: number;
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBooked: (data: AppointmentData) => void;
}

/* ================= COMPONENT ================= */

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
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      date: '',
      time: '',
      doctor: 'Dr. Saravanan',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      /* 🔒 1. CHECK SLOT AVAILABILITY */
      const slotQuery = query(
        collection(db, 'appointments'),
        where('date', '==', formData.date),
        where('time', '==', formData.time)
      );

      const slotSnap = await getDocs(slotQuery);

      if (!slotSnap.empty) {
        alert('❌ This time slot is already booked. Please choose another.');
        setLoading(false);
        return;
      }

      /* 🔢 2. GENERATE QUEUE NUMBER (DATE BASED) */
      const queueQuery = query(
        collection(db, 'appointments'),
        where('date', '==', formData.date)
      );

      const queueSnap = await getDocs(queueQuery);
      const queueNumber = queueSnap.size + 1;

      /* ✅ 3. SAVE TO FIRESTORE */
      const appointment: AppointmentData = {
        ...formData,
        queueNumber,
        status: 'Pending',
      };

      await addDoc(collection(db, 'appointments'), {
        ...appointment,
        createdAt: serverTimestamp(),
      });

      /* 🔥 4. TRIGGER SUCCESS POPUP */
      onBooked(appointment);

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        resetForm();
        onClose();
      }, 1200);
    } catch (err) {
      alert('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* SUCCESS */}
        {submitted ? (
          <div className="p-8 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Appointment Booked!
            </h3>
            <p className="text-gray-600">
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
                  <option>07:00 PM</option>
                  <option>07:10 PM</option>
                  <option>07:20 PM</option>
                  <option>07:30 PM</option>
                  <option>07:40 PM</option>
                  <option>07:50 PM</option>
                  <option>08:00 PM</option>
                  <option>08:10 PM</option>
                  <option>08:20 PM</option>
                  <option>08:30 PM</option>
                  <option>08:40 PM</option>
                  <option>08:50 PM</option>
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
