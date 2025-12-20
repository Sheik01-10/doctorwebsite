import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
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

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isOnLeave, setIsOnLeave] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState('');
  const navigate = useNavigate();

  /* 🔥 REAL-TIME APPOINTMENTS */
  useEffect(() => {
    const q = query(
      collection(db, 'appointments'),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setAppointments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Appointment, 'id'>),
        }))
      );
    });

    return () => unsub();
  }, []);

  /* 🔥 LOAD DOCTOR LEAVE STATUS */
  useEffect(() => {
    const loadLeaveStatus = async () => {
      const ref = doc(db, 'doctor_status', 'today');
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setIsOnLeave(snap.data().isOnLeave);
        setLeaveMessage(snap.data().message || '');
      } else {
        await setDoc(ref, {
          isOnLeave: false,
          message: 'Doctor is on leave today',
        });
      }
    };

    loadLeaveStatus();
  }, []);

  /* 🔁 TOGGLE LEAVE */
  const toggleLeave = async () => {
    const ref = doc(db, 'doctor_status', 'today');
    await updateDoc(ref, {
      isOnLeave: !isOnLeave,
      message: leaveMessage || 'Doctor is on leave today',
    });
    setIsOnLeave(!isOnLeave);
  };

  /* 🔐 LOGOUT BUTTON FUNCTION */
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login'); // 👈 back to login
  };

  return (
    <div className="bg-gray-50 ">

      {/* 🔝 TOP BAR */}
      <div className="bg-white px-6 py-20 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        {/* 🔴 LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-9 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* DOCTOR LEAVE */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-bold mb-4">
            Doctor Availability
          </h2>

          <div className="flex items-center gap-4 mb-4">
            <span
              className={`px-4 py-1 rounded-full text-sm font-bold ${
                isOnLeave
                  ? 'bg-red-100 text-red-600'
                  : 'bg-green-100 text-green-600'
              }`}
            >
              {isOnLeave ? 'ON LEAVE' : 'AVAILABLE'}
            </span>

            <button
              onClick={toggleLeave}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isOnLeave
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {isOnLeave ? 'Set Available' : 'Set Leave'}
            </button>
          </div>

          <input
            type="text"
            value={leaveMessage}
            onChange={(e) => setLeaveMessage(e.target.value)}
            placeholder="Leave message"
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>

        {/* APPOINTMENTS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Appointments (Live)
          </h2>

          {appointments.length === 0 ? (
            <p className="text-gray-600">No appointments yet.</p>
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

                  <span className="inline-block mt-2 text-sm font-semibold text-orange-600">
                    Status: Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
