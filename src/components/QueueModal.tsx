import { X, Users, Clock, CheckCircle } from 'lucide-react';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const queueData = [
  {
    token: 'A001',
    name: 'John Smith',
    doctor: 'Dr. Sarah Johnson',
    status: 'In Progress',
    estimatedTime: 'Now',
  },
  {
    token: 'A002',
    name: 'Emma Wilson',
    doctor: 'Dr. Michael Chen',
    status: 'Waiting',
    estimatedTime: '10 min',
  },
  {
    token: 'A003',
    name: 'Robert Brown',
    doctor: 'Dr. Emily Rodriguez',
    status: 'Waiting',
    estimatedTime: '25 min',
  },
  {
    token: 'A004',
    name: 'Sarah Davis',
    doctor: 'Dr. James Williams',
    status: 'Waiting',
    estimatedTime: '35 min',
  },
  {
    token: 'A005',
    name: 'Michael Johnson',
    doctor: 'Dr. Lisa Anderson',
    status: 'Waiting',
    estimatedTime: '45 min',
  },
];

export default function QueueModal({ isOpen, onClose }: QueueModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Current Queue Status</h2>
            <p className="text-sm text-gray-600 mt-1">Real-time patient queue information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Users size={32} className="text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{queueData.length}</div>
              <div className="text-sm text-gray-600">Total in Queue</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <CheckCircle size={32} className="text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {queueData.filter(p => p.status === 'In Progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <Clock size={32} className="text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">~30 min</div>
              <div className="text-sm text-gray-600">Avg. Wait Time</div>
            </div>
          </div>

          <div className="space-y-3">
            {queueData.map((patient, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 transition ${
                  patient.status === 'In Progress'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                        patient.status === 'In Progress'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {patient.token}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-600">{patient.doctor}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-1 ${
                        patient.status === 'In Progress'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {patient.status}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center justify-end">
                      <Clock size={14} className="mr-1" />
                      {patient.estimatedTime}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Important Information</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Wait times are estimates and may vary based on emergency cases</li>
              <li>• Please arrive 10 minutes before your scheduled appointment</li>
              <li>• Emergency cases will be prioritized</li>
              <li>• Queue updates in real-time every 2 minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
