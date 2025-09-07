
import Patnerships from './Patnerships'
import Opportunities from './Opportunities'
import Statistics from './Statistics.tsx'
import SkillsOpportunityAnalysis from './SkillsAnalysis.jsx'


const TvetDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* You can add dashboard stats here if needed */}

      
      
      {/* Private Companies Section */}
      <Patnerships />

      {/* Opportunities Section */}
      <Opportunities />


      <Statistics/>



      <SkillsOpportunityAnalysis/>
    </div>
  );
};

export default TvetDashboard;
