import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaCheck,
  FaSpinner,
  FaHandshake,
} from "react-icons/fa";
import { API_URL } from "../../lib/API";
import { useAuth } from "../../lib/useAuth";
import { toast, ToastContainer } from "react-toastify";

const PrivateSectorConnections = () => {
  const [users, setUsers] = useState([]);
  const [connectedCompanies, setConnectedCompanies] = useState({});
  const [loadingConnections, setLoadingConnections] = useState({});
  const [loading, setLoading] = useState(true); // start as true
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}admin/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_ineco")}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch private sector users", error);
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchConnections = async () => {
        try {
          const response = await fetch(
            `${API_URL}connections/user/${user.user_id}/private-sectors`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token_ineco")}`,
              },
            }
          );
          const data = await response.json();
          if (data.success) {
            const connected = {};
            data.data.forEach((company) => {
              connected[company.user_id] = true;
            });
            setConnectedCompanies(connected);
          }
        } catch (error) {
          console.error("Failed to fetch user connections", error);
        }
      };
      fetchConnections();
    }
  }, [user]);

  const handleConnection = async (company_id) => {
    setLoadingConnections((prev) => ({ ...prev, [company_id]: true }));
    try {
      const data = await fetch(`${API_URL}connections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token_ineco")}`,
        },
        body: JSON.stringify({
          connected_user_id: user.user_id,
          user_id: company_id,
        }),
      }).then((res) => res.json());

      if (data.success) {
        toast.success("Connection request sent successfully");
        setConnectedCompanies((prev) => ({ ...prev, [company_id]: true }));
      }
    } catch (error) {
      console.error("Connection request failed", error);
      toast.error("Connection request failed. Please try again.");
    } finally {
      setLoadingConnections((prev) => ({ ...prev, [company_id]: false }));
    }
  };

  const themeClasses = "bg-gray-50 text-gray-900";
  const cardClasses = "bg-white border-gray-200";

  // Get only connected companies
  const connectedUsers = users.filter((p) => connectedCompanies[p.user_id]);

  return (
    <div className={`min-h-screen p-6 ${themeClasses} dark:bg-gray-900`}>
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-gray-300">
            Private Sector Connections
          </h1>
          <p className="text-lg text-gray-600">
            View all your connected private sector companies.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="h-10 w-10 animate-spin text-blue-600" />
            <span className="ml-3 text-lg font-medium">
              Loading connections...
            </span>
          </div>
        ) : connectedUsers.length > 0 ? (
          // Companies Grid
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4 rounded-lg">
            {connectedUsers.map((user) => (
              <div
                key={user.user_id}
                className={`p-6 rounded-lg border ${cardClasses} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
              >
                {/* Company Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">
                    {user.company_name}
                  </h3>
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium">
                    {user.industry || "Industry"}
                  </span>
                </div>

                {/* Company Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <FaUsers className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">{user.company_size}</span>
                  </div>
                  <div className="flex items-center">
                    <FaBuilding className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Owner: {user.first_name} {user.last_name}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm mb-4 text-gray-600 line-clamp-3">
                  {user.bio || "No description provided."}
                </p>

                {/* Contact Info + Connection Status */}
                <div className="border-t pt-4 space-y-3">
                  {user.phone && (
                    <div className="flex items-center">
                      <FaPhone className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center">
                      <FaEnvelope className="h-4 w-4 mr-2 text-gray-500" />
                      <a
                        href={`mailto:${user.email}`}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {user.email}
                      </a>
                    </div>
                  )}

                  <div className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-4 py-3 rounded-lg">
                    <FaCheck className="h-4 w-4" />
                    Connected
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // No companies found
          <div className={`text-center py-12 ${cardClasses} rounded-lg`}>
            <FaBuilding className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">
              No Connected Companies
            </h3>
            <p className="text-gray-600">
              You don’t have any connected private sector companies yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateSectorConnections;
