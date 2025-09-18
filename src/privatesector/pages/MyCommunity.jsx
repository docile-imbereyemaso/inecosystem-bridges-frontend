import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaPhone, FaUsers, FaSearch, FaUserCircle, FaEnvelope, FaEye, FaTimes, FaDownload, FaFileAlt, FaGraduationCap } from 'react-icons/fa';
import { API_URL } from '../../lib/API';
import { useAuth } from '../../lib/useAuth';
import ConnectedUserCard from '../../common-components/ConnectedUserCard';

const MyCommunity = () => {
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
        console.log('Fetched connections data:', data); 
        
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

  const handleViewDetails = (connection) => {
    setSelectedUser(connection);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDownload = (fileUrl, fileName) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  console.log(filteredConnections)
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
              placeholder="Search connections by name or email"
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
                      <img src={connection.connected_user.profile_image || `https://ui-avatars.com/api/?name=${connection.connected_user.first_name} ${connection.connected_user.last_name}&background=0D8ABC&color=fff`} 
                      alt={`${connection.connected_user.first_name} ${connection.connected_user.last_name}`} className="w-16 h-16 rounded-full object-cover border-2 border-gray-300" />

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

                

                  {/* Connection Date */}
                  <div className="text-xs text-gray-500 mb-4">
                    Connected since {formatDate(connection.createdAt)}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
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
                    <button
                      onClick={() => handleViewDetails(connection)}
                      className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm transition-colors"
                    >
                      <FaEye className="mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* User Details Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div 
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={closeModal}
              ></div>

              {/* Modal content */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                {/* Modal header */}
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">User Details</h3>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Personal Information */}
                 <ConnectedUserCard connection={selectedUser} />

            
                  
                </div>

                {/* Modal footer */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCommunity;