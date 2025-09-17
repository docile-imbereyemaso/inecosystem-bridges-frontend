import React, {  useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiExternalLink, FiBell } from 'react-icons/fi';
import Navbar from '../common-components/Navbar';
import Topnav from '../common-components/Topnav';
import FooterComponent from './FooterComponent';
import { API_URL } from "../lib/API";
import { NavLink } from "react-router";

const TVETBridgePlatform = () => {
  const [activeTab, setActiveTab] = useState('jobs');  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Get token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);



  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}jobs/getAllJobs`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`Fetch jobs failed: ${res.status}`);
      const data = await res.json();
      setJobs(data.jobs);
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  console.log(jobs);
  const [organizations, setOrganizations] = useState([]);
const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}companies/all`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`Fetch companies failed: ${res.status}`);
      const data = await res.json();
      setOrganizations(data.companies);
    } catch (err) {
      console.error("Fetch companies error:", err);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);
console.log("Organisations: ",organizations);
  const opportunities = [
    {
      id: 1,
      title: "Recurring Fellowships",
      icon: "📈",
      sector:"Technical sector",
      status:"Student",
      level:"Bachelor's degree",
      tags: ["Career development", "Multiple experience levels"],
      count: "220 fellowships",
      updated: "Updated 1 day ago"
    },
    {
      id: 2,
      title: "Challenges and Prizes Related to Skills Development",
      icon: "🏆",
      sector:"Technical sector",
      status:"Student",
      level:"Multi levels",
      count: "45 challenges",
      updated: "Updated 3 days ago"
    },
    {
      id: 3,
      title: "Industry Partnerships Program",
      icon: "🤝",
      sector:"Technical sector",
      status:"Graduates",
      level:"Bachelor's degree",
      count: "32 partnerships",
      updated: "Updated 2 days ago"
    },
    {
      id: 4,
      title: "TVET Scholarships & Grants",
      icon: "🎓",
      sector:"Technical sector",
      status:"Student",
      level:"Entry level(TVET secondary schools graduates",
      count: "78 opportunities",
      updated: "Updated 1 week ago"
    }
  ];
  const [profileImage, setProfileImage] = useState(null);

const fetchProfile = async () => {
    if (!user?.user_id || !token) return;
    try {
      const userRes = await fetch(`${API_URL}imagesNo/image`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawUser = await userRes.json();
      const userInfo = rawUser?.user ?? rawUser ?? {};
      const companyInfo = userInfo.companies && userInfo.companies[0] ? userInfo.companies[0] : {};

      setCompanyData({
        ...userInfo,
        contacts: companyInfo.contacts || [],
        name: companyInfo.name,
        description: companyInfo.description,
        locations: companyInfo.locations || [],
        offerings: companyInfo.offerings || [],
      });

      if (userInfo.profile_image) setProfileImage(userInfo.profile_image);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

   // Helper function to get user image
const getUserImage = async (userId) => {
  try {
    const response = await fetch(`${API_URL}users/${userId}/image`);
    const data = await response.json();
    
    if (data.success) {
      return data.imageUrl;
    } else {
      // Return a default avatar if image not found
      return '/default-avatar.png';
    }
  } catch (error) {
    console.error('Error fetching user image:', error);
    return '/default-avatar.png';
  }
};

// In your component, use this function to fetch images
useEffect(() => {
  const fetchImages = async () => {
    if (organizations.length > 0) {
      const images = {};
      
      for (const org of organizations) {
        // Assuming org has a user_id field
        if (org.user_id) {
          const imageUrl = await getUserImage(org.user_id);
          images[org.user_id] = imageUrl;
        }
      }
      
      setProfileImage(images);
    }
  };
  
  fetchImages();
}, [organizations]);
console.log("Profile images: ",profileImage);
  function TabButton({ id, label, isActive, onClick }) {
    return (
      <button
        onClick={() => onClick(id)}
        className={`px-6 py-3 font-medium transition-all duration-200 ${
          isActive 
            ? 'text-gray-900 border-b-2 border-cyan-500 bg-white' 
            : 'text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        {label}
      </button>
    );
  }

  const JobsTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Keywords"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-700 focus:border-cyan-500 dark:focus:border-cyan-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 bg-cyan-500 dark:bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 dark:hover:bg-cyan-800 transition-colors">
            <FiBell className="w-4 h-4" />
            Search your Dream job
          </button>
        </div>
      

            
      </div>
      
      <div className="space-y-4">
        {loading ? (
                    <div>Loading jobs...</div>
                  ) : jobs.length === 0 ? (
                    <div>No jobs found.</div>
                  ) : (
                    jobs.map((job) => (
                      <div key={job.job_id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{job.name}</h3>
                            <div className="flex gap-2 mt-2">
                              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">{job.type}</span>
                              <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">{job.level}</span>
                              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">
                                {job.positions} position{job.positions > 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => window.open(job.application_link, "_blank")}
                              className="text-green-400 hover:text-green-300 hover:bg-green-400/10 p-2 rounded"
                            >
                              <FiExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
        
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <h4 className="text-gray-600 dark:text-gray-400 mb-1">Skills Required</h4>
                            <div className="flex flex-wrap gap-1">
                              {job.skills_required.map((skill, i) => (
                                <span key={i} className="border border-gray-300 px-2 py-1 rounded text-xs text-gray-700 dark:text-gray-300">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-600 dark:text-gray-400 mb-1">Qualifications</h4>
                            <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                              {job.qualifications.map((q, i) => (
                                <li key={i}>• {q}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-600 dark:text-gray-400 mb-1">Period</h4>
                            <p className="text-gray-800 dark:text-white/90">{job.period}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
      </div>
    </div>
  );

  const PrivateSectorTab = () => (
    <div className="space-y-6">
      

      <div className="flex items-center justify-between">
        <div className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">58</span> private sector Partnership
        </div>
        
      </div>

      <div className="space-y-4">
        {organizations.map((org) => (
          <div key={org.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                <img  src={profileImage[org.user_id] || '/default-avatar.png'}  alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{org.name}</h3>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          ICT
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                          Kigali Rwanda
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          Large
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                          Technical Skills
                        </span>
                      </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{org.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{org.openRoles}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                      <FiExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
             <div className='mt-3'>
              <NavLink to="/login" className="text-lg md:text-base font-bold text-gray-900 dark:text-white">
              <a href="#" className="text-gray-100 bg-indigo-700 px-5 py-2 font-semibold rounded-md hover:bg-indigo-800 transform hover:scale-[1.09] transition duration-200 block w-fit  ease-in-out"> Connect</a>
              </NavLink>
             </div>
          </div>
        ))}
      </div>
    </div> 
  );

  const OtherOpportunitiesTab = () => (
    <div className="space-y-6">
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Keywords"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-700 focus:border-cyan-500 dark:focus:border-cyan-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 bg-cyan-500 dark:bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 dark:hover:bg-cyan-800 transition-colors">
            <FiBell className="w-4 h-4" />
            Search your opportunities
          </button>
        </div>
      

            
      </div>
        

     

      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-2xl">
                {opportunity.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{opportunity.title}</h3>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        {opportunity.sector}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {opportunity.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm bg-indigo-400 dark:bg-amber-500/50 text-white dark:text-blue-200">
                        {opportunity.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{opportunity.count}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{opportunity.updated}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                      <FiExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
            </div>
            <a href="#" className='block text-white hover:underline mt-4 bg-indigo-700/50 rounded-md px-3 py-5 w-fit font-semibold hover:bg-indigo-600 transition-all duration-300 ease-in-out'>View more</a>
          </div>
      
        ))}
      </div>
    </div>
  );

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
              <div id='navigation' className="hidden top-12 fixed z-10 w-full">
        
        
        
                
              <Topnav />
              </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div  className="mt-0 z-10">
           <Navbar />
      </div>
        {/* Hero Section */}
        <div className="text-center mt-12 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {activeTab === 'jobs' && 'Jobs'}
            {activeTab === 'private-sector' && 'Private Sector Partners'}
            {activeTab === 'opportunities' && 'Other Opportunities'}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            {activeTab === 'jobs' && (
              <>Get connected to private sectors <span className="text-cyan-500 dark:text-cyan-400">Work and Grow</span> with your career.</>
            )}
            {activeTab === 'private-sector' && (
              <>Places with roles that could be particularly promising for <span className="text-cyan-500 dark:text-cyan-400">helping skills go well</span>.</>
            )}
            {activeTab === 'opportunities' && (
              <>Additional lists of top opportunities for skill-building and career development.</>
            )}
          </p>
        </div>
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <TabButton 
              id="jobs" 
              label="Search Jobs" 
              isActive={activeTab === 'jobs'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="private-sector" 
              label="Explore Private Sector" 
              isActive={activeTab === 'private-sector'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="opportunities" 
              label="Other Opportunities" 
              isActive={activeTab === 'opportunities'} 
              onClick={setActiveTab} 
            />
          </div>
        </div>
        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'jobs' && <JobsTab />}
          {activeTab === 'private-sector' && <PrivateSectorTab />}
          {activeTab === 'opportunities' && <OtherOpportunitiesTab />}
        </div>
      </div>


      <FooterComponent/>
    </div>
  );
}

export default TVETBridgePlatform;