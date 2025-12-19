import { QRCodeCanvas } from 'qrcode.react';

export default function ClinicQR() {
  return (
    <div className="text-center p-6">
      <h2 className="text-xl font-bold mb-4">
        Scan to Book Appointment
      </h2>

      <QRCodeCanvas
        value="https://shanmugadiabeticclinic.netlify.app/appointment"
        size={220}
      />

      <p className="mt-4 text-gray-600">
        Scan this QR to book your appointment
      </p>
    </div>
  );
}
