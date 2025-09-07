import { useState, useEffect } from "react";
import { FaUsers, FaGraduationCap, FaChartBar, FaDownload, FaPlus } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Statistics = () => {
  const token = localStorage.getItem("token_ineco");
  const userType = localStorage.getItem("user_type");
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [activeTab, setActiveTab] = useState("skills");

  const [totalUsers, setTotalUsers] = useState(0);
  const [companyStatusData, setCompanyStatusData] = useState([]);
  const [opportunitiesStats, setOpportunitiesStats] = useState({ total: 0, byType: {} });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/allusers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setTotalUsers(data.users.length);
      } catch (err) { console.error(err); }
    };
    fetchUsers();
  }, [token]);

useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.users)) {
        // Map true -> Registered, false -> Pending
        const statusCounts = [
          {
            name: "Registered",
            value: data.users.filter((c) => c.is_approved === true).length,
            color: "#10b981", // green
          },
          {
            name: "Pending",
            value: data.users.filter((c) => c.is_approved === false).length,
            color: "#f59e0b", // yellow
          },
        ];

        setCompanyStatusData(statusCounts);
      }
    } catch (err) {
      console.error("Error fetching company status:", err);
    }
  };

  fetchCompanies();
}, [token]);


  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/getopportunities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.opportunities)) {
          const total = data.opportunities.length;
          const byType = {};
          data.opportunities.forEach((op) => {
            byType[op.type] = (byType[op.type] || 0) + 1;
          });
          setOpportunitiesStats({ total, byType });
        }
      } catch (err) { console.error(err); }
    };
    fetchOpportunities();
  }, [token]);

  const generateReport = () => {
    alert(`Report for ${selectedReport} generated for period: ${selectedPeriod}`);
  };

  const COLORS = ["#10b981", "#f59e0b"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">Statistics Analysis</h2>
          <p className="text-slate-400">Comprehensive analytics and reporting dashboard</p>
        </div>
        <div className="flex items-center space-x-4">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-40 bg-slate-700 border border-slate-600 text-white p-2 rounded">
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <select value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)}
            className="w-48 bg-slate-700 border border-slate-600 text-white p-2 rounded">
            <option value="overview">Overview Report</option>
            <option value="skills">Skills Analysis</option>
            <option value="companies">Company Report</option>
            
            <option value="opportunities">Opportunities Report</option>
          </select>
          <button onClick={generateReport} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            <FaDownload className="mr-2" /> Generate Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 border border-slate-700 p-4 rounded">
          <p className="text-sm text-slate-400">Total Users</p>
          <p className="text-2xl font-semibold text-white">{totalUsers}</p>
          <FaUsers className="h-8 w-8 text-blue-500 mt-2" />
        </div>
        <div className="bg-slate-800 border border-slate-700 p-4 rounded">
          <p className="text-sm text-slate-400">Total Opportunities</p>
          <p className="text-2xl font-semibold text-white">{opportunitiesStats.total}</p>
          <FaGraduationCap className="h-8 w-8 text-green-500 mt-2" />
        </div>
       
        
      </div>

      {/* Tabs */}
      <div>
        <div className="flex bg-slate-800 border border-slate-700 rounded overflow-hidden">
          {["skills", "companies", "opportunities"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-white ${activeTab === tab ? "bg-blue-600" : ""}`}>
              {tab === "skills" && "Skills Analysis"}
              {tab === "companies" && "Company Status"}
              
              {tab === "opportunities" && "Opportunities"}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {/* Company Status Tab */}
          {activeTab === "companies" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-700 p-4 rounded">
                <h3 className="text-white mb-2">Company Registration Status</h3>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={companyStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                          {companyStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 p-2">
                    {companyStatusData.map((item, index) => (
                      <div key={index} className="flex justify-between p-2 bg-slate-700 rounded mb-2">
                        <span className="text-white">{item.name}</span>
                        <span className="text-white">{item.value}</span>
                      </div>
                    ))}
                    <p className="text-sm text-slate-400 mt-2">
                      Total Companies: {companyStatusData.reduce((sum, item) => sum + item.value, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Opportunities Tab */}
          {activeTab === "opportunities" && (
            <div className="bg-slate-800 border border-slate-700 p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white">Opportunities Overview</h3>
                {(userType === "tvet" || userType === "admin") && (
                  <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded flex items-center">
                    <FaPlus className="mr-1" /> Add Opportunity
                  </button>
                )}
              </div>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(opportunitiesStats.byType).map(([key, value]) => ({ type: key, value }))}>
                      <XAxis dataKey="type" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 p-2">
                  {Object.entries(opportunitiesStats.byType).map(([key, value], index) => (
                    <div key={index} className="flex justify-between p-2 bg-slate-700 rounded mb-2">
                      <span className="text-white">{key}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                  <p className="text-sm text-slate-400 mt-2">
                    Total Opportunities: {opportunitiesStats.total}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
