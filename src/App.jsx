import { BrowserRouter as Router, Routes, Route } from "react-router";

import Tvetmatters from "./pages/Tvetmatters";
import AIChatbot from "./pages/aiChatbot/AIChatbot";
import Login from "./pages/Login";
import IndividualSignUp from "./pages/IndividualSignUp";
import NotFound from "./pages/otherpages/NotFound";


import UserNotFound from "./user/pages/OtherPage/NotFound";
import TVETBridgePlatform from "./pages/TVETBridgePlatform";


import TvetNotFound from "./tvet/pages/OtherPage/NotFound";
import PrivateNotFound from "./privatesector/pages/OtherPage/NotFound";
import UserProfiles from "./user/pages/UserProfiles";
import AppLayout from "./user/layout/AppLayout";
import { ScrollToTop } from "./user/components/common/ScrollToTop";

import PrivateLayout from "./privatesector/layout/PrivateLayout";
import PrivateSectorProfiles from "./privatesector/pages/PrivateSectorProfile";
import JobBoard from "./privatesector/pages/JobBoard";
import Analytics from "./privatesector/pages/Analytics";
import Internerships from "./privatesector/pages/Internerships";
import Contributions from "./privatesector/pages/Contributions";



import TvetLayout from "./tvet/layout/TvetLayout";
import TvetProfiles from "./tvet/pages/TvetProfiles";
import Training from "./user/pages/Training";
import Home from "./pages/Home";
import Partnerships from "./tvet/pages/Patnerships";
import Feedbacks from "./tvet/pages/Feedbacks";
import Statistics from "./tvet/pages/Statistics";
import Opportunities from "./tvet/pages/Opportunities";
import CompanyRegistration from "./pages/CompanyRegistration";
import ProtectedRoute from "./lib/ProtectedRoute.jsx"
import TvetDashboard from "./tvet/pages/Tvetdashboard.jsx";
import PrivateSector from "./user/pages/PrivateSector.jsx";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Landing and About Us pages outside of dashboard layouts */}
          <Route  index path="/" element={<Home />} />
          <Route path="/tvetmatters" element={<Tvetmatters />} />
          <Route path="/ai-chatbot" element={<AIChatbot />} />
          <Route path="/login" element={<Login />} />

          
          <Route path="/jobBoard" element={<TVETBridgePlatform />} />

          <Route path="/IndividualSignUp" element={<IndividualSignUp />} />
          <Route path="/privateSectorRegistration" element={<CompanyRegistration/>}/>
          


          {/* user Dashboard Layout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index path="/user/profile" element={<UserProfiles />} />
            <Route path="/user/internship" element={<Training />} />
            <Route path="/user/privateSector" element={<PrivateSector />} />
            <Route path="/user/*" element={<UserNotFound />} />
          </Route>
          {/* Private sector Dashboard layout */}
          <Route element={   <ProtectedRoute><PrivateLayout /></ProtectedRoute>}>
            <Route path="/privateSector/profile" element={<PrivateSectorProfiles />} />
            <Route path="/privateSector/jobBoard" element={<JobBoard />} />
            <Route path="/privateSector/internships" element={<Internerships />} />
            <Route path="/privateSector/analytics" element={<Analytics />} />
            <Route path="/privateSector/contributions" element={<Contributions />} />
            <Route path="/privateSector/*" element={<PrivateNotFound />} />
          </Route>
          {/* Tvet Dasboard layout */}
          <Route element={ <ProtectedRoute><TvetLayout /></ProtectedRoute> }>
            <Route path="/tvet/profile" element={<TvetProfiles />} />
            <Route path="/tvet/partnership" element={<Partnerships />} />
            <Route path="/tvet/feedback" element={<Feedbacks />} />
            <Route path="/tvet/statistics" element={<Statistics />} />
            <Route path="/tvet/opportunities" element={<Opportunities />} />
            <Route path="/tvet/*" element={<TvetNotFound />} />
            <Route path="/tvet-dashboard" element={<TvetDashboard />} />
            
          </Route>
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
