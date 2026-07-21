import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, UserCheck, UploadCloud, Send, 
  MapPin, Phone, Mail, FileText, Briefcase, CreditCard,
  ShieldCheck, ArrowRight, Plus, Trash2, ChevronDown, X, AlertCircle
} from 'lucide-react';

// --- IMAGE IMPORTS ---
import franchiseBannerImg from "../../assets/contact-banner.jpg";

export default function FranchisePage() {
  const containerRef = useRef(null);

  // --- TOAST NOTIFICATION STATE ---
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    // Auto hide after 3.5 seconds
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3500);
  };

  // --- BASE STATES ---
  const emptyDirector = { 
    name: '', 
    email: '', 
    contact: '', 
    incomeAmount: '', 
    incomeUnit: 'Lakhs', 
    aadhar: '', 
    pan: '', 
    address: ''
  };

  const [formData, setFormData] = useState({
    companyName: '',
    cinGst: '',
    companyPan: '',
    companyTan: '',
    registeredAddress: '',
    companyContact: '',
    authName: '',
    authContact: '',
    authEmail: '',
    documents: null
  });

  const [noOfDirOption, setNoOfDirOption] = useState('1');
  const [directors, setDirectors] = useState([{ ...emptyDirector }]);
  
  // Validation States
  const [errors, setErrors] = useState({});
  const [dirErrors, setDirErrors] = useState([{}]);
  const [formStatus, setFormStatus] = useState({ loading: false, message: '', isError: false });

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Prevent alphabets in Contact Numbers (Allow digits only for 10 limit)
    if (name === 'companyContact' || name === 'authContact') {
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }
    // Auto Uppercase for PAN, TAN, GST
    if (name === 'companyPan' || name === 'companyTan' || name === 'cinGst') {
      finalValue = value.toUpperCase();
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    // Clear error on typing
    setErrors(prev => ({...prev, [name]: null}));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext !== 'pdf' && ext !== 'zip') {
        setErrors(prev => ({...prev, documents: "Only PDF or ZIP files are allowed"}));
        setFormData(prev => ({ ...prev, documents: null }));
        return;
      }
    }
    setErrors(prev => ({...prev, documents: null}));
    setFormData(prev => ({ ...prev, documents: file }));
  };

  const handleNoOfDirectorsChange = (e) => {
    const val = e.target.value;
    setNoOfDirOption(val);
    
    let targetCount = 1;
    if (val === '2') targetCount = 2;
    if (val === '3+') targetCount = 3;

    setDirectors(prev => {
      const newArr = [...prev];
      if (newArr.length > targetCount && val !== '3+') {
        newArr.length = targetCount;
      }
      while (newArr.length < targetCount) {
        newArr.push({ ...emptyDirector });
      }
      return newArr;
    });
    
    setDirErrors(prev => {
      const newErr = [...prev];
      if (newErr.length > targetCount && val !== '3+') newErr.length = targetCount;
      while (newErr.length < targetCount) newErr.push({});
      return newErr;
    });
  };

  const handleDirectorChange = (index, field, value) => {
    const updatedDirectors = [...directors];
    let finalValue = value;

    // Contact number validation
    if (field === 'contact') {
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    } 
    // Income amount validation
    else if (field === 'incomeAmount') {
      finalValue = value.replace(/[a-zA-Z]/g, '');
    } 
    // Identification strictly 12-16 digits
    else if (field === 'aadhar') {
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 16);
    }
    // PAN auto uppercase
    else if (field === 'pan') {
      finalValue = value.toUpperCase();
    }

    updatedDirectors[index][field] = finalValue;
    setDirectors(updatedDirectors);
    
    // Clear specific error
    const updatedErrors = [...dirErrors];
    updatedErrors[index] = { ...updatedErrors[index], [field]: null };
    setDirErrors(updatedErrors);
  };

  const handleAddDirector = () => {
    setDirectors(prev => [...prev, { ...emptyDirector }]);
    setDirErrors(prev => [...prev, {}]);
  };

  const handleRemoveDirector = (index) => {
    setDirectors(prev => prev.filter((_, i) => i !== index));
    setDirErrors(prev => prev.filter((_, i) => i !== index));
  };

  // --- FORM VALIDATION ---
  const validateForm = () => {
    let newErrors = {};
    let newDirErrors = directors.map(() => ({}));
    let isValid = true;

    // Regex Patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    // Company Validations
    if (formData.companyContact.length !== 10) { newErrors.companyContact = "Mobile number must be 10 digits"; isValid = false; }
    if (!panRegex.test(formData.companyPan)) { newErrors.companyPan = "Invalid PAN format (e.g. ABCDE1234F)"; isValid = false; }
    if (formData.companyTan && !tanRegex.test(formData.companyTan)) { newErrors.companyTan = "Invalid TAN format"; isValid = false; }
    if (!gstRegex.test(formData.cinGst)) { newErrors.cinGst = "Invalid GST format"; isValid = false; }
    if (formData.authContact.length !== 10) { newErrors.authContact = "Mobile number must be 10 digits"; isValid = false; }
    if (!emailRegex.test(formData.authEmail)) { newErrors.authEmail = "Invalid email format"; isValid = false; }
    if (!formData.documents) { newErrors.documents = "Please upload the required documents"; isValid = false; }

    // Director Validations
    directors.forEach((dir, i) => {
      if (dir.contact.length !== 10) { newDirErrors[i].contact = "Mobile number must be 10 digits"; isValid = false; }
      if (!emailRegex.test(dir.email)) { newDirErrors[i].email = "Invalid email format"; isValid = false; }
      if (!panRegex.test(dir.pan)) { newDirErrors[i].pan = "Invalid PAN format"; isValid = false; }
      if (dir.aadhar.length < 12) { newDirErrors[i].aadhar = "ID must be between 12 to 16 digits"; isValid = false; }
    });

    setErrors(newErrors);
    setDirErrors(newDirErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please fix the errors in the form before submitting.", "error");
      setFormStatus({ loading: false, message: 'Please fix the errors in the form before submitting.', isError: true });
      return;
    }

    setFormStatus({ loading: true, message: '', isError: false });
    
    try {
      const data = new FormData();
      data.append('companyName', formData.companyName);
      data.append('cinGst', formData.cinGst);
      data.append('companyPan', formData.companyPan);
      data.append('companyTan', formData.companyTan);
      data.append('registeredAddress', formData.registeredAddress);
      data.append('companyContact', formData.companyContact);
      data.append('authName', formData.authName);
      data.append('authContact', formData.authContact);
      data.append('authEmail', formData.authEmail);
      
      if (formData.documents) {
        data.append('documents', formData.documents);
      }
      
      data.append('directors', JSON.stringify(directors));

      const response = await fetch('http://localhost:5000/api/franchise/apply', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus({ loading: false, message: 'Application submitted successfully! Our team will contact you soon.', isError: false });
        showToast("Application submitted successfully!", "success");
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error("Submission error:", error);
      setFormStatus({ loading: false, message: error.message || 'An error occurred while submitting the form.', isError: true });
      showToast("Submission failed. Please try again.", "error");
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-transparent font-sans text-gray-600 selection:bg-[#0d3863]/20 selection:text-[#0d3863]">
      
      {/* ================= PRODUCTION LEVEL TOAST POPUP ================= */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border bg-white min-w-[320px] max-w-md w-max ${
              toast.type === 'error' ? 'border-red-100' : 'border-emerald-100'
            }`}
          >
            {toast.type === 'error' ? (
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
            <p className="text-gray-700 font-semibold text-sm flex-grow">{toast.message}</p>
            <button 
              onClick={() => setToast({ ...toast, visible: false })} 
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOP BANNER SECTION --- */}
      <section className="relative w-full h-[350px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80" style={{ backgroundImage: `url(${franchiseBannerImg})` }}></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center pt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-medium text-sm mb-6 border border-white/20">
            <Briefcase className="w-4 h-4" /> Partner With Us
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-3xl md:text-5xl font-extrabold text-[#fff] tracking-tight drop-shadow-sm">
            Franchise Application
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl font-medium">
            Join the Techhansa Retail network. Fill out the comprehensive form below to start your journey as our verified franchise partner.
          </motion.p>
        </div>
      </section>

      {/* --- MAIN FORM SECTION --- */}
      <section className="relative z-10 pb-24 px-4 lg:px-12 -mt-10">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {formStatus.message && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-5 rounded-2xl text-base font-medium border shadow-sm ${formStatus.isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6" />
                  {formStatus.message}
                </div>
              </motion.div>
            )}

            {/* 1. COMPANY DETAILS */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0d3863]"><Building2 className="w-7 h-7" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0d3863]">Registered Company Details</h2>
                  <p className="text-gray-500 text-sm mt-1">Provide your official business information</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Registered Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Enter your company name" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">CIN / GST Number *</label>
                  <input type="text" name="cinGst" value={formData.cinGst} onChange={handleInputChange} placeholder=" Enter GST Number" className={`w-full px-5 py-3.5 rounded-xl border ${errors.cinGst ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 outline-none transition-all`} required />
                  {errors.cinGst && <p className="text-red-500 text-xs mt-1">{errors.cinGst}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company Contact Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="tel" name="companyContact" value={formData.companyContact} onChange={handleInputChange} placeholder="Enter Mobile No." className={`w-full pl-12 pr-5 py-3.5 rounded-xl border ${errors.companyContact ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 outline-none transition-all`} required />
                  </div>
                  {errors.companyContact && <p className="text-red-500 text-xs mt-1">{errors.companyContact}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company PAN Card *</label>
                  <input type="text" name="companyPan" value={formData.companyPan} onChange={handleInputChange} placeholder="Enter PAN Details" className={`w-full px-5 py-3.5 rounded-xl border ${errors.companyPan ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 outline-none transition-all`} required />
                  {errors.companyPan && <p className="text-red-500 text-xs mt-1">{errors.companyPan}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">TAN Card *</label>
                  <input type="text" name="companyTan" value={formData.companyTan} onChange={handleInputChange} placeholder="Enter TAN Details" className={`w-full px-5 py-3.5 rounded-xl border ${errors.companyTan ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 outline-none transition-all`} required />
                  {errors.companyTan && <p className="text-red-500 text-xs mt-1">{errors.companyTan}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Registered Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea name="registeredAddress" value={formData.registeredAddress} onChange={handleInputChange} rows="3" placeholder="Full registered office address with Pincode" className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 outline-none transition-all resize-none" required></textarea>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. DIRECTOR DETAILS */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600"><Users className="w-7 h-7" /></div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#0d3863]">Director / Owner Details</h2>
                    <p className="text-gray-500 text-sm mt-1">Primary stakeholder information</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <label className="text-sm font-bold text-gray-700 mr-3">No. of Directors:</label>
                  <select value={noOfDirOption} onChange={handleNoOfDirectorsChange} className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none cursor-pointer">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3+">3+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-12">
                {directors.map((dir, index) => (
                  <div key={index} className="relative">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Director {index + 1}</h3>
                      {noOfDirOption === '3+' && index >= 3 && (
                        <button type="button" onClick={() => handleRemoveDirector(index)} className="text-red-500 hover:text-red-700 p-2 transition-colors"><Trash2 className="w-5 h-5" /></button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                        <input type="text" value={dir.name} onChange={(e) => handleDirectorChange(index, 'name', e.target.value)} placeholder="Director Name" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none transition-all" required />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type="email" value={dir.email} onChange={(e) => handleDirectorChange(index, 'email', e.target.value)} placeholder="director@company.com" className={`w-full pl-12 pr-5 py-3.5 rounded-xl border ${dirErrors[index]?.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} outline-none`} required />
                        </div>
                        {dirErrors[index]?.email && <p className="text-red-500 text-xs mt-1">{dirErrors[index].email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number *</label>
                        <input type="tel" value={dir.contact} onChange={(e) => handleDirectorChange(index, 'contact', e.target.value)} placeholder="Enter Contact Number" className={`w-full px-5 py-3.5 rounded-xl border ${dirErrors[index]?.contact ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} outline-none`} required />
                        {dirErrors[index]?.contact && <p className="text-red-500 text-xs mt-1">{dirErrors[index].contact}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Income *</label>
                        <div className="flex gap-3">
                          <input type="text" value={dir.incomeAmount} onChange={(e) => handleDirectorChange(index, 'incomeAmount', e.target.value)} placeholder="Enter Monthly Income" className="w-2/3 px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 outline-none text-gray-700" required />
                          <div className="w-1/3 relative">
                            <select value={dir.incomeUnit} onChange={(e) => handleDirectorChange(index, 'incomeUnit', e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 outline-none cursor-pointer text-gray-700 font-medium appearance-none">
                              <option value="Thousands">Thousand</option>
                              <option value="Lakhs">Lakh</option>
                              <option value="Crores">Cr</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Identification Number *</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type="text" value={dir.aadhar} onChange={(e) => handleDirectorChange(index, 'aadhar', e.target.value)} placeholder="Enter Aadhar Details" className={`w-full pl-12 pr-5 py-3.5 rounded-xl border ${dirErrors[index]?.aadhar ? 'border-red-400' : 'border-gray-200 bg-gray-50'} focus:bg-white outline-none`} required />
                        </div>
                        {dirErrors[index]?.aadhar && <p className="text-red-500 text-xs mt-1">{dirErrors[index].aadhar}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Personal PAN Card *</label>
                        <input type="text" value={dir.pan} onChange={(e) => handleDirectorChange(index, 'pan', e.target.value)} placeholder="Enter PAN Details" className={`w-full px-5 py-3.5 rounded-xl border ${dirErrors[index]?.pan ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} outline-none`} required />
                        {dirErrors[index]?.pan && <p className="text-red-500 text-xs mt-1">{dirErrors[index].pan}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Residential Address *</label>
                        <textarea value={dir.address} onChange={(e) => handleDirectorChange(index, 'address', e.target.value)} rows="2" placeholder="Enter Residential Address" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 outline-none resize-none" required></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {noOfDirOption === '3+' && (
                <div className="mt-8 flex justify-center border-t border-gray-100 pt-8">
                  <button type="button" onClick={handleAddDirector} className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"><Plus className="w-5 h-5" /> Add Another Director</button>
                </div>
              )}
            </motion.div>

            {/* 3. AUTHORIZED PERSON DETAILS */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><UserCheck className="w-7 h-7" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0d3863]">Authorized Contact Person</h2>
                  <p className="text-gray-500 text-sm mt-1">Person responsible for daily communications</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Contact Person Name *</label>
                  <input type="text" name="authName" value={formData.authName} onChange={handleInputChange} placeholder="Name" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <input type="email" name="authEmail" value={formData.authEmail} onChange={handleInputChange} placeholder="email@company.com" className={`w-full px-5 py-3.5 rounded-xl border ${errors.authEmail ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} outline-none`} required />
                  {errors.authEmail && <p className="text-red-500 text-xs mt-1">{errors.authEmail}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number *</label>
                  <input type="tel" name="authContact" value={formData.authContact} onChange={handleInputChange} placeholder="10 Digit Mobile No." className={`w-full px-5 py-3.5 rounded-xl border ${errors.authContact ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} outline-none`} required />
                  {errors.authContact && <p className="text-red-500 text-xs mt-1">{errors.authContact}</p>}
                </div>
              </div>
            </motion.div>

            {/* 4. DOCUMENT UPLOAD */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600"><FileText className="w-7 h-7" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0d3863]">Document Upload *</h2>
                  <p className="text-gray-500 text-sm mt-1">Upload a zip or pdf file containing all required documents</p>
                </div>
              </div>

              <div className="relative">
                <input type="file" id="file-upload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileChange} accept=".zip,.pdf" required />
                <div className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-colors ${formData.documents ? 'border-[#0d3863] bg-blue-50/50' : (errors.documents ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100')}`}>
                  <UploadCloud className={`w-12 h-12 mb-4 ${formData.documents ? 'text-[#0d3863]' : (errors.documents ? 'text-red-400' : 'text-gray-400')}`} />
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{formData.documents ? formData.documents.name : 'Click to Upload (.pdf or .zip only)'}</h3>
                  {errors.documents && <p className="text-red-500 text-sm mt-2">{errors.documents}</p>}
                </div>
              </div>
            </motion.div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={formStatus.loading} className="group relative inline-flex items-center justify-center px-12 py-5 bg-[#0d3863] text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:bg-[#154c82] hover:shadow-xl hover:shadow-[#0d3863]/20 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0">
                <span className="relative z-10 flex items-center gap-3">
                  {formStatus.loading ? 'Submitting Application...' : 'Submit Franchise Application'}
                  {!formStatus.loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
}