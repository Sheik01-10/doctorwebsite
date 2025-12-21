import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

/* 🔴 Sunday checker */
const isSunday = (dateStr: string) => {
  return new Date(dateStr).getDay() === 0;
};

export default function DoctorLeaveByDate() {
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveMessage, setLeaveMessage] = useState('');
  const [leaveDates, setLeaveDates] = useState<string[]>([]);

  /* 🔥 Load leave dates */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'doctor_leaves'), (snap) => {
      setLeaveDates(snap.docs.map((d) => d.id));
    });
    return () => unsub();
  }, []);

  /* ➕ Set leave */
  const setLeave = async () => {
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

  /* ❌ Remove leave */
  const removeLeave = async (date: string) => {
    await deleteDoc(doc(db, 'doctor_leaves', date));
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="font-bold mb-4">Doctor Leave (Date Based)</h2>

      {/* INPUTS */}
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <input
          type="date"
          value={leaveDate}
          onChange={(e) => setLeaveDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          value={leaveMessage}
          onChange={(e) => setLeaveMessage(e.target.value)}
          placeholder="Leave message (optional)"
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={setLeave}
          className="bg-red-600 text-white rounded font-semibold"
        >
          Set Leave
        </button>
      </div>

      {/* LEAVE LIST */}
      {leaveDates.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Leave Dates</h3>

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
                <span>
                  {d} {isSunday(d) && '(Sunday)'}
                </span>

                <button
                  onClick={() => removeLeave(d)}
                  className="text-xs bg-black text-white px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
