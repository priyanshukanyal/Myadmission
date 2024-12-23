import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Onboarding from "./pages/Onboarding.js";
import { AuthProvider } from "./components/generalComponents/authContext.js";
import Header from "./components/Header.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import UniversityList from "./pages/UniversityList.js";
import ContactForm from "./pages/Contact.js";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />;
          <Route path="/" element={<HomePage />} />;
          <Route path="/Universities" element={<UniversityList />} />;
          <Route path="/contact" element={<ContactForm />} />;
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
