import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function DoctorLeaveToggle() {
  const [isOnLeave, setIsOnLeave] = useState(false);
  const [loading, setLoading] = useState(true);

  const ref = doc(db, 'doctor_status', 'today');

  useEffect(() => {
    const fetchStatus = async () => {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setIsOnLeave(snap.data().isOnLeave);
      }
      setLoading(false);
    };
    fetchStatus();
  }, []);

  const toggleLeave = async () => {
    const newStatus = !isOnLeave;
    setIsOnLeave(newStatus);
    await setDoc(ref, { isOnLeave: newStatus }, { merge: true });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="font-bold mb-3">Doctor Availability</h2>

      <div className="flex items-center gap-4">
        <span
          className={`font-semibold ${
            isOnLeave ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {isOnLeave ? 'On Leave' : 'Available'}
        </span>

        <button
          onClick={toggleLeave}
          className={`px-4 py-2 rounded text-white ${
            isOnLeave ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {isOnLeave ? 'Mark Available' : 'Mark Leave'}
        </button>
      </div>
    </div>
  );
}
