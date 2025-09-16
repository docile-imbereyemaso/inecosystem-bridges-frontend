import { BrowserRouter as Router, Routes, Route } from "react-router";

import Tvetmatters from "./pages/Tvetmatters";
import SuccessStories from "./pages/SuccessStories";
import AIChatbot from "./pages/aiChatbot/AIChatbot";
import PrivateSectorForm from "./pages/PrivateSectorForm";
import Login from "./pages/Login";
import SignUpForm from "./pages/SignUpForm";
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
import PrivateSectorConnections from "./user/pages/PrivateSectorConnections";



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
import { NotificationPage } from "./pages/NotificationPage.jsx";
import MyCommunity from "./privatesector/pages/MyCommunity.jsx";
import AskAi from "./pages/AskAi.jsx";
import Forbidden from "./Forbidden";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Landing and About Us pages outside of dashboard layouts */}
          <Route  index path="/" element={<Home />} />
          <Route path="/tvetmatters" element={<Tvetmatters />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/ai-chatbot" element={<AskAi />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobBoard" element={<TVETBridgePlatform />} />
          <Route path="/IndividualSignUp" element={<IndividualSignUp />} />
          <Route path="/SignUpForm" element={<SignUpForm />} />
          <Route path="/privateSectorRegistration" element={<CompanyRegistration/>}/>
          <Route path="/privateSectorForm" element={<PrivateSectorForm />} />
          
          {/* Forbidden route */}
          <Route path="/forbidden" element={<Forbidden />} />

          {/* user Dashboard Layout */}
          <Route element={<ProtectedRoute roles={['individual']}><AppLayout /></ProtectedRoute>}>
            <Route index path="/user/profile" element={<UserProfiles />} />
            <Route path="/user/internship" element={<Training />} />
            <Route path="/user/privateSector" element={<PrivateSector />} />
            <Route path="/user/private-sector-connections" element={<PrivateSectorConnections />} />
            <Route path="/user/notifications" element={<NotificationPage/>} />
            <Route path="/user/*" element={<UserNotFound />} />
          </Route>
          {/* Private sector Dashboard layout */}
          <Route element={   <ProtectedRoute roles={['private_sector']}><PrivateLayout /></ProtectedRoute>}>
            <Route path="/privateSector/profile" element={<PrivateSectorProfiles />} />
            <Route path="/privateSector/jobBoard" element={<JobBoard />} />
            <Route path="/privateSector/internships" element={<Internerships />} />
            <Route path="/privateSector/analytics" element={<Analytics />} />
            <Route path="/privateSector/contributions" element={<Contributions />} />
            <Route path="/privateSector/notifications" element={<NotificationPage/>} />
            <Route path="/privateSector/community" element={<MyCommunity/>} />
            <Route path="/privateSector/*" element={<PrivateNotFound />} />
          </Route>
          {/* Tvet Dasboard layout */}
          <Route element={ <ProtectedRoute roles={['tvet']}><TvetLayout /></ProtectedRoute> }>
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
