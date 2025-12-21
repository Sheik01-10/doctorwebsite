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
  '07:00 PM','07:10 PM','07:20 PM','07:30 PM','07:40 PM','07:50 PM',
  '08:00 PM','08:10 PM','08:20 PM','08:30 PM','08:40 PM','08:50 PM',
];

/* ================= TYPES ================= */

export interface AppointmentData {
  name: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string;
  doctor: string;
  queueNumber: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBooked: (data: AppointmentData) => void;
}

/* ================= HELPERS ================= */

/** ✅ TypeScript-safe Sunday check */
const isSunday = (date: Date | null): boolean => {
  if (!date) return false;
  return date.getDay() === 0;
};

const isDoctorOnLeave = async (dateStr: string) => {
  const snap = await getDoc(doc(db, 'doctor_leaves', dateStr));
  return snap.exists();
};

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

  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [isOnLeave, setIsOnLeave] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState('');

  /* 🔄 RESET WHEN MODAL OPENS */
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setLoading(false);
      setBookedTimes([]);
      setIsOnLeave(false);
      setLeaveMessage('');
      setFormData({
        name: '',
        phone: '',
        date: '',
        time: '',
        doctor: 'Dr. Saravanan',
      });
    }
  }, [isOpen]);

  /* ================= CHECK DOCTOR LEAVE ================= */

  useEffect(() => {
    if (!formData.date) {
      setIsOnLeave(false);
      setLeaveMessage('');
      return;
    }

    const checkLeave = async () => {
      const leave = await isDoctorOnLeave(formData.date);
      setIsOnLeave(leave);
      setLeaveMessage('Doctor is on leave on this date');
    };

    checkLeave();
  }, [formData.date]);

  /* ================= FETCH BOOKED TIMES ================= */

  useEffect(() => {
    if (!formData.date || isOnLeave) {
      setBookedTimes([]);
      return;
    }

    const fetchBookedTimes = async () => {
      const q = query(
        collection(db, 'appointments'),
        where('date', '==', formData.date),
        where('status', 'in', ['Pending', 'In Progress'])
      );

      const snap = await getDocs(q);
      setBookedTimes(snap.docs.map((d) => d.data().time));
    };

    fetchBookedTimes();
  }, [formData.date, isOnLeave]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* 🔴 HARD SUNDAY BLOCK (SECURITY) */
    if (formData.date && isSunday(new Date(formData.date))) {
      alert('❌ Sunday is a holiday. Booking not allowed.');
      return;
    }

    if (loading || isOnLeave) return;
    setLoading(true);

    try {
      // PHONE duplicate
      const phoneQ = query(
        collection(db, 'appointments'),
        where('phone', '==', formData.phone),
        where('date', '==', formData.date),
        where('status', 'in', ['Pending', 'In Progress'])
      );
      if (!(await getDocs(phoneQ)).empty) {
        alert('❌ This phone number is already booked for this date');
        return;
      }

      // NAME duplicate
      const nameQ = query(
        collection(db, 'appointments'),
        where('name', '==', formData.name),
        where('date', '==', formData.date),
        where('status', 'in', ['Pending', 'In Progress'])
      );
      if (!(await getDocs(nameQ)).empty) {
        alert('❌ This name is already booked for this date');
        return;
      }

      // SLOT duplicate
      const slotQ = query(
        collection(db, 'appointments'),
        where('date', '==', formData.date),
        where('time', '==', formData.time),
        where('status', 'in', ['Pending', 'In Progress'])
      );
      if (!(await getDocs(slotQ)).empty) {
        alert('❌ This time slot is already booked');
        return;
      }

      // QUEUE
      const queueQ = query(
        collection(db, 'appointments'),
        where('date', '==', formData.date),
        where('status', 'in', ['Pending', 'In Progress'])
      );
      const queueSnap = await getDocs(queueQ);
      const queueNumber = queueSnap.size + 1;

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
        onClose();
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full">
        {/* HEADER */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

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
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border p-3 rounded-lg"
              />
              <input
                placeholder="Phone Number"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="border p-3 rounded-lg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <DatePicker
                selected={formData.date ? new Date(formData.date) : null}
                onChange={(date: Date | null) => {
                  if (!date) return;
                  if (isSunday(date)) {
                    alert('❌ Sunday is a holiday');
                    return;
                  }
                  setFormData({
                    ...formData,
                    date: date.toISOString().split('T')[0],
                    time: '',
                  });
                }}
                filterDate={(date) => !isSunday(date)}
                dayClassName={(date) =>
                  isSunday(date)
                    ? 'text-red-500 bg-red-100 cursor-not-allowed'
                    : ''
                }
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD / MM / YYYY"
                className="border p-3 rounded-lg w-full"
              />

              <select
                required
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
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
