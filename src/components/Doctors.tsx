import { GraduationCap, Briefcase } from 'lucide-react';

export default function Doctors() {
  return (
    <section id="doctors" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Doctor
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
        </div>

        {/* Doctor Card */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-xl w-full">
            
            {/* Top Section */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 h-40 flex items-center justify-center">
              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
                S
              </div>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Dr. T. Saravanan, MD
              </h3>

              <p className="text-purple-600 font-semibold mb-4 leading-relaxed">
                Professor of Medicine & HOD, <br />
                Department of Internal Medicine, <br />
                PSG IMSR & Hospitals
              </p>

              <p className="text-gray-600 mb-6">
                Specialist at Shanmuga Diabetic Clinic
              </p>

              <div className="space-y-3 text-left">
                <div className="flex items-start text-gray-700">
                  <GraduationCap size={18} className="mr-3 text-blue-600 mt-1" />
                  <span>
                    MBBS, MD (Internal Medicine), FICP
                  </span>
                </div>

                <div className="flex items-start text-gray-700">
                  <Briefcase size={18} className="mr-3 text-blue-600 mt-1" />
                  <span>
                    Expertise in Diabetes, Endocrinology,
                    Thyroid & Pregnancy-related Diabetes
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
