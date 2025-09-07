import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaSearch,
  FaPlus,
  FaFilter,
  FaCheck,
  FaHourglassHalf,
} from "react-icons/fa";

type CompanyStatus = "registered" | "pending";

interface Company {
  id: number;
  name: string;
  industry: string;
  registrationDate: string;
  status: CompanyStatus;
  contact: string;
}

const Partnerships = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token_ineco"); // 👈 adjust if you save differently

      const res = await fetch("http://localhost:3000/api/admin/list", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 👈 send token
        },
        credentials: "include", // if backend uses cookies/sessions
      });

      if (!res.ok) throw new Error("Failed to fetch companies");

      const data = await res.json();
      console.log("API response:", data);

      const list = data.users || [];
      const mapped = list.map((u: any) => ({
        id: u.user_id,
        name: u.company_name || `${u.first_name} ${u.last_name}`,
        industry: u.industry || "N/A",
        registrationDate: new Date().toISOString().split("T")[0],
        status: u.is_approved ? "registered" : "pending",
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



  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || company.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: CompanyStatus) => {
    switch (status) {
      case "registered":
        return "bg-green-600 text-white";
      case "pending":
        return "bg-yellow-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const handleStatusChange = (companyId: number, newStatus: CompanyStatus) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === companyId
          ? { ...company, status: newStatus }
          : company
      )
    );
  };

  const registeredCount = companies.filter(
    (c) => c.status === "registered"
  ).length;
  const pendingCount = companies.filter(
    (c) => c.status === "pending"
  ).length;

  if (loading) {
    return <p className="text-center text-slate-400">Loading companies...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Company Management
        </h2>
        <p className="text-slate-400">
          Manage company registrations and track their status
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Companies</p>
              <p className="text-2xl font-semibold text-white">
                {companies.length}
              </p>
            </div>
            <FaBuilding className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Registered</p>
              <p className="text-2xl font-semibold text-green-400">
                {registeredCount}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
              <FaCheck className="text-white text-xs" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Pending</p>
              <p className="text-2xl font-semibold text-yellow-400">
                {pendingCount}
              </p>
            </div>
            <div className="h-8 w-8 bg-yellow-600 rounded-full flex items-center justify-center">
              <FaHourglassHalf className="text-white text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Companies</h3>
            <p className="text-slate-400 text-sm">
              View and manage all registered companies
            </p>
          </div>
          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">
            <FaPlus className="mr-2" />
            Add Company
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 p-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded bg-slate-700 border border-slate-600 text-white px-3 py-2"
            />
          </div>

          <div className="flex items-center bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
            <FaFilter className="mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-700 text-white outline-none"
            >
              <option value="all">All Status</option>
              <option value="registered">Registered</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-slate-300 px-4 py-2">Company Name</th>
                <th className="text-slate-300 px-4 py-2">Industry</th>
                <th className="text-slate-300 px-4 py-2">Registration Date</th>
                <th className="text-slate-300 px-4 py-2">Contact</th>
                <th className="text-slate-300 px-4 py-2">Status</th>
                <th className="text-slate-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-b border-slate-700">
                    <td className="text-white font-medium px-4 py-2">
                      {company.name}
                    </td>
                    <td className="text-slate-300 px-4 py-2">
                      {company.industry}
                    </td>
                    <td className="text-slate-300 px-4 py-2">
                      {company.registrationDate}
                    </td>
                    <td className="text-slate-300 px-4 py-2">
                      {company.contact}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          company.status
                        )}`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={company.status}
                        onChange={(e) =>
                          handleStatusChange(
                            company.id,
                            e.target.value as CompanyStatus
                          )
                        }
                        className="bg-slate-700 border border-slate-600 text-white text-xs rounded px-2 py-1"
                      >
                        <option value="registered">Registered</option>
                        <option value="pending">Pending</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-slate-400 py-4"
                  >
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Partnerships;
