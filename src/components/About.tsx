import { Heart, Award, Shield, Clock } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            About Us
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicated diabetes and internal medicine care with compassion,
            experience, and clinical excellence.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-14">

          {/* Left */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5">
              Dr. T. Saravanan, MD
            </h3>

            <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
              Dr. T. Saravanan is a Professor of Medicine and Head of the
              Department of Internal Medicine at PSG IMSR & Hospitals,
              Coimbatore. He is a Fellow of the Indian College of Physicians (FICP)
              with vast experience in managing complex medical conditions.
            </p>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              He has also served as a Medical Consultant in the Department of
              Endocrinology, Metabolism and Diabetes at RIPAS Hospital,
              Brunei Darussalam. His approach focuses on evidence-based
              treatment and long-term patient wellbeing.
            </p>
          </div>

          {/* Right Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 flex items-center justify-center text-center">
            <div>
              <Heart size={64} className="text-blue-600 mx-auto mb-4" />
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                Personalized Diabetes Care
              </p>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Trusted. Experienced. Compassionate.
              </p>
            </div>
          </div>
        </div>

        {/* Expertise Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition border border-gray-100">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Award size={28} className="text-blue-600" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Clinical Expertise
            </h4>
            <p className="text-gray-600 text-sm sm:text-base">
              Type 1 & Type 2 diabetes, uncontrolled diabetes,
              insulin pump & pen therapy.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition border border-gray-100">
            <div className="bg-cyan-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Shield size={28} className="text-cyan-600" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Safe Treatment
            </h4>
            <p className="text-gray-600 text-sm sm:text-base">
              Evidence-based protocols with patient safety,
              hygiene, and ethical care as top priorities.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition border border-gray-100">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Clock size={28} className="text-green-600" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Years of Experience
            </h4>
            <p className="text-gray-600 text-sm sm:text-base">
              Extensive academic and clinical experience in
              endocrinology, diabetes & thyroid disorders.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
