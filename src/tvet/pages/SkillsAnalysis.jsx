import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { FaChartPie, FaUsers, FaBuilding } from "react-icons/fa";
import {useAuth} from '../../lib/useAuth'
import {API_URL} from '../../lib/API.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const SkillsOpportunityAnalysis = () => {
  const token = localStorage.getItem("token_ineco");
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resUsers = await fetch(`${API_URL}admin/allusers`, { headers: { Authorization: `Bearer ${token}` } });
        const dataUsers = await resUsers.json();
        if (dataUsers.success) setUsers(dataUsers.users);

        const resCompanies = await fetch(`${API_URL}admin/list`, { headers: { Authorization: `Bearer ${token}` } });
        const dataCompanies = await resCompanies.json();
        if (dataCompanies.success) setCompanies(dataCompanies.users);

        const resOpportunities = await fetch(`${API_URL}admin/getopportunities`, { headers: { Authorization: `Bearer ${token}` } });
        const dataOpportunities = await resOpportunities.json();
        if (dataOpportunities.success) setOpportunities(dataOpportunities.opportunities);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return <p className="text-center text-slate-400">Loading data...</p>;

  const totalUsers = users.length;
  const totalCompanies = companies.length;
  const totalOpportunities = opportunities.length;

  // Chance per user
  const chancePerUser = totalUsers > 0 ? ((totalOpportunities / totalUsers) * 100).toFixed(2) : 0;

  // Opportunities per company
  const opportunitiesPerCompany = companies.map(company => {
    const companyOppCount = opportunities.filter(opp => opp.company_id === company.user_id).length;
    return { name: company.company_name || `${company.first_name} ${company.last_name}`, count: companyOppCount };
  });

  // Chart data
  const barChartData = {
    labels: opportunitiesPerCompany.map(c => c.name),
    datasets: [
      {
        label: "Opportunities per Company",
        data: opportunitiesPerCompany.map(c => c.count),
        backgroundColor: "rgba(34,197,94,0.7)",
      },
    ],
  };

  const pieChartData = {
    labels: ["Chance to get Opportunity", "No Opportunity"],
    datasets: [
      {
        data: [chancePerUser, 100 - chancePerUser],
        backgroundColor: ["rgba(59,130,246,0.7)", "rgba(156,163,175,0.7)"],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Total Users</p>
            <p className="text-2xl font-semibold text-white">{totalUsers}</p>
          </div>
          <FaUsers className="h-8 w-8 text-blue-500" />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Total Companies</p>
            <p className="text-2xl font-semibold text-white">{totalCompanies}</p>
          </div>
          <FaBuilding className="h-8 w-8 text-green-500" />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Total Opportunities</p>
            <p className="text-2xl font-semibold text-white">{totalOpportunities}</p>
          </div>
          <FaChartPie className="h-8 w-8 text-yellow-500" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h2 className="text-xl text-white font-bold mb-4">Opportunities per Company</h2>
          <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h2 className="text-xl text-white font-bold mb-4">Chance per User to Get Opportunity (%)</h2>
          <Pie data={pieChartData} options={{ responsive: true }} />
          <p className="text-white mt-2 text-center">~{chancePerUser}% chance for each user</p>
        </div>
      </div>
    </div>
  );
};

export default SkillsOpportunityAnalysis;
