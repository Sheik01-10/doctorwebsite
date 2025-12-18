import { Appointment } from '../types/appointment';

interface Props {
  data: Appointment;
  onClose: () => void;
}

export default function AppointmentPopup({ data, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md">

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Appointment Booked ✅
        </h2>

        <div className="space-y-2 text-gray-700">
          <p><b>Name:</b> {data.name}</p>
          <p><b>Phone:</b> {data.phone}</p>
          <p><b>Date:</b> {data.date}</p>
          <p><b>Time:</b> {data.time}</p>
            <p><b>Doctor:</b> {data.doctor}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
