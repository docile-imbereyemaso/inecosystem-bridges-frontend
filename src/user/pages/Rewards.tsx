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

  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (loading) return <p style={{ padding: '20px' }}>Loading certificates...</p>;
  if (error) return <p style={{ color: 'red', padding: '20px' }}>{error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: isDark ? '#1f1f1f' : '#f5f5f5', color: isDark ? '#fff' : '#333' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '2rem', borderBottom: `2px solid ${isDark ? '#444' : '#ccc'}`, paddingBottom: '10px' }}>Your Certificates</h1>

      {/* Add Certificate Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        style={{
          marginBottom: '20px',
          backgroundColor: '#1e40af',
          color: '#fff',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <FaPlus /> Add Certificate
      </button>

      {certificates.length === 0 ? (
        <p>No certificates found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: isDark ? '#2b2b2b' : '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr>
                <th style={thStyle(isDark)}>Name</th>
                <th style={thStyle(isDark)}>Organization</th>
                <th style={thStyle(isDark)}>Type</th>
                <th style={thStyle(isDark)}>Issued</th>
                <th style={thStyle(isDark)}>Expires</th>
                <th style={thStyle(isDark)}>Credential ID</th>
                <th style={thStyle(isDark)}>Skills</th>
                <th style={thStyle(isDark)}>Description</th>
                <th style={thStyle(isDark)}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(cert => (
                <tr key={cert.certificate_id} style={trStyle(isDark)}>
                  <td style={tdStyle(isDark)}>{cert.name}</td>
                  <td style={tdStyle(isDark)}>{cert.issuing_organization}</td>
                  <td style={tdStyle(isDark)}>{cert.certificate_type}</td>
                  <td style={tdStyle(isDark)}>{new Date(cert.issue_date).toLocaleDateString()}</td>
                  <td style={tdStyle(isDark)}>{cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : '-'}</td>
                  <td style={tdStyle(isDark)}>{cert.credential_id || '-'}</td>
                  <td style={tdStyle(isDark)}>{cert.skills?.length > 0 ? cert.skills.join(', ') : '-'}</td>
                  <td style={tdStyle(isDark)}>{cert.description || '-'}</td>
                  <td style={tdStyle(isDark)}>
                    <button
                      onClick={() => handleView(cert)}
                      style={{
                        backgroundColor: '#1e40af',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
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
        <Modal onClose={() => setIsViewModalOpen(false)} isDark={isDark}>
          <h2>{selectedCertificate.name}</h2>
          <p><strong>Organization:</strong> {selectedCertificate.issuing_organization}</p>
          <p><strong>Type:</strong> {selectedCertificate.certificate_type}</p>
          <p><strong>Issued:</strong> {new Date(selectedCertificate.issue_date).toLocaleDateString()}</p>
          {selectedCertificate.expiry_date && <p><strong>Expires:</strong> {new Date(selectedCertificate.expiry_date).toLocaleDateString()}</p>}
          {selectedCertificate.credential_id && <p><strong>Credential ID:</strong> {selectedCertificate.credential_id}</p>}
          {selectedCertificate.description && <p><strong>Description:</strong> {selectedCertificate.description}</p>}
          {selectedCertificate.skills?.length > 0 && <p><strong>Skills:</strong> {selectedCertificate.skills.join(', ')}</p>}
        </Modal>
      )}

      {/* Add Certificate Modal */}
      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)} isDark={isDark}>
          <h2>Add New Certificate</h2>
          <form onSubmit={handleAddCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="Name" value={newCert.name} onChange={e => setNewCert({...newCert, name: e.target.value})} required style={inputStyle(isDark)} />
            <input type="text" placeholder="Organization" value={newCert.issuing_organization} onChange={e => setNewCert({...newCert, issuing_organization: e.target.value})} required style={inputStyle(isDark)} />
            <input type="text" placeholder="Type" value={newCert.certificate_type} onChange={e => setNewCert({...newCert, certificate_type: e.target.value})} required style={inputStyle(isDark)} />
            <input type="date" placeholder="Issue Date" value={newCert.issue_date} onChange={e => setNewCert({...newCert, issue_date: e.target.value})} required style={inputStyle(isDark)} />
            <input type="date" placeholder="Expiry Date" value={newCert.expiry_date} onChange={e => setNewCert({...newCert, expiry_date: e.target.value})} style={inputStyle(isDark)} />
            <input type="text" placeholder="Credential ID" value={newCert.credential_id} onChange={e => setNewCert({...newCert, credential_id: e.target.value})} style={inputStyle(isDark)} />
            <input type="text" placeholder="Description" value={newCert.description} onChange={e => setNewCert({...newCert, description: e.target.value})} style={inputStyle(isDark)} />
            <input type="text" placeholder="Skills (comma separated)" value={newCert.skills} onChange={e => setNewCert({...newCert, skills: e.target.value})} style={inputStyle(isDark)} />
            <button type="submit" style={{ ...inputStyle(isDark), backgroundColor: '#1e40af', color: '#fff', border: 'none', cursor: 'pointer' }}>Add Certificate</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ children, onClose, isDark }) => (
  <div style={{
    position: 'fixed', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
  }}>
    <div style={{
      backgroundColor: isDark ? '#2b2b2b' : '#fff',
      borderRadius: '8px',
      maxWidth: '600px',
      width: '90%',
      padding: '20px',
      position: 'relative',
      color: isDark ? '#fff' : '#333'
    }}>
      <button onClick={onClose} style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        color: isDark ? '#fff' : '#333'
      }}>
        <FaTimes />
      </button>
      {children}
    </div>
  </div>
);

const thStyle = (isDark) => ({
  textAlign: 'left',
  padding: '12px',
  backgroundColor: isDark ? '#444' : '#333',
  color: '#fff',
  fontSize: '0.95rem'
});

const tdStyle = (isDark) => ({
  padding: '12px',
  borderBottom: `1px solid ${isDark ? '#555' : '#ddd'}`,
  fontSize: '0.9rem'
});

const trStyle = (isDark) => ({
  transition: 'background-color 0.2s',
  cursor: 'default'
});

const inputStyle = (isDark) => ({
  padding: '10px',
  borderRadius: '5px',
  border: `1px solid ${isDark ? '#555' : '#ccc'}`,
  backgroundColor: isDark ? '#1f1f1f' : '#fff',
  color: isDark ? '#fff' : '#333'
});

export default Rewards;
