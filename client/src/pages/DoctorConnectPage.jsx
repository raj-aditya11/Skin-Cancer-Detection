/**
 * DoctorConnectPage.jsx — Mock dermatologist listing with appointment UI
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, MapPin, Star, Phone, Clock, Calendar,
  CheckCircle, X, Award, Users
} from 'lucide-react';

// Mock dermatologist data
const doctors = [
  {
    id: 1, name: 'Dr. Priya Sharma', specialty: 'Dermatology & Dermato-surgery',
    hospital: 'Apollo Hospital, Delhi', rating: 4.8, reviews: 324,
    experience: 18, fee: '₹800', available: ['Mon', 'Wed', 'Fri'],
    image: null, education: 'MBBS, MD (Dermatology), AIIMS Delhi',
  },
  {
    id: 2, name: 'Dr. Rajesh Mehta', specialty: 'Dermatology & Venereology',
    hospital: 'Fortis Hospital, Mumbai', rating: 4.7, reviews: 256,
    experience: 15, fee: '₹1000', available: ['Tue', 'Thu', 'Sat'],
    image: null, education: 'MBBS, DVD, DNB (Dermatology)',
  },
  {
    id: 3, name: 'Dr. Ananya Reddy', specialty: 'Skin Cancer Specialist',
    hospital: 'Manipal Hospital, Bangalore', rating: 4.9, reviews: 412,
    experience: 22, fee: '₹1200', available: ['Mon', 'Tue', 'Thu', 'Fri'],
    image: null, education: 'MBBS, MD, DM (Dermato-Oncology)',
  },
  {
    id: 4, name: 'Dr. Sanjay Gupta', specialty: 'Cosmetic Dermatology',
    hospital: 'Max Super Speciality, Hyderabad', rating: 4.6, reviews: 189,
    experience: 12, fee: '₹700', available: ['Mon', 'Wed', 'Sat'],
    image: null, education: 'MBBS, MD (Skin & VD)',
  },
  {
    id: 5, name: 'Dr. Kavitha Nair', specialty: 'Pediatric Dermatology',
    hospital: 'KIMS Hospital, Kochi', rating: 4.8, reviews: 298,
    experience: 16, fee: '₹900', available: ['Tue', 'Wed', 'Fri'],
    image: null, education: 'MBBS, DCH, MD (Dermatology)',
  },
  {
    id: 6, name: 'Dr. Amit Banerjee', specialty: 'Mohs Surgery Specialist',
    hospital: 'Tata Memorial Hospital, Kolkata', rating: 4.9, reviews: 367,
    experience: 25, fee: '₹1500', available: ['Mon', 'Thu', 'Fri'],
    image: null, education: 'MBBS, MS, MCh (Skin Oncology)',
  },
];

const DoctorConnectPage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', time: '', notes: '' });

  const handleBooking = (e) => {
    e.preventDefault();
    setAppointmentBooked(true);
    setTimeout(() => {
      setSelectedDoctor(null);
      setAppointmentBooked(false);
      setFormData({ name: '', phone: '', date: '', time: '', notes: '' });
    }, 3000);
  };

  return (
    <div className="page-wrapper bg-gradient-to-b from-surface-50 to-white">
      <div className="section-container py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-accent-500/20">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-surface-900 mb-3">
            Connect with <span className="gradient-text">Dermatologists</span>
          </h1>
          <p className="text-surface-500 text-lg max-w-2xl mx-auto">
            Find verified dermatologists and skin cancer specialists near you. 
            Book an appointment for professional evaluation.
          </p>
        </motion.div>

        {/* Note */}
        <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl mb-8 max-w-3xl mx-auto">
          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> This is a demo interface with mock data. In production, this would connect to real doctor databases.
          </p>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {doctors.map((doctor, i) => (
            <motion.div
              key={doctor.id}
              className="glass-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Header gradient */}
              <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
              
              <div className="p-6">
                {/* Doctor info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-surface-900">{doctor.name}</h3>
                    <p className="text-sm text-primary-600 font-medium">{doctor.specialty}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-surface-600">
                    <MapPin className="w-4 h-4 text-surface-400" />
                    {doctor.hospital}
                  </div>
                  <div className="flex items-center gap-2 text-surface-600">
                    <Award className="w-4 h-4 text-surface-400" />
                    {doctor.education}
                  </div>
                  <div className="flex items-center gap-2 text-surface-600">
                    <Users className="w-4 h-4 text-surface-400" />
                    {doctor.experience} years experience
                  </div>
                </div>

                {/* Rating & Fee */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-surface-900">{doctor.rating}</span>
                    <span className="text-xs text-surface-500">({doctor.reviews} reviews)</span>
                  </div>
                  <span className="font-display font-bold text-primary-600">{doctor.fee}</span>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2 mb-5">
                  <Clock className="w-4 h-4 text-surface-400" />
                  <div className="flex gap-1 flex-wrap">
                    {doctor.available.map((day) => (
                      <span key={day} className="px-2 py-0.5 bg-accent-50 text-accent-700 text-xs font-medium rounded">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Book button */}
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {selectedDoctor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedDoctor(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {appointmentBooked ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-surface-900 mb-2">Appointment Requested!</h3>
                    <p className="text-surface-500 text-sm">
                      Your appointment request with {selectedDoctor.name} has been submitted.
                      You will receive a confirmation shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display text-xl font-bold text-surface-900">Book Appointment</h3>
                      <button onClick={() => setSelectedDoctor(null)} className="p-1 hover:bg-surface-100 rounded-lg">
                        <X className="w-5 h-5 text-surface-500" />
                      </button>
                    </div>
                    
                    <div className="p-4 bg-primary-50 rounded-xl mb-6">
                      <p className="font-semibold text-primary-900">{selectedDoctor.name}</p>
                      <p className="text-sm text-primary-700">{selectedDoctor.specialty}</p>
                      <p className="text-sm text-primary-600">{selectedDoctor.hospital}</p>
                    </div>

                    <form onSubmit={handleBooking} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Your Name</label>
                        <input type="text" className="input-field" required
                          value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Phone Number</label>
                        <input type="tel" className="input-field" required
                          value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-1">Date</label>
                          <input type="date" className="input-field" required
                            value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-1">Time</label>
                          <select className="input-field" required
                            value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}>
                            <option value="">Select</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Notes (optional)</label>
                        <textarea className="input-field" rows={3} placeholder="Describe your concern..."
                          value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                      </div>
                      <button type="submit" className="btn-primary w-full">
                        Submit Appointment Request
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DoctorConnectPage;
