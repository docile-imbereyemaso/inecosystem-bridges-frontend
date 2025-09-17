import React, { useState } from 'react';
import { FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const FooterComponent = () => {
 

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:justify-between lg:flex gap-12">
          {/* Left Section - Brand */}
          <div className='lg:w-120'>
            <h2 className="text-2xl font-bold mb-4">INECOSYSTEM-BRIGDE</h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-8 leading-relaxed">
              INECOSYSTEM-BRIGDE empowers future-ready talent by strengthening collaboration between 
              TVET institutions, the private sector, and industries. The platform raises TVET 
              awareness, bridges the skills gap, and drives sustainable growth for individuals 
              and businesses alike.
            </p>
            
          
           
          </div>

          {/* Center Section - Partners */}
          <div>
            <h3 className="text-white dark:text-gray-200 font-medium mb-6">Our partners</h3>
            <div className="space-y-3">
              <a href="https://www.rtb.gov.rw/" className="text-gray-400 dark:text-gray-500 text-sm hover:text-gray-300 dark:hover:text-gray-400 cursor-pointer transition-colors" target='_blank'>
                Rwanda TVET Board
              </a>
       
                  <a href="https://www.rtb.gov.rw/" className="text-gray-400 dark:text-gray-500 text-sm hover:text-gray-300 dark:hover:text-gray-400 cursor-pointer transition-colors" target='_blank'>
                Rwanda TVET Board
              </a>
            </div>
          </div>
 <div className="flex space-x-3">
            
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiTwitter size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiInstagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiLinkedin size={18} />
              </a>
            </div>
          
        </div>

     
      </div>
    </footer>
  );
};

export default FooterComponent;