import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Award, 
  ArrowRight, 
  PlayCircle,
  Video,
  FileCheck,
  Check,
  Sparkles,
  User,
  Smartphone
} from 'lucide-react';
import { Course } from '../types';
import { SEED_COURSES } from '../seedData';

interface AcademyComponentProps {
  lang: 'en' | 'ta';
  setCurrentPage: (p: any) => void;
  userProfile: any;
}

export default function AcademyComponent({
  lang,
  setCurrentPage,
  userProfile
}: AcademyComponentProps) {
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Registration Form States
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [district, setDistrict] = useState('Chennai');
  
  // Feedback States
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const triggerEnrollmentForm = (course: Course) => {
    setSelectedCourse(course);
    setIsEnrolled(false);
    setErrorText('');
    
    // Focus or scroll down to enrollment card
    setTimeout(() => {
      const el = document.getElementById('enrollment-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!name.trim()) {
      setErrorText('Please enter your participant name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorText('Please enter a valid 10-digit mobile number for WhatsApp course coordination');
      return;
    }

    setIsEnrolled(true);
  };

  return (
    <div className="bg-[#F7F9F4] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb row */}
        <nav className="text-xs text-slate-500 mb-6 font-mono">
          <span className="cursor-pointer hover:text-[#1B6B3A]" onClick={() => setCurrentPage('home')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-850 font-bold">IGO Academy Agrarian Training</span>
        </nav>

        {/* Title Header Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-teal-500/5 rounded-bl-full pointer-events-none"></div>
          <div className="max-w-3xl">
            <span className="bg-teal-100 text-teal-850 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              Agrar Academy & Professional Training
            </span>
            <h2 className="font-display font-extrabold text-[#1B6B3A] text-3xl sm:text-4xl mt-4 tracking-tight">
              {lang === 'ta' ? 'விவசாய அகாடமி மற்றும் பயிற்சிகள்' : 'IGO Academy: Professional Skill Development'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
              Upskill in high-yield agronomy, certified soil chemistry, automated drip designs, and unmanned drone aviation. Complete with live practical workshops at our No. 17 Kovalan Street, Kanathur headquarters with certified certification diplomas.
            </p>
          </div>
        </div>

        {/* Course Cards Bento Stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {SEED_COURSES.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Cover Photo */}
              <div className="h-44 relative bg-slate-100">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute top-3 left-3 bg-[#1B6B3A] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                  {course.level}
                </div>
              </div>

              {/* Course detail contents */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold font-mono uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#E8A020]" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-[#E8A020]" />
                      <span>{course.lessonsCount} Chapters</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-tight mt-3 group-hover:text-[#1B6B3A]">
                    {course.title}
                  </h3>
                  
                  <div className="text-xs text-slate-505 font-medium mt-1">
                    Instr: <span className="text-slate-700 font-bold">{course.instructor}</span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2.5 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Syllabus Modules Teaser */}
                  <div className="mt-4 space-y-1 bg-[#F7F9F4] p-3 rounded-lg border border-slate-100">
                    <span className="text-[9px] font-extrabold uppercase text-slate-400 block tracking-wider mb-1">
                      Syllabus Teaser (Modules):
                    </span>
                    {course.modules.slice(0, 3).map((m, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-650">
                        <Check className="h-3 w-3 text-[#1B6B3A] shrink-0" />
                        <span className="line-clamp-1">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-[#1B6B3A]">₹{course.currentPrice}</span>
                    <span className="text-[10px] text-slate-400 line-through">₹{course.originalPrice}</span>
                  </div>

                  <button 
                    onClick={() => triggerEnrollmentForm(course)}
                    className="flex items-center gap-1 bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm border border-[#248F4E] transition shrink-0"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Course Enrollment Container */}
        {selectedCourse && (
          <div id="enrollment-card" className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-100 shadow-sm transition-all duration-300">
            {isEnrolled ? (
              <div className="text-center py-8 px-4 space-y-4 max-w-xl mx-auto">
                <div className="h-14 w-14 bg-teal-100 text-[#1B6B3A] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-display font-extrabold text-slate-900 text-2xl tracking-tight">
                  Registration Successful!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Excellent, <strong>{name}</strong>! You have successfully registered for the course <strong>{selectedCourse.title}</strong> directly at our Chennai Kanathur hub training classroom.
                </p>

                <div className="bg-[#F7F9F4] p-4 rounded-xl text-left text-xs font-mono space-y-1">
                  <div>• COURSE: {selectedCourse.title}</div>
                  <div>• INSTRUCTOR: {selectedCourse.instructor}</div>
                  <div>• DETAILS SENT: WhatsApp to (+91) {phone}</div>
                  <div>• VENUE: No.17 Kovalan Street, Kanathur, Chennai</div>
                </div>

                <p className="text-xs text-slate-500">
                  Our coordinator will reach out via WhatsApp with classroom logistics and online login tokens before the classes resume next Saturday!
                </p>

                <div className="pt-2">
                  <button 
                    onClick={() => setSelectedCourse(null)}
                    className="text-xs font-bold text-[#1B6B3A] hover:text-[#134D29]"
                  >
                    View Other Course Options
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-6">
                <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
                  <div className="h-10 w-10 rounded-lg bg-[#1B6B3A]/10 text-[#1B6B3A] flex items-center justify-center font-bold">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#E8A020]">
                      Active Registry Desk
                    </h4>
                    <h3 className="text-lg font-bold text-slate-900">
                      Enrollment: {selectedCourse.title}
                    </h3>
                  </div>
                </div>

                {errorText && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
                    {errorText}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Name input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Participant Full Name
                    </label>
                    <input 
                      type="text"
                      className="w-full bg-[#f7f9f4] text-xs px-3 py-2.5 rounded-lg border border-slate-205 focus:outline-none focus:border-[#1B6B3A]"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anandha Selvam"
                    />
                  </div>

                  {/* Phone input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      WhatsApp Mobile Number
                    </label>
                    <input 
                      type="tel"
                      className="w-full bg-[#f7f9f4] text-xs px-3 py-2.5 rounded-lg border border-slate-205 focus:outline-none focus:border-[#1B6B3A]"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="e.g. 7397785803"
                    />
                  </div>

                  {/* District select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Current District
                    </label>
                    <select
                      className="w-full bg-[#f7f9f4] text-xs px-3 py-2.5 rounded-lg border border-slate-205 focus:outline-none focus:border-[#1B6B3A]"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    >
                      <option value="Chennai">Chennai</option>
                      <option value="Chengalpattu">Chengalpattu</option>
                      <option value="Kanchipuram">Kanchipuram</option>
                      <option value="Thiruvallur">Thiruvallur</option>
                      <option value="Other">Other TN District</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Admission Total:</span>
                  <span className="text-sm font-extrabold text-[#1B6B3A]">₹{selectedCourse.currentPrice} with dynamic certification included</span>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-[#1B6B3A] hover:bg-[#15532d] text-white text-xs font-extrabold py-3 rounded-lg border border-[#248F4E] shadow-sm transition"
                  >
                    Confirm Participant Admission Registry
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSelectedCourse(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 px-5 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
