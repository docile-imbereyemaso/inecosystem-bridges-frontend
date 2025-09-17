import { FaRegCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaYoutube, FaTiktok, FaInstagram, FaTwitter } from "react-icons/fa";
const MainSection = () => {
    const [visibleSections, setVisibleSections] = useState(new Set());

    useEffect(() => {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const sectionId = entry.target.getAttribute('data-section');
                if (entry.isIntersecting) {
                    setVisibleSections(prev => new Set([...prev, sectionId]));
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('[data-section]');
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    const getSectionClasses = (sectionId) => {
        const baseClasses = "transition-all duration-1000 ease-out transform";
        if (visibleSections.has(sectionId)) {
            return `${baseClasses} opacity-100 translate-y-0`;
        }
        return `${baseClasses} opacity-0 translate-y-12`;
    };

    return (
        <div className="mx-auto max-w-7xl mt-12 space-y-20 px-4 sm:px-6 lg:px-8">
            {/* Mission Section */}
            <section 
                data-section="mission" 
                className={getSectionClasses("mission")}
            >
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                    {/* Mission Header */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="hidden lg:block">
                                <FaRegCircle className="text-emerald-500 text-5xl opacity-80 hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                    Our Mission
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto lg:mx-0 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Mission Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                INECOSYSTEM empowers future-ready talent by strengthening collaboration between 
                                TVET institutions, the private sector, and industries. The platform raises TVET 
                                awareness, bridges the skills gap, and drives sustainable growth for individuals 
                                and businesses alike.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why TVET Matters Section */}
            <section 
                data-section="tvet" 
                className={getSectionClasses("tvet")}
            >
                <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12 items-center">
                    {/* TVET Header */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="text-center lg:text-right">
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                    Why TVET Matters?
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto lg:ml-auto lg:mr-0 rounded-full"></div>
                            </div>
                            <div className="hidden lg:block">
                                <FaRegCircle className="text-blue-500 text-5xl opacity-80 hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>
                    </div>

                    {/* TVET Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                                With TVET, you gain skills that industries need, opportunities that change lives, 
                                and a future you can build with your own hands.
                            </p>
                            <Link 
                                to="/tvetmatters" 
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                            >
                                Explore more about TVET
                                <FaArrowRight className="ml-2 text-sm transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chase Dreams Section */}
            <section 
                data-section="dreams" 
                className={getSectionClasses("dreams")}
            >
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                    {/* Dreams Header */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="hidden lg:block">
                                <FaRegCircle className="text-pink-500 text-5xl opacity-80 hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                    Chase Your Dreams Here
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto lg:mx-0 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Dreams Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                                Explore our space where both TVET graduates and students connect with industries, 
                                discover job opportunities and internships that match their skills.
                            </p>
                            <Link 
                                to="/jobBoard" 
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300"
                            >
                                Work, Learn and Grow with us
                                <FaArrowRight className="ml-2 text-sm transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Assistant Section */}
            <section 
                data-section="ai" 
                className={getSectionClasses("ai")}
            >
                <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12 items-center">
                    {/* AI Header */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="text-center lg:text-right">
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                    Find your career journey
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto lg:ml-auto lg:mr-0 rounded-full"></div>
                            </div>
                            <div className="hidden lg:block">
                                <FaRegCircle className="text-indigo-500 text-5xl opacity-80 hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>
                    </div>

                    {/* AI Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                                Not sure where to start? FIND YOUR CAREER JOURNEY guides you in exploring career options and shows you the specific schools where you can gain the right skills.
                            </p>
                            <Link 
                                to="/ai-chatbot" 
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
                            >
                                Start Here
                                <FaArrowRight className="ml-2 text-sm transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section 
                data-section="cta" 
                className={getSectionClasses("cta")}
            >
                <div className="mx-auto max-w-2xl">
                    <h2 className="text-3xl dark:text-gray-100 text-gray-900 font-bold mb-8 text-center">
        Get more on our platforms
      </h2>
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border border-gray-200/60 dark:border-gray-600/60 rounded-2xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-200/30 to-teal-200/30 rounded-full translate-y-12 -translate-x-12 animate-pulse delay-1000"></div>
                        
                        <div className="flex justify-center items-center gap-20 mt-10">
      {/* YouTube */}
      <a
        href="https://www.youtube.com/@INECOSYSTEMBRIDGE"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-red-600 text-white p-6 rounded-full text-5xl hover:scale-125 transition-transform"
      >
        <FaYoutube />
      </a>

      {/* TikTok */}
      <a
        href="https://www.tiktok.com/@inecosystembridge1?lang=en-GB"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-black text-white p-6 rounded-full text-5xl hover:scale-125 transition-transform"
      >
        <FaTiktok />
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/inecosystembridge1/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white p-6 rounded-full text-5xl hover:scale-125 transition-transform"
      >
        <FaInstagram />
      </a>

      {/* Twitter */}
      <a
        href="https://x.com/Inecosystem1"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 text-white p-6 rounded-full text-5xl hover:scale-125 transition-transform"
      >
        <FaTwitter />
      </a>
    </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MainSection;