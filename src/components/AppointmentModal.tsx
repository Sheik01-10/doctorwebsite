import { X, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

/* ================= CONSTANTS ================= */

const ALL_TIME_SLOTS = [
  '07:00 PM',
  '07:10 PM',
  '07:20 PM',
  '07:30 PM',
  '07:40 PM',
  '07:50 PM',
  '08:00 PM',
  '08:10 PM',
  '08:20 PM',
  '08:30 PM',
  '08:40 PM',
  '08:50 PM',
];

/* ================= TYPES ================= */

export interface AppointmentData {
  name: string;
  phone: string;
  date: string; // YYYY-MM-DD
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
  /* 🔒 STATES (ALL AT TOP) */

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    doctor: 'Dr. Saravanan',
  });

  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [isOnLeave, setIsOnLeave] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState('');

  /* ================= DOCTOR LEAVE CHECK ================= */

  useEffect(() => {
    if (!isOpen) return;

    const checkDoctorStatus = async () => {
      try {
        const ref = doc(db, 'doctor_status', 'today');
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setIsOnLeave(snap.data().isOnLeave === true);
          setLeaveMessage(
            snap.data().message || 'Doctor is on leave today'
          );
        } else {
          setIsOnLeave(false);
        }
      } catch {
        setIsOnLeave(false);
      }
    };

    checkDoctorStatus();
  }, [isOpen]);

  /* ================= FETCH BOOKED TIMES ================= */

  useEffect(() => {
    if (!formData.date || isOnLeave) {
      setBookedTimes([]);
      return;
    }

    const fetchBookedTimes = async () => {
      const q = query(
        collection(db, 'appointments'),
        where('date', '==', formData.date)
      );
      const snap = await getDocs(q);
      setBookedTimes(snap.docs.map((d) => d.data().time));
    };

    fetchBookedTimes();
  }, [formData.date, isOnLeave]);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      date: '',
      time: '',
      doctor: 'Dr. Saravanan',
    });
    setBookedTimes([]);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isOnLeave) return;

    setLoading(true);

    try {
      /* 🔴 1. PHONE DUPLICATE CHECK (GLOBAL) */
      const phoneQ = query(
        collection(db, 'appointments'),
        where('phone', '==', formData.phone)
      );
      const phoneSnap = await getDocs(phoneQ);

      if (!phoneSnap.empty) {
        alert('❌ This phone number is already registered');
        setLoading(false);
        return;
      }

      /* 🔴 2. NAME DUPLICATE CHECK (SAME DATE) */
      const nameQ = query(
        collection(db, 'appointments'),
        where('name', '==', formData.name),
        where('date', '==', formData.date)
      );
      const nameSnap = await getDocs(nameQ);

      if (!nameSnap.empty) {
        alert('❌ This name is already registered for today');
        setLoading(false);
        return;
      }

      /* 🔒 3. SLOT CHECK */
      const slotQ = query(
        collection(db, 'appointments'),
        where('date', '==', formData.date),
        where('time', '==', formData.time)
      );
      const slotSnap = await getDocs(slotQ);

      if (!slotSnap.empty) {
        alert('❌ This time slot is already booked');
        setLoading(false);
        return;
      }

      /* 🔢 4. QUEUE NUMBER */
      const queueQ = query(
        collection(db, 'appointments'),
        where('date', '==', formData.date)
      );
      const queueSnap = await getDocs(queueQ);
      const queueNumber = queueSnap.size + 1;

      /* ✅ 5. SAVE */
      const appointment: AppointmentData = {
        ...formData,
        queueNumber,
        status: 'Pending',
      };

      await addDoc(collection(db, 'appointments'), {
        ...appointment,
        createdAt: serverTimestamp(),
      });

      onBooked(appointment);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        resetForm();
        onClose();
      }, 1200);
    } catch {
      alert('❌ Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  /* 🔒 SAFE RETURN */
  if (!isOpen) return null;

  /* ================= UI ================= */

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* DOCTOR LEAVE */}
        {isOnLeave ? (
          <div className="p-10 text-center">
            <Calendar size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-red-600">
              Doctor Unavailable
            </h3>
            <p className="text-gray-700">{leaveMessage}</p>
          </div>
        ) : submitted ? (
          <div className="p-8 text-center">
            <Calendar size={40} className="mx-auto text-green-600 mb-4" />
            <h3 className="text-2xl font-bold">Appointment Booked!</h3>
            <p className="text-gray-600">Please wait for confirmation</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border p-3 rounded-lg"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border p-3 rounded-lg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
             <DatePicker
  selected={formData.date ? new Date(formData.date) : null}
  onChange={(date: Date | null) => {
    if (!date) return;

    // 🔴 SUNDAY CHECK
    if (date.getDay() === 0) {
      alert('❌ Sunday is a holiday. Please select another date.');
      return;
    }

    setFormData({
      ...formData,
      date: date.toISOString().split('T')[0],
      time: '',
    });
  }}
  filterDate={(date: Date) => date.getDay() !== 0} // ❌ Disable Sundays
  dateFormat="dd/MM/yyyy"
  minDate={new Date()}
  placeholderText="DD / MM / YYYY"
  className="border p-3 rounded-lg w-full"
/>

              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="border p-3 rounded-lg"
              >
                <option value="">Select time</option>
                {ALL_TIME_SLOTS.map((t) => (
                  <option key={t} value={t} disabled={bookedTimes.includes(t)}>
                    {t} {bookedTimes.includes(t) ? '(Booked)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              {loading ? 'Booking…' : 'Book Appointment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
