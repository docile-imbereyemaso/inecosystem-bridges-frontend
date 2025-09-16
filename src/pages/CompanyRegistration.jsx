import { useState } from 'react';
import { FiPlus, FiX, FiUpload, FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const PrivateSectorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companySize: '',
    industry: '',
    bio: '',
    skills: [''],
    sectors: []
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  const industries = [
    'Information and Communication Technology (ICT)',
    'Construction and Building Services',
    'Agriculture and Food Processing',
    'Tourism and Hospitality',
    'Manufacturing and Industrial Technology',
    'Beauty and Aesthetics',
    'Arts and Crafts',
    'Transportation and Logistics',
    'Retail and Business Services',
    'Finance and Insurance'
  ];

  const tvetSectors = [
    'Information and Communication Technology (ICT)',
    'Construction and Building Services',
    'Agriculture and Food Processing',
    'Tourism and Hospitality',
    'Manufacturing and Industrial Technology',
    'Beauty and Aesthetics',
    'Arts and Crafts',
    'Transportation and Logistics',
    'Retail and Business Services',
    'Finance and Insurance'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
  if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index) => {
    if (formData.skills.length > 1) {
      const newSkills = formData.skills.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        skills: newSkills
      }));
    }
  };

  const handleSectorChange = (sector) => {
    const newSectors = formData.sectors.includes(sector)
      ? formData.sectors.filter(s => s !== sector)
      : [...formData.sectors, sector];
    
    setFormData(prev => ({
      ...prev,
      sectors: newSectors
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.companySize) newErrors.companySize = 'Company size is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.bio.trim()) newErrors.bio = 'Company bio is required';
    if (formData.skills.some(skill => !skill.trim())) newErrors.skills = 'All skill fields must be filled';
    if (formData.sectors.length === 0) newErrors.sectors = 'At least one TVET sector must be selected';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  
  try {
    const registrationData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      user_type: 'private_sector',
      company_name: formData.companyName,
      company_size: formData.companySize,
      industry: formData.industry,
      bio: formData.bio,
      skills: formData.skills.filter(skill => skill.trim() !== ''),
      sectors: formData.sectors
    };

    console.log('Sending registration data:', registrationData);

    // Use the improved API call
    const data = await authAPI.register(registrationData);

    if (data.success) {
      alert('Registration submitted successfully! Your account will be activated after approval.');
      navigate('/login');
    } else {
      alert(data.message || 'Registration failed. Please try again.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert(error.message || 'An error occurred during registration. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Private Sector Registration
          </h1>
          <button className='bg-gray-500 rounded p-2 cursor-pointer hover:bg-black'>Back home</button>
          <p className="text-lg text-gray-300">
            Register your company to join the INECOSYSTEM platform
          </p>
        </div>

        {/* Registration Form */}
        <div className="card bg-slate-900 shadow-2xl border border-slate-700">
          <div className="card-body p-8">
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 border-b border-slate-600 pb-2">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-white">First Name *</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className={`input input-bordered bg-slate-800 text-white border-slate-600 w-full ${errors.firstName ? 'input-error' : 'focus:input-primary focus:border-blue-500'}`}
                    />
                    {errors.firstName && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.firstName}</span>
                      </label>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-white">Last Name *</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className={`input input-bordered bg-slate-800 text-white border-slate-600 w-full ${errors.lastName ? 'input-error' : 'focus:input-primary focus:border-blue-500'}`}
                    />
                    {errors.lastName && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.lastName}</span>
                      </label>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-white">Email Address *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className={`input input-bordered bg-slate-800 text-white border-slate-600 w-full ${errors.email ? 'input-error' : 'focus:input-primary focus:border-blue-500'}`}
                    />
                    {errors.email && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.email}</span>
                      </label>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-white">Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={`input input-bordered bg-slate-800 text-white border-slate-600 w-full ${errors.phone ? 'input-error' : 'focus:input-primary focus:border-blue-500'}`}
                    />
                    {errors.phone && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.phone}</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Information Section */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 border-b border-slate-600 pb-2">
                  Company Information
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-white">Company Name *</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter your company name"
                      className={`input input-bordered bg-slate-800 text-white border-slate-600 w-full ${errors.companyName ? 'input-error' : 'focus:input-primary focus:border-blue-500'}`}
                    />
                    {errors.companyName && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.companyName}</span>
                      </label>
                    )}
                  </div>

                  {/* Company Size */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-white">Company Size *</span>
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className={`select select-bordered bg-slate-800 text-white border-slate-600 w-full ${errors.companySize ? 'select-error' : 'focus:select-primary focus:border-blue-500'}`}
                    >
                      <option value="" disabled className="text-gray-400">Select company size</option>
                      {companySizes.map((size, index) => (
                        <option key={index} value={size} className="text-white">
                          {size}
                        </option>
                      ))}
                    </select>
                    {errors.companySize && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.companySize}</span>
                      </label>
                    )}
                  </div>

                  {/* Industry */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-white">Industry *</span>
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className={`select select-bordered bg-slate-800 text-white border-slate-600 w-full ${errors.industry ? 'select-error' : 'focus:select-primary focus:border-blue-500'}`}
                    >
                      <option value="" disabled className="text-gray-400">Select your industry</option>
                      {industries.map((industry, index) => (
                        <option key={index} value={industry} className="text-white">
                          {industry}
                        </option>
                      ))}
                    </select>
                    {errors.industry && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.industry}</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Company Bio */}
                <div className="form-control mt-6">
                  <label className="label">
                    <span className="label-text font-medium text-white">Company Bio *</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about your company, its mission, and what makes it unique..."
                    rows={4}
                    className={`textarea textarea-bordered bg-slate-800 text-white border-slate-600 w-full ${errors.bio ? 'textarea-error' : 'focus:textarea-primary focus:border-blue-500'}`}
                  />
                  {errors.bio && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.bio}</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 border-b border-slate-600 pb-2">
                  Company Skills & Expertise
                </h2>
                
                <div className="space-y-3">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="form-control">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          placeholder={`Skill ${index + 1}`}
                          className="input input-bordered bg-slate-800 text-white border-slate-600 flex-1 focus:input-primary focus:border-blue-500"
                        />
                        {formData.skills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="btn btn-outline btn-error btn-square"
                          >
                            <FiX size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn btn-outline btn-primary"
                  >
                    <FiPlus size={20} />
                    Add Another Skill
                  </button>
                  
                  {errors.skills && (
                    <div className="text-error text-sm">{errors.skills}</div>
                  )}
                </div>
              </div>

              {/* TVET Sectors Section */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 border-b border-slate-600 pb-2">
                  TVET Sectors
                </h2>
                <p className="text-gray-300 mb-4">Select the TVET sectors your company operates in *</p>
                
                {errors.sectors && (
                  <div className="text-error text-sm mb-4">{errors.sectors}</div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tvetSectors.map((sector, index) => (
                    <div key={index} className="form-control">
                      <label className="label cursor-pointer justify-start gap-3">
                        <input
                          type="checkbox"
                          checked={formData.sectors.includes(sector)}
                          onChange={() => handleSectorChange(sector)}
                          className="checkbox checkbox-primary"
                        />
                        <span className="label-text text-white">{sector}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Section */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 border-b border-slate-600 pb-2">
                  Account Security
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-white">Password *</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className={`input input-bordered bg-slate-800 text-white border-slate-600 w-full pr-12 ${errors.password ? 'input-error' : 'focus:input-primary focus:border-blue-500'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.password}</span>
                      </label>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-white">Confirm Password *</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className={`input input-bordered bg-slate-800 text-white border-slate-600 w-full pr-12 ${errors.confirmPassword ? 'input-error' : 'focus:input-primary focus:border-blue-500'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                        {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-8">
                <button 
                  type="button" 
                  onClick={handleSubmit}
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Register Company'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-300">
            Already have an account? 
            <Link to="/login" className="link link-primary ml-1">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivateSectorRegistration;