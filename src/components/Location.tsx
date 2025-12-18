import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Location() {
  return (
    <section id="location" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find Us Here
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Visit us at our conveniently located facility. We're here to serve you.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Contact Info */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Contact Information
            </h3>

            <div className="space-y-5">

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 rounded-full p-3 shrink-0">
                  <MapPin size={22} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    1789 Neer Maniyakarar Street,<br />
                    Ramakrishnapuram,<br />
                    Coimbatore – 641045
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-cyan-600 rounded-full p-3 shrink-0">
                  <Phone size={22} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    88251 51522
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-green-600 rounded-full p-3 shrink-0">
                  <Mail size={22} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600 text-sm sm:text-base break-all">
                    saravananthangavelukm@gmail.com
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="bg-orange-600 rounded-full p-3 shrink-0">
                  <Clock size={22} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Hours</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Monday – Saturday: 07:00 PM – 09:00 PM<br />
                    <span className="font-semibold text-red-600">
                      Sunday: Holiday
                    </span>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden relative h-[300px] sm:h-[400px] md:h-full min-h-[320px]">
            <iframe
              src="https://www.google.com/maps?q=Shanmuga%20Diabetic%20Clinic%20Coimbatore&output=embed"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}
