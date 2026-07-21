import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, UserCheck, UploadCloud, Send, 
  MapPin, Phone, Mail, FileText, Briefcase, CreditCard,
  ShieldCheck, ArrowRight, Plus, Trash2, ChevronDown
} from 'lucide-react';

// --- IMAGE IMPORTS ---
import franchiseBannerImg from "../../assets/contact-banner.jpg";

export default function FranchisePage() {
  const containerRef = useRef(null);

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
  const [formStatus, setFormStatus] = useState({ loading: false, message: '', isError: false });

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, documents: e.target.files[0] }));
  };

  // Handles dropdown change (1, 2, or 3+)
  const handleNoOfDirectorsChange = (e) => {
    const val = e.target.value;
    setNoOfDirOption(val);
    
    let targetCount = 1;
    if (val === '2') targetCount = 2;
    if (val === '3+') targetCount = 3;

    setDirectors(prev => {
      const newArr = [...prev];
      // Shrink array if switching to a lower number
      if (newArr.length > targetCount && val !== '3+') {
        newArr.length = targetCount;
      }
      // Grow array if needed
      while (newArr.length < targetCount) {
        newArr.push({ ...emptyDirector });
      }
      return newArr;
    });
  };

  // Handles individual director field changes
  const handleDirectorChange = (index, field, value) => {
    const updatedDirectors = [...directors];
    updatedDirectors[index][field] = value;
    setDirectors(updatedDirectors);
  };

  // Adds a new director when "Add Another Director" is clicked
  const handleAddDirector = () => {
    setDirectors(prev => [...prev, { ...emptyDirector }]);
  };

  // Removes a specifically added director
  const handleRemoveDirector = (index) => {
    const updatedDirectors = directors.filter((_, i) => i !== index);
    setDirectors(updatedDirectors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, message: '', isError: false });
    
    // Combine formData and directors array to send to your backend
    const submissionData = {
      ...formData,
      directorsData: directors
    };

    console.log("Submitting Data:", submissionData);

    // Simulate API Call
    setTimeout(() => {
      setFormStatus({ loading: false, message: 'Application submitted successfully! Our team will contact you soon.', isError: false });
      // Reset form logic can be added here
    }, 2000);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-transparent font-sans text-gray-600 selection:bg-[#0d3863]/20 selection:text-[#0d3863]">
      
      {/* --- TOP BANNER SECTION --- */}
      <section className="relative w-full h-[350px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url(${franchiseBannerImg})` }}
        ></div>
        {/* WHITE GRADIENT SHADOW REMOVED FROM HERE */}

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-medium text-sm mb-6 border border-white/20"
          >
            <Briefcase className="w-4 h-4" /> Partner With Us
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-extrabold text-[#fff] tracking-tight drop-shadow-sm"
          >
            Franchise Application
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl font-medium"
          >
            Join the Techhansa Retail network. Fill out the comprehensive form below to start your journey as our verified franchise partner.
          </motion.p>
        </div>
      </section>

      {/* --- MAIN FORM SECTION --- */}
      <section className="relative z-10 pb-24 px-4 lg:px-12 -mt-10">
        <div className="max-w-5xl mx-auto">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Status Message */}
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
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0d3863]">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0d3863]">Registered Company Details</h2>
                  <p className="text-gray-500 text-sm mt-1">Provide your official business information</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Registered Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="M/s Techhansa Solutions Pvt Ltd" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">CIN / GST Number *</label>
                  <input type="text" name="cinGst" value={formData.cinGst} onChange={handleInputChange} placeholder="22AAAAA0000A1Z5" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company Contact Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="tel" name="companyContact" value={formData.companyContact} onChange={handleInputChange} placeholder="+91 xxxxx xxxxx" className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company PAN Card *</label>
                  <input type="text" name="companyPan" value={formData.companyPan} onChange={handleInputChange} placeholder="ABCDE1234F" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">TAN Card *</label>
                  <input type="text" name="companyTan" value={formData.companyTan} onChange={handleInputChange} placeholder="TAN Number" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Registered Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea name="registeredAddress" value={formData.registeredAddress} onChange={handleInputChange} rows="3" placeholder="Full registered office address with Pincode" className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all resize-none" required></textarea>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. DIRECTOR DETAILS */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#0d3863]">Director / Owner Details</h2>
                    <p className="text-gray-500 text-sm mt-1">Primary stakeholder information</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <label className="text-sm font-bold text-gray-700 mr-3">No. of Directors:</label>
                  <select value={noOfDirOption} onChange={handleNoOfDirectorsChange} className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none cursor-pointer focus:border-[#0d3863]">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3+">3+</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Director Fields */}
              <div className="space-y-12">
                {directors.map((dir, index) => (
                  <div key={index} className="relative">
                    
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Director {index + 1}
                      </h3>
                      {/* Allow removing added directors if count is > 3 and option is 3+ */}
                      {noOfDirOption === '3+' && index >= 3 && (
                        <button type="button" onClick={() => handleRemoveDirector(index)} className="text-red-500 hover:text-red-700 p-2 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                        <input type="text" value={dir.name} onChange={(e) => handleDirectorChange(index, 'name', e.target.value)} placeholder="Director Name" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type="email" value={dir.email} onChange={(e) => handleDirectorChange(index, 'email', e.target.value)} placeholder="director@company.com" className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number *</label>
                        <input type="tel" value={dir.contact} onChange={(e) => handleDirectorChange(index, 'contact', e.target.value)} placeholder="+91 xxxxx xxxxx" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                      </div>
                      
                      {/* Compact and Separate Monthly Income Input */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Income *</label>
                        <div className="flex gap-3">
                          {/* Amount Input (Allows text like "5-6") */}
                          <input 
                            type="text" 
                            value={dir.incomeAmount} 
                            onChange={(e) => handleDirectorChange(index, 'incomeAmount', e.target.value)} 
                            placeholder="e.g. 5-6" 
                            className="w-2/3 px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all text-gray-700" 
                            required 
                          />
                          {/* Separate Unit Dropdown */}
                          <div className="w-1/3 relative">
                            <select 
                              value={dir.incomeUnit} 
                              onChange={(e) => handleDirectorChange(index, 'incomeUnit', e.target.value)} 
                              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none cursor-pointer text-gray-700 font-medium appearance-none transition-all"
                            >
                              <option value="Thousands">Thousand</option>
                              <option value="Lakhs">Lakh</option>
                              <option value="Crores">Cr</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Aadhar Card Number *</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type="text" value={dir.aadhar} onChange={(e) => handleDirectorChange(index, 'aadhar', e.target.value)} placeholder="xxxx xxxx xxxx" className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Personal PAN Card *</label>
                        <input type="text" value={dir.pan} onChange={(e) => handleDirectorChange(index, 'pan', e.target.value)} placeholder="ABCDE1234F" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Residential Address *</label>
                        <textarea value={dir.address} onChange={(e) => handleDirectorChange(index, 'address', e.target.value)} rows="2" placeholder="Complete residential address" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all resize-none" required></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Director Button (Only visible if 3+ is selected) */}
              {noOfDirOption === '3+' && (
                <div className="mt-8 flex justify-center border-t border-gray-100 pt-8">
                  <button 
                    type="button" 
                    onClick={handleAddDirector}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
                  >
                    <Plus className="w-5 h-5" /> Add Another Director
                  </button>
                </div>
              )}

            </motion.div>

            {/* 3. AUTHORIZED PERSON DETAILS */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0d3863]">Authorized Contact Person</h2>
                  <p className="text-gray-500 text-sm mt-1">Person responsible for daily communications</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Contact Person Name *</label>
                  <input type="text" name="authName" value={formData.authName} onChange={handleInputChange} placeholder="Name" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <input type="email" name="authEmail" value={formData.authEmail} onChange={handleInputChange} placeholder="email@company.com" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number *</label>
                  <input type="tel" name="authContact" value={formData.authContact} onChange={handleInputChange} placeholder="+91 xxxxx xxxxx" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0d3863]/20 focus:border-[#0d3863] outline-none transition-all" required />
                </div>
              </div>
            </motion.div>

            {/* 4. DOCUMENT UPLOAD */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0d3863]">Document Upload *</h2>
                  <p className="text-gray-500 text-sm mt-1">Upload a zip file containing all required documents (PAN, Aadhaar, GST cert)</p>
                </div>
              </div>

              <div className="relative">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  onChange={handleFileChange}
                  accept=".zip,.pdf,.jpg,.jpeg,.png"
                  required
                />
                <div className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-colors ${formData.documents ? 'border-[#0d3863] bg-blue-50/50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                  <UploadCloud className={`w-12 h-12 mb-4 ${formData.documents ? 'text-[#0d3863]' : 'text-gray-400'}`} />
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {formData.documents ? formData.documents.name : 'Click to Upload or Drag & Drop'}
                  </h3>
                  <p className="text-gray-500 text-sm text-center">
                    {formData.documents ? 'File selected successfully. Ready to submit.' : 'Upload a combined PDF or ZIP file (Max size: 10MB)'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={formStatus.loading}
                className="group relative inline-flex items-center justify-center px-12 py-5 bg-[#0d3863] text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:bg-[#154c82] hover:shadow-xl hover:shadow-[#0d3863]/20 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
              >
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