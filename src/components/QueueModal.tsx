import { X, Users, Clock, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Appointment {
  name: string;
  phone: string;
  date: string;
  time: string;
  queueNumber: number;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export default function QueueModal({ isOpen, onClose }: QueueModalProps) {
  const [queue, setQueue] = useState<Appointment[]>([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isOpen) return;

    // 🔥 LISTEN ALL APPOINTMENTS (NO DATE FILTER)
    const q = collection(db, 'appointments');

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs
        .map((doc) => doc.data() as Appointment)
        // ✅ FILTER TODAY + ACTIVE QUEUE IN JS
        .filter(
          (p) =>
            p.date === today &&
            (p.status === 'Pending' || p.status === 'In Progress')
        )
        // ✅ SORT BY QUEUE NUMBER
        .sort((a, b) => a.queueNumber - b.queueNumber);

      setQueue(list);
    });

    return () => unsub();
  }, [isOpen, today]);

  if (!isOpen) return null;

  const inProgress = queue.filter((p) => p.status === 'In Progress');
  const pending = queue.filter((p) => p.status === 'Pending');

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Live Queue Status</h2>
            <p className="text-sm text-gray-600">
              Real-time patient queue
            </p>
          </div>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={<Users size={30} className="text-blue-600" />}
              value={queue.length}
              label="Total in Queue"
              bg="bg-blue-50"
            />

            <StatCard
              icon={<CheckCircle size={30} className="text-green-600" />}
              value={inProgress.length}
              label="In Progress"
              bg="bg-green-50"
            />

            <StatCard
              icon={<Clock size={30} className="text-orange-600" />}
              value={`${pending.length * 10} min`}
              label="Est. Wait Time"
              bg="bg-orange-50"
            />
          </div>

          {/* NOW SERVING */}
          {inProgress.length > 0 && (
            <div className="mb-6 p-4 border-2 border-green-500 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-700">Now Serving</h3>
              <p className="text-xl font-bold">
                #{inProgress[0].queueNumber} – {inProgress[0].name}
              </p>
            </div>
          )}

          {/* QUEUE LIST */}
          <div className="space-y-3">
            {queue.map((p) => (
              <div
                key={p.queueNumber}
                className={`border-2 rounded-lg p-4 ${
                  p.status === 'In Progress'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">
                      #{p.queueNumber} – {p.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Time: {p.time}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      p.status === 'In Progress'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}

            {queue.length === 0 && (
              <p className="text-center text-gray-500">
                No patients in queue today
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* STAT CARD */
function StatCard({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: any;
  label: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-lg p-4 text-center`}>
      <div className="mx-auto mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
