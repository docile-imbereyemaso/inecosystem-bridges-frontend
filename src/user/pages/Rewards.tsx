// CertificatesPage.jsx
import { useEffect, useState } from 'react';
import { FaEye, FaTimes, FaPlus } from 'react-icons/fa';

const Rewards = () => {
  const token = localStorage.getItem("token_ineco");

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newCert, setNewCert] = useState({
    name: '',
    issuing_organization: '',
    certificate_type: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    description: '',
    skills: ''
  });

  // Fetch certificates from backend
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/certificates/getUserCertificate', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        if (!data.success) {
          setError(data.message || 'Failed to fetch certificates');
        } else {
          setCertificates(data.certificates || []);
        }
      } catch (err) {
        setError('Network error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleView = (cert) => {
    setSelectedCertificate(cert);
    setIsViewModalOpen(true);
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/certificates/certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newCert,
          skills: newCert.skills.split(',').map(skill => skill.trim())
        })
      });

      const data = await response.json();
      if (data.success) {
        setCertificates(prev => [...prev, data.certificate]);
        setIsAddModalOpen(false);
        setNewCert({
          name: '',
          issuing_organization: '',
          certificate_type: '',
          issue_date: '',
          expiry_date: '',
          credential_id: '',
          description: '',
          skills: ''
        });
      } else {
        alert(data.message || 'Failed to add certificate');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  if (loading) return <p className="p-5 text-gray-600 dark:text-gray-400">Loading certificates...</p>;
  if (error) return <p className="p-5 text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white font-sans">
      <h1 className="mb-5 text-3xl font-bold border-b-2 border-gray-300 dark:border-gray-600 pb-3">
        Your Certificates
      </h1>

      {/* Add Certificate Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mb-5 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors duration-200"
      >
        <FaPlus /> Add Certificate
      </button>

      {certificates.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No certificates found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full bg-white dark:bg-gray-800 border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium">Name</th>
                <th className="text-left p-3 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium">Organization</th>
                <th className="text-left p-3 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium">Type</th>
                <th className="text-left p-3 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium">Issued</th>
                <th className="text-left p-3 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium">Expires</th>
                <th className="text-left p-3 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium">Credential ID</th>
                <th className="text-left p-3 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium">Skills</th>
                <th className="text-left p-3 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium">Description</th>
                <th className="text-left p-3 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(cert => (
                <tr key={cert.certificate_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-sm">{cert.name}</td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-sm">{cert.issuing_organization}</td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-sm">{cert.certificate_type}</td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-sm">{new Date(cert.issue_date).toLocaleDateString()}</td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-sm">{cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : '-'}</td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-sm">{cert.credential_id || '-'}</td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-sm">{cert.skills?.length > 0 ? cert.skills.join(', ') : '-'}</td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-sm">{cert.description || '-'}</td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-sm">
                    <button
                      onClick={() => handleView(cert)}
                      className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded transition-colors duration-200 text-sm"
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Certificate Modal */}
      {isViewModalOpen && selectedCertificate && (
        <Modal onClose={() => setIsViewModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{selectedCertificate.name}</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-200">
            <p><span className="font-semibold">Organization:</span> {selectedCertificate.issuing_organization}</p>
            <p><span className="font-semibold">Type:</span> {selectedCertificate.certificate_type}</p>
            <p><span className="font-semibold">Issued:</span> {new Date(selectedCertificate.issue_date).toLocaleDateString()}</p>
            {selectedCertificate.expiry_date && (
              <p><span className="font-semibold">Expires:</span> {new Date(selectedCertificate.expiry_date).toLocaleDateString()}</p>
            )}
            {selectedCertificate.credential_id && (
              <p><span className="font-semibold">Credential ID:</span> {selectedCertificate.credential_id}</p>
            )}
            {selectedCertificate.description && (
              <p><span className="font-semibold">Description:</span> {selectedCertificate.description}</p>
            )}
            {selectedCertificate.skills?.length > 0 && (
              <p><span className="font-semibold">Skills:</span> {selectedCertificate.skills.join(', ')}</p>
            )}
          </div>
        </Modal>
      )}

      {/* Add Certificate Modal */}
      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add New Certificate</h2>
          <form onSubmit={handleAddCertificate} className="space-y-4">
            <input 
              type="text" 
              placeholder="Name" 
              value={newCert.name} 
              onChange={e => setNewCert({...newCert, name: e.target.value})} 
              required 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input 
              type="text" 
              placeholder="Organization" 
              value={newCert.issuing_organization} 
              onChange={e => setNewCert({...newCert, issuing_organization: e.target.value})} 
              required 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input 
              type="text" 
              placeholder="Type" 
              value={newCert.certificate_type} 
              onChange={e => setNewCert({...newCert, certificate_type: e.target.value})} 
              required 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input 
              type="date" 
              placeholder="Issue Date" 
              value={newCert.issue_date} 
              onChange={e => setNewCert({...newCert, issue_date: e.target.value})} 
              required 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input 
              type="date" 
              placeholder="Expiry Date" 
              value={newCert.expiry_date} 
              onChange={e => setNewCert({...newCert, expiry_date: e.target.value})} 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input 
              type="text" 
              placeholder="Credential ID" 
              value={newCert.credential_id} 
              onChange={e => setNewCert({...newCert, credential_id: e.target.value})} 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input 
              type="text" 
              placeholder="Description" 
              value={newCert.description} 
              onChange={e => setNewCert({...newCert, description: e.target.value})} 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input 
              type="text" 
              placeholder="Skills (comma separated)" 
              value={newCert.skills} 
              onChange={e => setNewCert({...newCert, skills: e.target.value})} 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button 
              type="submit" 
              className="w-full p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Certificate
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-11/12 max-h-96 overflow-y-auto p-6 relative">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Close modal"
      >
        <FaTimes />
      </button>
      {children}
    </div>
  </div>
);

export default Rewards;