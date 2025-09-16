import React, { useEffect } from 'react';

import Navbar from '../common-components/Navbar.jsx';
import HeroSection from './otherpages/HeroSection';
import MainSection from './MainSection';
import Topnav from '../common-components/Topnav';
import FooterComponent from './FooterComponent';
const Home = () => {


  useEffect(() => {
    const nav = document.getElementById("navigation");

    const handleScroll = () => {
      if (!nav) return;
      const scroll = window.scrollY;
      if (scroll < 100) {
        nav.classList.add("hidden");
      } else {
        nav.classList.remove("hidden");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className=" min-h-screen bg-[#E4F8E2] dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute w-full min-h-screen flex-grow h-[750px] overflow-hidden flex flex-col justify-center">
        {/* Video Background with Low Brightness Filter */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video absolute inset-0 w-full mx-auto h-full object-cover opacity-60 brightness-[12] mt-[-30px] contrast-110 saturate-75 blur-[0.5px]"
          style={{
            filter: 'brightness(0.83) contrast(1.1) saturate(1) blur(0.5px)'
          }}
        >
          <source src="/video/bg-vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Primary Dark Overlay for depth */}
        {/* <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div> */}

        {/* Gradient Overlay for smooth blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-transparent to-[#E4F8E2]/0 dark:to-gray-900/90"></div>

        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"></div>

        </div>
       
      <div className="bg-hidden bg-cover bg-no-repeat
   bg-center min-h-screen mt-2 bg-gradient-to-r from-indigo-400/40 to-slate-500/50 dark:bg-gray-600/50 bg-blend-multiply transition duration-300 pt-10">
      <div id='navigation' className="hidden fixed z-10 w-full">



        
      <Topnav />
      </div>
      <Navbar />

      <HeroSection />
     
      </div>
      
     <MainSection/>

     <FooterComponent/>
    </div>

  );
  
};

export default Home;