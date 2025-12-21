import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  status?: string;
}

/* 🔴 Sunday check */
const isSunday = (dateStr: string) => {
  return new Date(dateStr).getDay() === 0;
};

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveMessage, setLeaveMessage] = useState('');
  const [leaveDates, setLeaveDates] = useState<string[]>([]);
  const navigate = useNavigate();

  /* 🔥 LIVE APPOINTMENTS */
  useEffect(() => {
    const q = query(
      collection(db, 'appointments'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setAppointments(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Appointment, 'id'>),
        }))
      );
    });
    return () => unsub();
  }, []);

  /* 🔥 LOAD LEAVE DATES */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'doctor_leaves'), (snap) => {
      setLeaveDates(snap.docs.map((d) => d.id));
    });
    return () => unsub();
  }, []);

  /* ➕ SET LEAVE */
  const setDoctorLeave = async () => {
    if (!leaveDate) {
      alert('Select a date');
      return;
    }

    await setDoc(doc(db, 'doctor_leaves', leaveDate), {
      date: leaveDate,
      message: leaveMessage || 'Doctor on leave',
      createdAt: new Date(),
    });

    setLeaveDate('');
    setLeaveMessage('');
  };

  /* ❌ REMOVE LEAVE */
  const removeLeave = async (date: string) => {
    if (!confirm(`Remove leave for ${date}?`)) return;
    await deleteDoc(doc(db, 'doctor_leaves', date));
  };

  /* ❌ CANCEL APPOINTMENT (🔥 NEW) */
  const cancelAppointment = async (id: string, name: string) => {
    const ok = confirm(`Cancel appointment for ${name}?`);
    if (!ok) return;

    await updateDoc(doc(db, 'appointments', id), {
      status: 'Cancelled',
    });
  };

  /* 🔐 LOGOUT */
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* TOP BAR */}
      <div className="bg-white px-6 py-24 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* 🩺 DOCTOR LEAVE */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-bold mb-4">
            Doctor Leave (Date Based)
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input
              type="date"
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            />

            <input
              type="text"
              value={leaveMessage}
              onChange={(e) => setLeaveMessage(e.target.value)}
              placeholder="Leave message (optional)"
              className="border px-4 py-2 rounded-lg"
            />

            <button
              onClick={setDoctorLeave}
              className="bg-red-600 text-white rounded-lg font-semibold"
            >
              Set Leave
            </button>
          </div>

          {leaveDates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {leaveDates.map((d) => (
                <div
                  key={d}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
                    isSunday(d)
                      ? 'bg-red-200 text-red-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <span>{d}</span>
                  <button
                    onClick={() => removeLeave(d)}
                    className="bg-black text-white px-2 rounded text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 📋 APPOINTMENTS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Appointments (Live)
          </h2>

          {appointments.length === 0 ? (
            <p>No appointments yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="bg-white p-4 rounded-xl shadow border"
                >
                  <p><b>Name:</b> {a.name}</p>
                  <p><b>Phone:</b> {a.phone}</p>
                  <p><b>Date:</b> {a.date}</p>
                  <p><b>Time:</b> {a.time}</p>

                  <span
                    className={`font-semibold ${
                      a.status === 'Cancelled'
                        ? 'text-red-600'
                        : 'text-orange-600'
                    }`}
                  >
                    Status: {a.status || 'Pending'}
                  </span>

                  {a.status !== 'Cancelled' && (
                    <button
                      onClick={() => cancelAppointment(a.id, a.name)}
                      className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg font-semibold"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
