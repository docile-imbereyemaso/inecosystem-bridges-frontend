import React from 'react';
import { FaBuilding, FaUsers, FaChartLine, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe } from 'react-icons/fa';

type PrivateSectorCompany = {
  id: string;
  name: string;
  industry: string;
  employees: string;
  location: string;
  description: string;
  website?: string;
  phone?: string;
  email?: string;
  revenue?: string;
  founded?: number;
};

type PrivateSectorProps = {
  userSector?: string;
  companies?: PrivateSectorCompany[];
};

// Sample data - replace with your actual data
const sampleCompanies: PrivateSectorCompany[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    industry: 'Technology',
    employees: '250-500',
    location: 'Kigali, Rwanda',
    description: 'Leading software development and IT consulting company specializing in digital transformation for businesses across East Africa.',
    website: 'www.techcorp.rw',
    phone: '+250 788 123 456',
    email: 'info@techcorp.rw',
    revenue: '$2.5M - $5M',
    founded: 2018
  },
  {
    id: '2',
    name: 'Green Energy Rwanda',
    industry: 'Renewable Energy',
    employees: '100-250',
    location: 'Kigali, Rwanda',
    description: 'Solar and renewable energy solutions provider, committed to sustainable energy infrastructure development.',
    website: 'www.greenerergy.rw',
    phone: '+250 788 987 654',
    email: 'contact@greenerergy.rw',
    revenue: '$1M - $2.5M',
    founded: 2020
  },
  {
    id: '3',
    name: 'Rwanda Logistics Hub',
    industry: 'Logistics & Transportation',
    employees: '50-100',
    location: 'Kigali, Rwanda',
    description: 'Comprehensive logistics and supply chain management services for businesses across the region.',
    website: 'www.logisticshub.rw',
    phone: '+250 788 555 777',
    email: 'services@logisticshub.rw',
    revenue: '$500K - $1M',
    founded: 2019
  }
];

const PrivateSector: React.FC<PrivateSectorProps> = ({ 
  userSector = 'Technical sector', 
  companies = sampleCompanies
}) => {
  // Enhanced design: always light mode, clean cards
  const themeClasses = 'bg-gray-50 text-gray-900';
  const cardClasses = 'bg-white border-gray-200';

  return (
    <div className={`min-h-screen p-6 ${themeClasses} dark:bg-gray-900`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-gray-200">Private Sector Directory</h1>
          <p className="text-lg text-gray-600 dark:text-gray-200">
            Companies in {userSector}
          </p>
        </div>

       

        {/* Companies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6  dark:bg-gray-900 p-4 rounded-lg">
          {companies.map((company) => (
            <div key={company.id} className={`p-6 rounded-lg border ${cardClasses} hover:shadow-lg transition-shadow`}>
              {/* Company Header */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-1">{company.name}</h3>
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
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
              <p className="text-sm mb-4 text-gray-600">
                {company.description}
              </p>

              {/* Contact Information */}
              <div className="border-t pt-4 space-y-2">
                {company.website && (
                  <div className="flex items-center">
                    <FaGlobe className="h-4 w-4 mr-2 text-gray-500" />
                    <a href={`https://${company.website}`} 
                       className="text-sm text-blue-500 hover:text-blue-600"
                       target="_blank" 
                       rel="noopener noreferrer">
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
                    <a href={`mailto:${company.email}`} 
                       className="text-sm text-blue-500 hover:text-blue-600">
                      {company.email}
                    </a>
                  </div>
                )}
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