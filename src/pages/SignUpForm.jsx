import React, { useState } from 'react';
import { Link } from 'react-router';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    profileImage: null,
    firstName: '',
    secondName: '',
    email: '',
    phoneNumber: '',
    resume: null,
    officialDocument: null,
    status: '',
    sectors: [],
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' || name === 'resume' || name === 'officialDocument') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === 'sectors') {
      const sectorValue = e.target.value;
      if (e.target.checked) {
        setFormData({ ...formData, sectors: [...formData.sectors, sectorValue] });
      } else {
        setFormData({ 
          ...formData, 
          sectors: formData.sectors.filter(sector => sector !== sectorValue) 
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length === 0) {
      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', formData);
        alert('Account created successfully!');
        setIsSubmitting(false);
      }, 2000);
    } else {
      setErrors(newErrors);
      setIsSubmitting(false);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.firstName) errors.firstName = 'First name is required';
    if (!data.secondName) errors.secondName = 'Second name is required';
    if (!data.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Email is invalid';
    if (!data.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!data.resume) errors.resume = 'Resume is required';
    if (!data.officialDocument) errors.officialDocument = 'Official document is required';
    if (!data.status) errors.status = 'Status is required';
    if (data.sectors.length === 0) errors.sectors = 'At least one sector must be selected';
    if (!data.password) errors.password = 'Password is required';
    else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const sectorsOptions = [
    'Technology',
    'Healthcare',
    'Education',
    'Business',
    'Agriculture',
    'Construction',
    'Manufacturing',
    'Hospitality'
  ];

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl mx-auto">
        {/* Header Section */}
  <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-800 dark:to-purple-900 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Join Inecosystem-Bridge
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Create your individual account and become part of our thriving educational ecosystem
          </p>
        </div>

        {/* Main Form Container */}
  <div className="bg-white/90 dark:bg-gray-900 dark:border-gray-700 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 dark:border dark:border-gray-700 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-800 dark:to-purple-900 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">Create Your Account</h2>
          </div>

          <div className="px-8 py-10 sm:px-12">
            <div className="space-y-10">
              
              {/* Profile Image Section */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    {formData.profileImage ? (
                      <img 
                        src={URL.createObjectURL(formData.profileImage)} 
                        alt="Profile preview" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-4l-2-2H9L7 7H5a2 2 0 00-2 2z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                    <input 
                      name="profileImage" 
                      type="file" 
                      className="sr-only" 
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Upload Your Profile Photo</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose a clear, professional photo</p>
              </div>

              {/* Personal Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* First Name */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                    First Name *
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
                      errors.firstName ? 'border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-white' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-gray-900 dark:text-white'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errors.firstName}</p>}
                </div>

                {/* Second Name */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Second Name *
                  </label>
                  <input
                    name="secondName"
                    type="text"
                    value={formData.secondName}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
                      errors.secondName ? 'border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-white' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-gray-900 dark:text-white'
                    }`}
                    placeholder="Enter your second name"
                  />
                  {errors.secondName && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errors.secondName}</p>}
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
                      errors.email ? 'border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-white' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-gray-900 dark:text-white'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Phone Number *
                  </label>
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
                      errors.phoneNumber ? 'border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-white' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-gray-900 dark:text-white'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errors.phoneNumber}</p>}
                </div>
              </div>

              {/* Status and Sector */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3 min-w-0 w-full block">
                  <label className="block text-lg sm:text-base font-semibold text-gray-700 dark:text-gray-200 w-full">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`block  w-full min-w-0 max-w-full px-4 py-3 sm:py-2 sm:text-base text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
                      errors.status ? 'border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-white' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-gray-900 dark:text-white'
                    }`}
                  >
                    <option value="">Select your status</option>
                    <option value="tvet-student">TVET Student</option>
                    <option value="tvet-graduate">TVET Graduate</option>
                  </select>
                  {errors.status && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errors.status}</p>}
                </div>
              </div>

             

              {/* File Upload Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Resume Upload */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Resume (CV) *
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <label className="relative cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                      <span>Choose File</span>
                      <input 
                        name="resume" 
                        type="file" 
                        className="sr-only" 
                        onChange={handleChange}
                        accept=".pdf,.doc,.docx"
                      />
                    </label>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                    {formData.resume && (
                      <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">✓ {formData.resume.name}</p>
                    )}
                  </div>
                  {errors.resume && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errors.resume}</p>}
                </div>

                {/* Official Documents */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Official Documents (diploma or degree or's) *
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-all duration-200">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <label className="relative cursor-pointer bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                      <span>Choose Files</span>
                      <input 
                        name="officialDocument" 
                        type="file" 
                        className="sr-only" 
                        onChange={handleChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                      />
                    </label>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">PDF, JPG, PNG up to 10MB each</p>
                    {formData.officialDocument && (
                      <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">✓ {formData.officialDocument.name}</p>
                    )}
                  </div>
                  {errors.officialDocument && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errors.officialDocument}</p>}
                </div>
              </div>

              {/* Password Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Password */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 pr-12 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
                        errors.password ? 'border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-white' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-gray-900 dark:text-white'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 pr-12 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-white' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-gray-900 dark:text-white'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-800 dark:to-purple-900 hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-900 dark:hover:to-purple-950 text-white text-xl font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </div>
                  ) : (
                    'Create My Account'
                  )}
                </button>
              </div>

              {/* Sign In Link */}
              <div className="text-center pt-6">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Already have an account?{' '}
                 
                  <Link className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline transition-all duration-200" to="/Login">
                    Sign In Here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;