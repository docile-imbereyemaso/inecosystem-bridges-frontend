import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import SignUpForm from './SignUpForm.jsx';
import { FiUser, FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
// @ts-ignore
import {API_URL} from "../lib/API.js";
import logo from '../../public/images/logo.png';
import axios from "axios"

const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API_URL}auth/login`, formData);
      setLoading(false);

      if (data.success) {
        // Save token
        localStorage.setItem("token_ineco", data.token);

        // Prepare user object
        const da = {
          user_id:data.user.user_id,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          email: data.user.email,
          phone: data.user.phone,
          bio: data.user.bio,
          user_type: data.user.user_type,
          is_approved: data.user.is_approved,
          company_name: data.user.company_name,
          company_size: data.user.company_size,
          industry: data.user.industry,
          tvet_institution: data.user.tvet_institution,
          position: data.user.position,
        };

        // Save as JSON string
        localStorage.setItem("token_user", JSON.stringify(da));
        // Redirect based on user_type
        if(da.user_type === "individual"){
          navigate("/user/profile");
        }else if(da.user_type === "private_sector"){
          navigate("/privateSector/profile");
        }
        else if(da.user_type==="tvet"){
          navigate("/tvet/profile");
        }else{
          navigate("/");
        }
      }
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br
     from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black 
     flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-md">
       
        <Link to="/"  className="text-center  flex 
        items-center justify-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12  rounded-2xl mb-2 shadow-lg">
            <span className="text-white font-bold text-xl">
              <img src={logo} alt="inecosystem-bridge" />
            </span>
          </div>
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-white mb-1">
            INECOSYSTEM-BRIDGE
          </h1>
        </Link>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-md 
         p-4 border border-gray-200 dark:border-gray-700 my-3">
      
         

          { error && <div className="error text-red-600 text-sm mb-2">{error}</div>}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <h3 className='text-2xl font-bold'>SIGN IN</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400"> Please sign in to your account</p>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400 w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full  text-white font-medium py-3 px-4 
              rounded-xl transition-all duration-200 transform 
              hover:scale-[1.02] focus:outline-none
               focus:ring-2 focus:ring-offset-2
                focus:ring-blue-500 dark:focus:ring-offset-gray-800
                bg-indigo-600
                "
              disabled={isLoading}
            >
              { isLoading ? "Processing..." : "Sign In" }
            </button>
          </form>

          {/* Registration Section */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700 mt-3">
        <Link
          to="/SignUpForm"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors duration-200 text-center"
        >
          create Individual Account
        </Link>
        
        <Link
          to="/privateSectorForm"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors duration-200 text-center"
        >
          create the private sector Account
        </Link>
      </div>
              
            </p>
            
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
            Empowering future-ready talent by strengthening collaboration between 
            TVET institutions, the private sector, and industries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;