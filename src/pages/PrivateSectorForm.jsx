import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import logo from '../../public/images/logo.png';
import { API_URL } from "../lib/API";

const PrivateSectorForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    companyRegId: "",
    companySize: "",
    focus: "",
    location: "",
    contactNumber: "",
    email: "",
    offerings: [""],
    legalDocument: null,
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const profileInputRef = useRef();
  const legalDocInputRef = useRef();
 const [credentials, setCredentials] = useState({
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value, files, dataset } = e.target;
    
    if (name === "legalDocument") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "profileImage") {
      const file = files[0];
      setFormData({ ...formData, profileImage: file });
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => setProfilePreview(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setProfilePreview(null);
      }
    } else if (name === "offerings") {
      const idx = parseInt(dataset.idx, 10);
      const newOfferings = [...formData.offerings];
      newOfferings[idx] = value;
      setFormData({ ...formData, offerings: newOfferings });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First Name is required";
      if (!formData.lastName) newErrors.lastName = "Last Name is required";
      if (!formData.contactNumber) newErrors.contactNumber = "Contact number is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      
      if (!credentials.password) newErrors.password = "Password is required";
      else if (credentials.password.length < 8) newErrors.password = "Password must be at least 8 characters";
      if (credentials.password !== credentials.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
   
    } else if (step === 2) {
      if (!formData.companyName) newErrors.companyName = "Company name is required";
      if (!formData.companySize) newErrors.companySize = "Company size is required";
      if (!formData.focus) newErrors.focus = "Focus is required";
      if (!formData.location) newErrors.location = "Location is required";
      if (!formData.offerings || !formData.offerings.some((o) => o.trim())) newErrors.offerings = "At least one offering is required";
      if (!formData.legalDocument) newErrors.legalDocument = "RDB registration proof is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    console.log("Validating step 1", validateStep(1));
    if (validateStep(1)) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(2)) {
      setIsSubmitting(true);
      
      try {
        // Create FormData for file upload
        const submitData = new FormData();
        
        // Add user data
        submitData.append('email', formData.email);
        submitData.append('password', credentials.password);
        submitData.append('contactNumber', formData.contactNumber);
        submitData.append('companyRepresentative', `${formData.firstName} ${formData.lastName}`);
        
        // Add company data
        submitData.append('companyName', formData.companyName);
        submitData.append('companyRegId', formData.companyRegId);
        submitData.append('companySize', formData.companySize);
        submitData.append('focus', formData.focus);
        submitData.append('location', formData.location);
        
        // Add offerings as JSON string
        submitData.append('offerings', JSON.stringify(formData.offerings.filter(o => o.trim())));
        
        // Add files
        if (formData.profileImage) {
          submitData.append('profileImage', formData.profileImage);
        }
        if (formData.legalDocument) {
          submitData.append('legalDocument', formData.legalDocument);
        }
        
        // Submit to backend API
        const response = await fetch(`${API_URL}auth/signup/private-sector`, {
          method: 'POST',
          body: submitData,
        });
        
        const result = await response.json();
        
        if (response.ok) {
          alert("Private Sector Account created successfully! Waiting for TVET approval.");
          navigate('/login'); // Redirect to login page
        } else {
          setErrors(result.errors || { general: result.message });
          alert(`Registration failed: ${result.message}`);
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({ general: "Network error. Please try again." });
        alert("Registration failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

    const handleCredentialsChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
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
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Register your company and become part of our growing ecosystem.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <span className="mt-2 text-sm font-medium">Credentials</span>
            </div>
            <div className={`w-16 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <span className="mt-2 text-sm font-medium">Company Info</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-800 overflow-hidden max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="px-8 py-10 sm:px-12 space-y-8">
            {currentStep === 2 ? (
              <>
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-blue-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600 text-4xl">+</span>
                    )}
                  </div>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    ref={profileInputRef}
                    style={{ display: "none" }}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => profileInputRef.current.click()}
                  >
                    {profilePreview ? "Change Profile Picture" : "Upload Profile Picture"}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Recommended size: 400x400px</p>
                </div>

                {/* Company Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[{
                    label: "Company Name",
                    name: "companyName",
                  },
                  {
                    label: "Company Reg ID",
                    name: "companyRegId",
                  },
                  {
                    label: "Company Size",
                    name: "companySize",
                  },
                  {
                    label: "Focus",
                    name: "focus",
                  },
                  {
                    label: "Location",
                    name: "location",
                  },
                  ].map(({ label, name, type = "text" }) => (
                    <div key={name} className="space-y-2">
                      <label className="block text-base font-semibold text-gray-700 dark:text-gray-200">
                        {label} *
                      </label>
                      <input
                        name={name}
                        type={type}
                        value={formData[name]}
                        onChange={handleChange}
                        className={`w-full px-5 py-3 text-base border rounded-xl focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 ${
                          errors[name]
                            ? "border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950"
                            : "border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                        }`}
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                      {errors[name] && (
                        <p className="text-red-500 text-sm">{errors[name]}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Offerings (Multiple) */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700 dark:text-gray-200">
                    Offerings *
                  </label>
                  {formData.offerings.map((offering, idx) => (
                    <div key={idx} className="flex items-center space-x-2 mb-2">
                      <input
                        name="offerings"
                        data-idx={idx}
                        type="text"
                        value={offering}
                        onChange={handleChange}
                        className={`w-full px-5 py-3 text-base border rounded-xl focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 ${
                          errors.offerings && !offering.trim()
                            ? "border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950"
                            : "border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                        }`}
                        placeholder={`Offering ${idx + 1}`}
                      />
                      {formData.offerings.length > 1 && (
                        <button
                          type="button"
                          className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              offerings: formData.offerings.filter((_, i) => i !== idx),
                            });
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                    onClick={() => setFormData({ ...formData, offerings: [...formData.offerings, ""] })}
                  >
                    Add Offering
                  </button>
                  {errors.offerings && (
                    <p className="text-red-500 text-sm">{errors.offerings}</p>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700 dark:text-gray-200">
                    Legal Document (RDB Registration Proof) *
                  </label>
                  <input
                    name="legalDocument"
                    type="file"
                    ref={legalDocInputRef}
                    onChange={handleChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-5 py-3 text-base border rounded-xl"
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="w-full bg-gray-100 dark:bg-gray-800 px-5 py-3 text-left rounded-xl border border-gray-300 dark:border-gray-700"
                    onClick={() => legalDocInputRef.current.click()}
                  >
                    {formData.legalDocument ? formData.legalDocument.name : "Choose file..."}
                  </button>
                  {errors.legalDocument && (
                    <p className="text-red-500 text-sm">{errors.legalDocument}</p>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="pt-6 flex space-x-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xl font-bold py-4 px-8 rounded-2xl shadow-lg transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg hover:scale-[1.02] transition disabled:opacity-70"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Credentials Step */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[
                    {
                      label: "First Name",
                      name: "firstName",
                    },
                    {
                      label: "Last Name",
                      name: "lastName",
                    },
                    {
                      label: "Contact Number",
                      name: "contactNumber",
                    },
                    {
                      label: "Email",
                      name: "email",
                      type: "email",
                    },
                  ].map(({ label, name, type = "text" }) => (
                    <div key={name} className="space-y-2">
                      <label className="block text-base font-semibold text-gray-700 dark:text-gray-200">
                        {label} *
                      </label>
                      <input
                        name={name}
                        type={type}
                        value={formData[name]}
                        onChange={handleChange}
                        className={`w-full px-5 py-3 text-base border rounded-xl focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 ${
                          errors[name]
                            ? "border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950"
                            : "border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                        }`}
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                      {errors[name] && (
                        <p className="text-red-500 text-sm">{errors[name]}</p>
                      )}
                    </div>
                  ))}

                  <div className="space-y-2">
                    <label className="block text-base font-semibold text-gray-700 dark:text-gray-200">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleCredentialsChange}
                      className={`w-full px-5 py-3 text-base border rounded-xl focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 ${
                        errors.password ? "border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950" : "border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      }`}
                      placeholder="Enter password"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  </div>

                 <div className="space-y-2">
                    <label className="block text-base font-semibold text-gray-700 dark:text-gray-200">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={credentials.confirmPassword}
                      onChange={handleCredentialsChange}
                      className={`w-full px-5 py-3 text-base border rounded-xl focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 ${
                        errors.confirmPassword ? "border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950" : "border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      }`}
                      placeholder="Confirm password"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg hover:scale-[1.02] transition"
                  >
                    Next
                  </button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Already registered?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Sign In Here
                    </Link>
                  </p>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivateSectorForm;