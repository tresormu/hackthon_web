import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Overview } from './components/dashboard/Overview';
import { PatientList } from './components/patients/PatientList';
import { RegisterPatientModal } from './components/patients/RegisterPatientModal';
import { MissedVisitAlerts } from './components/appointments/MissedVisitAlerts';
import { UmujyanamaCoordination } from './components/appointments/UmujyanamaCoordination';
import { PostnatalCare } from './components/patients/PostnatalCare';
import { LandingPage } from './components/auth/LandingPage';
import { AuthModal } from './components/auth/AuthModal';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [currentPage, setCurrentPage] = useState<'overview' | 'patients' | 'alerts' | 'chw' | 'postnatal'>('overview');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onOpenAuth={(mode) => setAuthMode(mode)} />
        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onAuth={() => { setIsAuthenticated(true); setAuthMode(null); }}
            onSwitchMode={setAuthMode}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 p-8 pb-12 overflow-y-auto">
          {currentPage === 'overview' && <Overview searchQuery={searchQuery} />}
          {currentPage === 'patients' && (
            <PatientList
              onOpenRegister={() => setIsRegisterModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}
          {currentPage === 'alerts' && <MissedVisitAlerts />}
          {currentPage === 'chw' && <UmujyanamaCoordination />}
          {currentPage === 'postnatal' && <PostnatalCare />}
        </main>
      </div>

      <RegisterPatientModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default App;
