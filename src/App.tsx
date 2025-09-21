import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
import { ToastContainer } from "react-toastify";
import PitchDeck from "./pages/PitchDeck";
import TechnicalDocs from "./pages/TechnicalDocs";
import Demo from "./pages/DemoPage";

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 transition-colors duration-200 flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/docs" element={<TechnicalDocs />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/pitch-deck" element={<PitchDeck />} />
            <Route path="/app/*" element={<Dashboard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ToastContainer />
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
