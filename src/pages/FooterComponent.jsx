import React, { useState } from 'react';
import { FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const FooterComponent = () => {
 

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-6xl mx-auto px-8 pt-12 pb-3">
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
            <div className="space-y-3 ">
              <a href="https://www.rtb.gov.rw/" className="block text-gray-400 dark:text-gray-500 text-sm hover:text-gray-300 dark:hover:text-gray-400 cursor-pointer transition-colors" target='_blank'>
                Rwanda TVET Board
              </a>
              <a href="https://www.the-gym.rw/" className="block text-gray-400 dark:text-gray-500 text-sm hover:text-gray-300 dark:hover:text-gray-400 cursor-pointer transition-colors" target='_blank'>
                The Gym Rwanda
              </a>
       
   
            </div>
          </div>

          
        </div>
             <hr />

              <div className="flex space-x-3 justify-center max-md:text-base">
            
           <p className='text-xl dark:text-gray-300'> &copy;2025 Bravos team</p>
           <p className='text-gray-400 text-xl'>The Gym Rwanda</p>
            </div>
     
      </div>
    </footer>
  );
};

export default FooterComponent;