import { FaArrowRight } from "react-icons/fa6";
import { useState } from "react";
import { Link } from 'react-router-dom'

const HeroSection = () => {


        return (
                <>
                        <div className="grid place-items-center min-h-screen">
                                
                                       <Link 
  to="/login" 
  className="relative inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-xl shadow-2xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] transition-all duration-300 ease-out border border-blue-500/20 backdrop-blur-sm overflow-hidden group"
>
  {/* Background shine effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>
  
  {/* Inner glow */}
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-white/20 opacity-60"></div>
  
  {/* Content */}
  <span className="relative flex items-center">
    Get Started
    <FaArrowRight className="ml-3 text-white text-xl group-hover:translate-x-1 transition-transform duration-200" />
  </span>
</Link>
                                
                        </div>
                </>
        );
};

export default HeroSection;