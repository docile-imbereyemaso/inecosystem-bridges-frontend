import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaSpinner,
} from "react-icons/fa";
import { API_URL } from "../../lib/API";
import { useAuth } from "../../lib/useAuth";
import { toast, ToastContainer } from "react-toastify";

const Connections = () => {
  const [companies, setCompanies] = useState([]);
  const [connectedCompanies, setConnectedCompanies] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${API_URL}admin/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_ineco")}`,
          },
        });
        const data = await res.json();
        if (data.success) setCompanies(data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchConnected = async () => {
      try {
        const res = await fetch(
          `${API_URL}connections/user/${user.user_id}/private-sectors`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token_ineco")}`,
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          const connected = {};
          data.data.forEach((c) => (connected[c.user_id] = true));
          setConnectedCompanies(connected);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConnected();
  }, [user]);

  const handleWhatsApp = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    const msg = encodeURIComponent(
      "Hello! I found you through my community on Ineco's platform."
    );
    window.open(`https://wa.me/25${cleaned}?text=${msg}`, "_blank");
  };

  const handleCall = (phone) => window.open(`tel:${phone}`, "_self");

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <FaSpinner className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );

  // Filter only connected companies
  const connectedList = companies.filter((c) => connectedCompanies[c.user_id]);

  if (connectedList.length === 0)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        You have no connected companies yet.
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Connected Companies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectedList.map((company) => (
          <div
            key={company.user_id}
            className="p-6 bg-white rounded-lg border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{company.company_name}</h2>
            <span className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
              {company.industry || "Industry"}
            </span>

            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <FaUsers className="mr-2" /> {company.company_size}
              </div>
              <div className="flex items-center">
                <FaBuilding className="mr-2" />
                {company.first_name} {company.last_name}
              </div>
              <p className="text-gray-600 mt-2">{company.bio || "No description"}</p>

              {company.phone && (
                <div className="flex items-center mt-2">
                  <FaPhone className="mr-2" /> {company.phone}
                </div>
              )}
              {company.email && (
                <div className="flex items-center mt-2">
                  <FaEnvelope className="mr-2" /> {company.email}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {company.phone && (
                  <>
                    <button
                      onClick={() => handleWhatsApp(company.phone)}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center gap-2"
                    >
                      <FaWhatsapp /> WhatsApp
                    </button>
                    <button
                      onClick={() => handleCall(company.phone)}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
                    >
                      <FaPhone /> Call
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
