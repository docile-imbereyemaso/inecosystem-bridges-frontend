import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import logo from '../../public/images/logo.png';
import { API_URL } from "../lib/API"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profileImage: null,
    firstName: '',
    secondName: '',
    email: '',
    phoneNumber: '',
    resume: null,
    officialDocument: null,
    user_type: 'individual',
    status: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const profileInputRef = useRef();
  const resumeInputRef = useRef();
  const documentInputRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profileImage') {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => setProfilePreview(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setProfilePreview(null);
      }
    } else if (name === 'resume' || name === 'officialDocument') {
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

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.secondName) newErrors.secondName = 'Second name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
      if (!formData.status) newErrors.status = 'Status is required';
    } else if (step === 2) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.resume) newErrors.resume = 'Resume is required';
      
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(1)) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("errors before submit:",validateStep(2), errors);
    if (validateStep(2)) {
      setIsSubmitting(true);
     
      try {
        // Create FormData for file upload
        const submitData = new FormData();
        
        // Add user data
        submitData.append('firstName', formData.firstName);
        submitData.append('secondName', formData.secondName);
        submitData.append('email', formData.email);
        submitData.append('phoneNumber', formData.phoneNumber);
        submitData.append('password', formData.password);
        submitData.append('user_type', formData.user_type);
        submitData.append('status', formData.status);
        submitData.append('sectors', JSON.stringify(formData.sectors));
        
        // Add files
        if (formData.profileImage) {
          submitData.append('profileImage', formData.profileImage);
        }
        if (formData.resume) {
          submitData.append('resume', formData.resume);
        }
        if (formData.officialDocument) {
          submitData.append('officialDocument', formData.officialDocument);
        }
        console.log(formData);
        // Submit to backend API
        const response = await fetch(`${API_URL}auth/signup/individual`, {
          method: 'POST',
          body: submitData,
        });
        
        const result = await response.json();
        
        if (response.ok) {
          toast.success('Individual account has been successfully created!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            navigate('/login');
          }, 3200);
        } else {
          setErrors(result.errors || { general: result.message });
          toast.error(result.message || 'Registration failed: Account may already exist.', {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({ general: "Network error. Please try again." });
        toast.error('Registration failed. Please try again.', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
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
    <>
      <ToastContainer />
      <div className="min-h-screen py-12 px-4 bg-gray-100 sm:px-6 lg:px-8 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 dark:bg-gray-900">
           <Link to="/" className="text-center flex items-center justify-center gap-3">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2 shadow-lg">
                            <span className="text-white font-bold text-xl">
                              <img src={logo} alt="inecosystem-bridge" />
                            </span>
                          </div>
                          <h1 className="text-2xl font-bold text-indigo-600 dark:text-white mb-1">
                            INECOSYSTEM-BRIDGE
                          </h1>
                        </Link>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Create your individual account and become part of our thriving educational ecosystem
            </p>
          </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <span className="mt-2 text-sm font-medium">Personal Info</span>
            </div>
            <div className={`w-16 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <span className="mt-2 text-sm font-medium">Credentials & Docs</span>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-700
         backdrop-blur-sm rounded-lg overflow-hidden max-w-3xl mx-auto">
          {/* Form Header */}
          <div className="bg-blue-500  dark:bg-blue-900 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">
              {currentStep === 1 ? "Personal Information" : "Account Credentials & Documents"}
            </h2>
          </div>

          <div className="px-3 py-5 sm:px-4">
            <form onSubmit={handleSubmit} className="space-y-10">
              {currentStep === 1 ? (
                <>
                  {/* Profile Image Section */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                        {profilePreview ? (
                          <img 
                            src={profilePreview} 
                            alt="Profile preview" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </div>
                      <input
                        name="profileImage"
                        type="file"
                        ref={profileInputRef}
                        className="sr-only"
                        onChange={handleChange}
                        accept="image/*"
                      />
                      <button
                        type="button"
                        onClick={() => profileInputRef.current.click()}
                        className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-4l-2-2H9L7 7H5a2 2 0 00-2 2z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Upload Your Profile Photo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose a clear, professional photo</p>
                  </div>

                  {/* Personal Information Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* First Name */}
  <div className="space-y-2">
    <label className="block text-base font-medium text-gray-700 dark:text-gray-200">
      First Name *
    </label>
    <input
      name="firstName"
      type="text"
      value={formData.firstName}
      onChange={handleChange}
      className={`w-full px-3 py-2 text-base border-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
        errors.firstName
          ? 'border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-white'
          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-gray-900 dark:text-white'
      }`}
      placeholder="Enter your first name"
    />
    {errors.firstName && (
      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
        {errors.firstName}
      </p>
    )}
  </div>

  {/* Second Name */}
  <div className="space-y-2">
    <label className="block text-base font-medium text-gray-700 dark:text-gray-200">
      Second Name *
    </label>
    <input
      name="secondName"
      type="text"
      value={formData.secondName}
      onChange={handleChange}
      className={`w-full px-3 py-2 text-base border-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
        errors.secondName
          ? 'border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-white'
          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-gray-900 dark:text-white'
      }`}
      placeholder="Enter your second name"
    />
    {errors.secondName && (
      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
        {errors.secondName}
      </p>
    )}
  </div>

  {/* Email */}
  <div className="space-y-2">
    <label className="block text-base font-medium text-gray-700 dark:text-gray-200">
      Email Address *
    </label>
    <input
      name="email"
      type="email"
      value={formData.email}
      onChange={handleChange}
      className={`w-full px-3 py-2 text-base border-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
        errors.email
          ? 'border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-white'
          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-gray-900 dark:text-white'
      }`}
      placeholder="Enter your email address"
    />
    {errors.email && (
      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
        {errors.email}
      </p>
    )}
  </div>

  {/* Phone Number */}
  <div className="space-y-2">
    <label className="block text-base font-medium text-gray-700 dark:text-gray-200">
      Phone Number *
    </label>
    <input
      name="phoneNumber"
      type="tel"
      value={formData.phoneNumber}
      onChange={handleChange}
      className={`w-full px-3 py-2 text-base border-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
        errors.phoneNumber
          ? 'border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-white'
          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-gray-900 dark:text-white'
      }`}
      placeholder="Enter your phone number"
    />
    {errors.phoneNumber && (
      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
        {errors.phoneNumber}
      </p>
    )}
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
                        className={`block w-full text-gray-900 min-w-0 max-sm:max-w-55 px-4 py-3 sm:py-2 sm:text-base text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 ${
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

             
               

                  {/* Next Button */}
                  <div className="pt-8">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-blue-500  dark:bg-blue-900  hover:to-purple-700 dark:hover:from-blue-900 dark:hover:to-purple-950 text-white text-xl font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl"
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <>
                {/* Resume Upload */}

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Password */}
  <div className="space-y-3">
    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
      Password *
    </label>
    <input
      name="password"
      type={showPassword ? "text" : "password"}
      value={formData.password}
      onChange={handleChange}
      placeholder="Enter your password"
      className="w-full px-5 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
    />
  </div>

  {/* Confirm Password */}
  <div className="space-y-3">
    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
      Confirm Password *
    </label>
    <input
      name="confirmPassword"
      type={showConfirmPassword ? "text" : "password"}
      value={formData.confirmPassword}
      onChange={handleChange}
      placeholder="Confirm your password"
      className="w-full px-5 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
    />
  </div>


  <div className="space-y-4">
  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
    Resume (CV) *
  </label>
  <input
    name="resume"
    type="file"
    ref={resumeInputRef}
    className="sr-only"
    onChange={handleChange}
    accept=".pdf,.jpg,.jpeg,.png"
  />
  <div 
    onClick={() => resumeInputRef.current.click()}
    className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
  >
    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-block transform hover:scale-105">
      Choose File
    </span>
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
    Official Documents (diploma or degree) <small className='text-xs font-semibold italic'>TVET Graduate</small>
  </label>
  <input
    name="officialDocument"
    type="file"
    ref={documentInputRef}
    className="sr-only"
    onChange={handleChange}
    accept=".pdf,.jpg,.jpeg,.png"
  />
  <div 
    onClick={() => documentInputRef.current.click()}
    className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
  >
    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-block transform hover:scale-105">
      Choose Files
    </span>
    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">PDF, JPG, PNG up to 10MB each</p>
    {formData.officialDocument && (
      <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">✓ {formData.officialDocument.name}</p>
    )}
  </div>
  {errors.officialDocument && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errors.officialDocument}</p>}
</div>
</div>

{/* Navigation Buttons */}
<div className="pt-8 flex space-x-4">
  {/* Back Button */}
  <button
    type="button"
    onClick={handlePrevStep}
    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
  >
    ← Back
  </button>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={isSubmitting}
    className={`flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 text-white text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
    }`}
  >
    {isSubmitting ? (
      <div className="flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
               5.291A7.962 7.962 0 014 12H0c0 
               3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Creating Account...
      </div>
    ) : (
      'Create My Account →'
    )}
  </button>
</div>


                </>
              )}

              {/* Sign In Link */}
              {currentStep === 1 && (
                <div className="text-center pt-6">
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Already have an account?{' '}
                    <Link className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline transition-all duration-200" to="/Login">
                      Sign In Here
                    </Link>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignUpForm;