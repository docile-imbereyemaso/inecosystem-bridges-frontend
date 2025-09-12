import React, { useState } from 'react';
import {
  FaBuilding,
  FaUsers,
  FaChartLine,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaCheck,
  FaSpinner,
  FaHandshake,
  FaBell,
  FaWhatsapp
} from 'react-icons/fa';




// Sample data - replace with your actual data
const sampleCompanies = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    industry: 'Technology',
    employees: '250-500',
    location: 'Kigali, Rwanda',
    description:
      'Leading software development and IT consulting company specializing in digital transformation for businesses across East Africa.',
    website: 'www.techcorp.rw',
    phone: '+250 788 123 456',
    email: 'info@techcorp.rw',
    revenue: '$2.5M - $5M',
    founded: 2018,
  },
  {
    id: '2',
    name: 'Green Energy Rwanda',
    industry: 'Renewable Energy',
    employees: '100-250',
    location: 'Kigali, Rwanda',
    description:
      'Solar and renewable energy solutions provider, committed to sustainable energy infrastructure development.',
    website: 'www.greenerergy.rw',
    phone: '+250 788 987 654',
    email: 'contact@greenerergy.rw',
    revenue: '$1M - $2.5M',
    founded: 2020,
  },
  {
    id: '3',
    name: 'Rwanda Logistics Hub',
    industry: 'Logistics & Transportation',
    employees: '50-100',
    location: 'Kigali, Rwanda',
    description:
      'Comprehensive logistics and supply chain management services for businesses across the region.',
    website: 'www.logisticshub.rw',
    phone: '+250 788 555 777',
    email: 'services@logisticshub.rw',
    revenue: '$500K - $1M',
    founded: 2019,
  },
];

const PrivateSector = ({
  userSector = 'Technical sector',
  companies = sampleCompanies,
}) => {
  // Track connection status for each company by ID
  const [connectedCompanies, setConnectedCompanies] = useState({});
  
  // Track loading state for connection process
  const [loadingConnections, setLoadingConnections] = useState({});

  const handleConnection = async (id, companyName) => {
    // Set loading state
    setLoadingConnections(prev => ({
      ...prev,
      [id]: true
    }));

    // Simulate API call or connection process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update connection status
    setConnectedCompanies(prev => ({
      ...prev,
      [id]: true,
    }));

    // Clear loading state
    setLoadingConnections(prev => ({
      ...prev,
      [id]: false
    }));
  };

  const themeClasses = 'bg-gray-50 text-gray-900';
  const cardClasses = 'bg-white border-gray-200';

  return (
    <div className={`min-h-screen p-6 ${themeClasses} dark:bg-gray-900`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-gray-300">Private Sector Directory</h1>
          <p className="text-lg text-gray-600">
            Companies in {userSector}
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4 rounded-lg">
          {companies.map((company) => (
            <div
              key={company.id}
              className={`p-6 rounded-lg border ${cardClasses} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
            >
              {/* Company Header */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium">
                  {company.industry}
                </span>
              </div>

              {/* Company Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">{company.location}</span>
                </div>
                <div className="flex items-center">
                  <FaUsers className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">{company.employees} employees</span>
                </div>
                {company.revenue && (
                  <div className="flex items-center">
                    <FaChartLine className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Revenue: {company.revenue}</span>
                  </div>
                )}
                {company.founded && (
                  <div className="flex items-center">
                    <FaBuilding className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Founded: {company.founded}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm mb-4 text-gray-600 line-clamp-3">
                {company.description}
              </p>

              {/* Contact Info + Connect */}
              <div className="border-t pt-4 space-y-3">
                {company.website && (
                  <div className="flex items-center">
                    <FaGlobe className="h-4 w-4 mr-2 text-gray-500" />
                    <a
                      href={`https://${company.website}`}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center">
                    <FaPhone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">{company.phone}</span>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center">
                    <FaEnvelope className="h-4 w-4 mr-2 text-gray-500" />
                    <a
                      href={`mailto:${company.email}`}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {company.email}
                    </a>
                  </div>
                )}

                {/* Enhanced Connect Button */}
                <div className="pt-2">
                  {!connectedCompanies[company.id] ? (
                    <button
                      className={`
                        w-full flex items-center justify-center gap-2 
                        bg-gradient-to-r from-blue-600 to-indigo-600 
                        hover:from-blue-700 hover:to-indigo-700 
                        text-white font-semibold px-4 py-3 rounded-lg 
                        transition-all duration-300 ease-in-out
                        transform hover:scale-105 hover:shadow-lg
                        active:scale-95
                        disabled:opacity-70 disabled:cursor-not-allowed
                        disabled:hover:scale-100 disabled:hover:shadow-none
                        ${loadingConnections[company.id] ? 'cursor-wait' : ''}
                      `}
                      onClick={() => handleConnection(company.id, company.name)}
                      disabled={loadingConnections[company.id]}
                    >
                      {loadingConnections[company.id] ? (
                        <>
                          <FaSpinner className="h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <FaHandshake className="h-4 w-4" />
                          Connect & Grow
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* Success State */}
                      <div className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-4 py-3 rounded-lg">
                        <FaCheck className="h-4 w-4" />
                        Successfully Connected
                      </div>
                      
                      {/* Professional Follow-up Message */}
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <FaCheck className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-amber-900 mb-1">
                              Connection Established
                            </h4>
                            <p className="text-sm text-amber-800 mb-2">
                              Thank you for connecting with {company.name}! We'll keep you updated on collaboration opportunities.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-amber-700">
                              <div className="flex items-center gap-1">
                                <FaEnvelope className="h-3 w-3" />
                                Email updates
                              </div>
                              <div className="flex items-center gap-1">
                                <FaWhatsapp className="h-3 w-3" />
                                WhatsApp notifications
                              </div>
                              <div className="flex items-center gap-1">
                                <FaBell className="h-3 w-3" />
                                Priority alerts
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No companies message */}
        {companies.length === 0 && (
          <div className={`text-center py-12 ${cardClasses} rounded-lg`}>
            <FaBuilding className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Companies Found</h3>
            <p className="text-gray-600">
              No private sector companies found in {userSector}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateSector;