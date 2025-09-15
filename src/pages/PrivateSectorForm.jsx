import React, { useState } from "react";
import { Link } from "react-router";

const PrivateSectorForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyRepresentative: "",
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
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, dataset } = e.target;
    if (name === "legalDocument") {
      setFormData({ ...formData, [name]: files[0] });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length === 0) {
      setTimeout(() => {
        console.log("Form submitted:", formData);
        alert("Private Sector Account created successfully!");
        setIsSubmitting(false);
      }, 2000);
    } else {
      setErrors(newErrors);
      setIsSubmitting(false);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.companyName) errors.companyName = "Company name is required";
    if (!data.companyRepresentative)
      errors.companyRepresentative = "Company representative is required";
    if (!data.companyRegId) errors.companyRegId = "Company Reg ID is required";
    if (!data.companySize) errors.companySize = "Company size is required";
    if (!data.focus) errors.focus = "Focus is required";
    if (!data.location) errors.location = "Location is required";
    if (!data.contactNumber)
      errors.contactNumber = "Contact number is required";
    if (!data.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      errors.email = "Email is invalid";
    if (!data.offerings || !data.offerings.some((o) => o.trim())) errors.offerings = "At least one offering is required";
    if (!data.legalDocument)
      errors.legalDocument = "RDB registration proof is required";
    if (!data.password) errors.password = "Password is required";
    else if (data.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    if (data.password !== data.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Private Sector Registration
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Register your company and become part of our growing ecosystem
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/90 dark:bg-gray-900 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Company Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-10 sm:px-12 space-y-8">
            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                { label: "Company Name", name: "companyName" },
                { label: "Company Representative", name: "companyRepresentative" },
                { label: "Company Reg ID", name: "companyRegId" },
                { label: "Company Size", name: "companySize" },
                { label: "Focus", name: "focus" },
                { label: "Location", name: "location" },
                { label: "Contact Number", name: "contactNumber" },
                { label: "Email", name: "email", type: "email" },
              ].map(({ label, name, type = "text" }) => (
                <div key={name} className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {label} *
                  </label>
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full px-5 py-3 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 ${
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
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
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
                    className={`w-full px-5 py-3 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 ${
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
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                Legal Document (RDB Registration Proof) *
              </label>
              <input
                name="legalDocument"
                type="file"
                onChange={handleChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-5 py-3 text-lg border-2 rounded-xl"
              />
              {errors.legalDocument && (
                <p className="text-red-500 text-sm">{errors.legalDocument}</p>
              )}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  label: "Password",
                  name: "password",
                  type: showPassword ? "text" : "password",
                  toggle: () => setShowPassword(!showPassword),
                },
                {
                  label: "Confirm Password",
                  name: "confirmPassword",
                  type: showConfirmPassword ? "text" : "password",
                  toggle: () => setShowConfirmPassword(!showConfirmPassword),
                },
              ].map(({ label, name, type, toggle }) => (
                <div key={name} className="space-y-2 relative">
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {label} *
                  </label>
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full px-5 py-3 pr-12 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 ${
                      errors[name]
                        ? "border-red-300 bg-red-50 dark:border-red-400 dark:bg-red-950"
                        : "border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                  <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                    style={{transform: 'translateY(-50%)'}}
                    tabIndex={-1}
                  >
                    {name === "password" && showPassword ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : name === "password" ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : name === "confirmPassword" && showConfirmPassword ? (
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
                  {errors[name] && (
                    <p className="text-red-500 text-sm">{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg hover:scale-[1.02] transition"
              >
                {isSubmitting ? "Submitting..." : "Register Company"}
              </button>
            </div>

            {/* Sign in */}
            <div className="text-center pt-4">
              <p className="text-gray-600 dark:text-gray-300">
                Already registered?{" "}
                <Link
                  to="/Login"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Sign In Here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivateSectorForm;
