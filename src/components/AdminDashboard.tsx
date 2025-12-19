import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  doctor: string;
  status?: string;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  // 🔥 REAL-TIME FIRESTORE LISTENER
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

  // 🔐 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/'); // back to home
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* TOP BAR */}
      <div className="bg-white  px-6 py-20 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-6xl mx-auto">
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
  );
}
