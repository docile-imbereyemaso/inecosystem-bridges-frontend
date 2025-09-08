import React, { useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa";

import {API_URL} from '../../lib/API.js'

interface Company {
  id: number;
  name: string;
  industry: string;
  contact: string;
}

const LandingPrivateSectors = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token_ineco");

        const res = await fetch(`${API_URL}admin/list`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch companies");

        const data = await res.json();
        const list = data.users || [];

        const mapped = list
          .filter((u: any) => u.is_approved) // only registered companies
          .map((u: any) => ({
            id: u.user_id,
            name: u.company_name || `${u.first_name} ${u.last_name}`,
            industry: u.industry || "N/A",
            contact: u.email || "",
          }));

        setCompanies(mapped);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return <p className="text-center text-slate-400 mt-8">Loading companies...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-white text-center">
        Private Sectors Available for TVET Graduates
      </h2>
      <p className="text-slate-400 text-center">
        Connect with registered companies to explore opportunities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.length > 0 ? (
          companies.map((company) => (
            <div
              key={company.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col justify-between"
            >
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FaBuilding className="text-blue-500 w-5 h-5" />
                  <h3 className="text-white font-semibold text-lg">{company.name}</h3>
                </div>
                <p className="text-slate-400">Industry: {company.industry}</p>
                <p className="text-slate-400">Contact: {company.contact}</p>
              </div>
              <button
                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
                onClick={() => alert(`Connecting to ${company.name}`)} // Replace with real action
              >
                Connect
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-400 col-span-full">
            No registered companies available.
          </p>
        )}
      </div>
    </div>
  );
};

export default LandingPrivateSectors;
