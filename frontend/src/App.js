import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Onboarding from "./pages/Onboarding.js";
import { AuthProvider } from "./components/generalComponents/authContext.js";
import Header from "./components/Header.js";
import HomePage from "./pages/HomePage.js";
import UniversityList from "./pages/UniversityList.js";
import ContactForm from "./pages/Contact.js";
import StaticFooter from "./components/StaticFooter.js";
import UniversityDetail from "./pages/UniversityDetail.js";
import ShortlistedUniversities from "./pages/Shortlisted.js";
import ApplySection from "./pages/applied.js";
import FAQ from "./pages/FAQ.js";
import Scholarships from "./pages/Scholarships.js";
import StudentApplicationForm from "./pages/StudentApplicationForm.js";
import SemesterDatesForm from "./pages/SemesterDatesForm.js";
import AdminHeader from "./components/AdminHeader.js";
import AdminFooter from "./components/AdminFooter.js";
import SemesterApplicationDatesPage from "./components/SemesterApplication";
import UniversityCRUD from "./pages/UniversityCRUD.js";
import AdminLogin from "./pages/adminLogin.js"; // Import AdminLogin component
import CountryManager from "./pages/CountryManager.js";
import Notifications from "./pages/Notifications.js";
function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin-module");

  return (
    <>
      {isAdminRoute ? <AdminHeader /> : <Header />}
      {children}
      {isAdminRoute ? <AdminFooter /> : <StaticFooter />}
    </>
  );
}

function App() {
  const [shortlisted, setShortlisted] = useState([]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<HomePage />} />
            <Route
              path="/Universities"
              element={
                <UniversityList
                  shortlisted={shortlisted}
                  setShortlisted={setShortlisted}
                />
              }
            />
            <Route path="/contact" element={<ContactForm />} />
            <Route
              path="/shortlisted"
              element={
                <ShortlistedUniversities
                  shortlisted={shortlisted}
                  setShortlisted={setShortlisted}
                />
              }
            />
            <Route path="/applied" element={<ApplySection />} />
            <Route path="/university/:id" element={<UniversityDetail />} />
            <Route path="/profile" element={<StudentApplicationForm />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Admin Module Routes */}
            <Route
              path="/admin-module/view/semester-application-dates"
              element={<SemesterApplicationDatesPage />}
            />
            <Route
              path="/admin-module/update/semester-application-dates"
              element={<SemesterDatesForm />}
            ></Route>
            <Route path="/admin-module" element={<UniversityCRUD />}></Route>
            <Route
              path="/admin-module/country-management"
              element={<CountryManager />}
            ></Route>
            <Route path="/admin-module/login" element={<AdminLogin />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

// import React, { useState } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Onboarding from "./pages/Onboarding.js";
// import { AuthProvider } from "./components/generalComponents/authContext.js";
// import Header from "./components/Header.js";
// import HomePage from "./pages/HomePage.js";
// import UniversityList from "./pages/UniversityList.js";
// import ContactForm from "./pages/Contact.js";
// import StaticFooter from "./components/StaticFooter.js";
// import UniversityDetail from "./pages/UniversityDetail.js";
// import ShortlistedUniversities from "./pages/Shortlisted.js";
// import Applied from "./pages/applied.js";
// import Shortlisted from "./pages/Shortlisted.js";
// import FAQ from "./pages/FAQ.js";
// import Scholarships from "./pages/Scholarships.js";
// import StudentProfile from "./components/StudentProfile.js";
// import SemesterDatesForm from "./pages/SemesterDatesForm.js";

// function App() {
//   // State to store shortlisted universities
//   const [shortlisted, setShortlisted] = useState([]);

//   return (
//     <AuthProvider>
//       <BrowserRouter
//         future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
//       >
//         <Header />
//         <Routes>
//           <Route path="/onboarding" element={<Onboarding />} />
//           <Route path="/" element={<HomePage />} />
//           <Route
//             path="/Universities"
//             element={
//               <UniversityList
//                 shortlisted={shortlisted}
//                 setShortlisted={setShortlisted}
//               />
//             }
//           />
//           <Route path="/contact" element={<ContactForm />} />
//           <Route path="/shortlisted" element={<Shortlisted />} />
//           <Route path="/applied" element={<Applied />} />
//           <Route path="/university/:id" element={<UniversityDetail />} />
//           <Route path="/profile" element={<StudentProfile />} />
//           <Route path="/FAQ" element={<FAQ />} />
//           <Route path="/scholarships" element={<Scholarships />} />
//           <Route path="/admin-module" element={<SemesterDatesForm />} />

//           <Route
//             path="/shortlisted"
//             element={
//               <ShortlistedUniversities
//                 shortlisted={shortlisted}
//                 setShortlisted={setShortlisted}
//               />
//             }
//           />
//         </Routes>
//         <StaticFooter />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;
