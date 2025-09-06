import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from "../../lib/useAuth";
import { API_URL } from "../../lib/API.js";

export default function PrivateSectorProfiles() {
  const token = localStorage.getItem("token_ineco");
  const { user } = useAuth();

  // Company form state
  const [companyData, setCompanyData] = useState({
    company_name: '',
    bio: '',
    email: '',
    phone: '',
    sectors: []
  });

  // Temp states for adding new items
  const [newLocation, setNewLocation] = useState('');
  const [newContact, setNewContact] = useState({ type: '', value: '' });
  const [newOffering, setNewOffering] = useState('');
  const [loading, setLoading] = useState(true);
  // Fetch company profile
  useEffect(() => {
   
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}users/profile/${user.user_id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log(data)
        if (data) setCompanyData(data.user);
      } catch (err) {
        console.error("Fetch error:", err);
      }finally{
      setLoading(false);
    }
    };

    if(user){
      fetchCompany();
    }
  }, [user, token]);

  // Save company data
  const saveCompany = async () => {
    try {
      const response = await fetch(`${API_URL}users/profile/${user.user_id}`, {
        method: "PUT", // or PUT depending on backend
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(companyData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Company saved successfully!");
      } else {
        alert("Error saving company: " + result.message);
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const addContact = () => {
    if (newContact.type.trim() && newContact.value.trim()) {
      setCompanyData(prev => ({
        ...prev,
        contacts: [...prev.contacts, newContact]
      }));
      setNewContact({ type: '', value: '' });
    }
  };

  const removeContact = (index: number) => {
    setCompanyData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const addOffering = () => {
    if (newOffering.trim()) {
      setCompanyData(prev => ({
        ...prev,
        offerings: [...(prev.offerings || []), newOffering.trim()]
      }));
      setNewOffering('');
    }
  };

  const removeOffering = (index: number) => {
    setCompanyData(prev => ({
      ...prev,
      offerings: prev.offerings.filter((_, i) => i !== index)
    }));
  };

  return (
    <>
      <PageMeta title="INECOSYSTEM BRIDGES" description="" />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">Company Profile</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your company information and details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Basic Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 lg:p-6">
            <h3 className="mb-3 text-base font-semibold text-gray-800 dark:text-white/90 md:mb-5 md:text-lg">
              Basic Information
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyData.company_name || 'No name Detected'}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Company Description (Bio)
                </label>
                <textarea
                  value={companyData.bio}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                  rows={3}
                  placeholder="Describe your company..."
                />
              </div>
            </div>
          </div>

  
          {/* Contacts */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 lg:p-6">
            <h3 className="mb-3 text-base font-semibold text-gray-800 dark:text-white/90 md:mb-5 md:text-lg">
              Contact Information
            </h3>
            <div className="space-y-3 md:space-y-4">
              {/* <div className="space-y-2">
                {(companyData.contacts || [companyData.email, companyData.phone]).map((contact, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300 mb-1">
                        {contact}
                      </span>
                      <p className="text-sm text-gray-800 dark:text-white/90 break-words">{contact}</p>
                    </div>
                    <button
                      onClick={() => removeContact(index)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div> */}

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={companyData.email}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Contact type (Email, Phone, etc.)"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
                <input
                  type="text"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Contact value"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />

              </div>
            </div>
          </div>

          {/* Offerings */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 lg:p-6">
            <h3 className="mb-3 text-base font-semibold text-gray-800 dark:text-white/90 md:mb-5 md:text-lg">
              What We Offer
            </h3>
            <div className="space-y-3 md:space-y-4">
       

              <div className="flex gap-2">
                <input
                  type="text"
                  value={companyData.sectors}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, sectors: e.target.value }))}
                  placeholder="Add new offering..."
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                  onKeyDown={(e) => e.key === 'Enter' && addOffering()}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button onClick={saveCompany} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
