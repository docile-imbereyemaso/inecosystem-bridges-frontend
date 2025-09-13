import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaPhone, FaUsers, FaSearch, FaUserCircle, FaEnvelope } from 'react-icons/fa';
import { API_URL } from '../../lib/API';
import { useAuth } from '../../lib/useAuth';

const MyCommunity = () => {
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuth();
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}connections/user/${user.user_id}/individuals`,{
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${localStorage.getItem('token_ineco')}`
            }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setConnections(data.data);
          setFilteredConnections(data.data);
        } else {
          throw new Error('Failed to fetch connections');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching connections:', err);
      } finally {
        setLoading(false);
      }
    };
if(user){
    
    fetchConnections();
}
  }, [user]);

  useEffect(() => {
    const results = connections.filter(connection => {
      const fullName = `${connection.connected_user.first_name} ${connection.connected_user.last_name}`.toLowerCase();
      const company = connection.connected_user.company_name ? connection.connected_user.company_name.toLowerCase() : '';
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        company.includes(searchTerm.toLowerCase()) ||
        connection.connected_user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredConnections(results);
  }, [searchTerm, connections]);

const handleWhatsApp = (phone) => {
  const cleanedPhone = phone.replace(/\D/g, ''); // keep only digits
  const message = encodeURIComponent(
    `Hello! I found you through my community on Ineco's platform. I'd like to connect and explore potential opportunities together. 
Looking forward to hearing from you!`
  );

  // Use ?text= and include the country code without +
  window.open(`https://wa.me/25${cleanedPhone}?text=${message}`, '_blank');
};


  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`, '_self');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your community...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md">
            <h3 className="font-semibold">Error Loading Connections</h3>
            <p className="mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <FaUsers className="mr-3 text-blue-600" />
            My Community
          </h1>
          <p className="mt-2 text-gray-600">Your network of professional connections</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search connections by name, company, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Connection Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredConnections.length} {filteredConnections.length === 1 ? 'connection' : 'connections'} found
          </p>
        </div>

        {/* Connections Grid */}
        {filteredConnections.length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="mx-auto text-gray-300 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-500">
              {connections.length === 0 ? 'No connections yet' : 'No matching connections found'}
            </h3>
            <p className="text-gray-400 mt-2">
              {connections.length === 0 
                ? 'Your connections will appear here once you start connecting with others.' 
                : 'Try adjusting your search terms.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((connection) => (
              <div key={connection.connection_id} className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  {/* User Avatar and Name */}
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <FaUserCircle className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {connection.connected_user.first_name} {connection.connected_user.last_name}
                      </h2>
                      {connection.connected_user.company_name && (
                        <p className="text-sm text-gray-600">{connection.connected_user.company_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaEnvelope className="mr-2 text-gray-400" />
                      <a href={`mailto:${connection.connected_user.email}`} className="hover:text-blue-600 truncate">
                        {connection.connected_user.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaPhone className="mr-2 text-gray-400" />
                      <span>{connection.connected_user.phone}</span>
                    </div>
                  </div>

                  {/* Connection Date */}
                  <div className="text-xs text-gray-500 mb-4">
                    Connected since {formatDate(connection.createdAt)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleWhatsApp(connection.connected_user.phone)}
                      className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm transition-colors"
                    >
                      <FaWhatsapp className="mr-2" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleCall(connection.connected_user.phone)}
                      className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm transition-colors"
                    >
                      <FaPhone className="mr-2" />
                      Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCommunity;