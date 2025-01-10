import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Applied from "./pages/applied.js";

function App() {
  // State to store shortlisted universities
  const [shortlisted, setShortlisted] = useState([]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
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
          <Route path="/applied" element={<Applied />} />
          <Route path="/university/:id" element={<UniversityDetail />} />
          <Route
            path="/shortlisted"
            element={
              <ShortlistedUniversities
                shortlisted={shortlisted}
                setShortlisted={setShortlisted}
              />
            }
          />
        </Routes>
        <StaticFooter />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
