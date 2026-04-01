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
import { RegistrationPaymentFlow } from './components/auth/RegistrationPaymentFlow';
import { PaymentCallback } from './components/payment/PaymentCallback';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminHeader } from './components/layout/AdminHeader';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminSettings } from './components/admin/AdminSettings';
import { FinancialRecordsComponent } from './components/financial/FinancialRecords';
import { AnalysisComponent } from './components/financial/Analysis';
import { PaymentManagementComponent } from './components/financial/PaymentManagement';
import { DoctorSettings } from './components/doctor/DoctorSettings';
import { SubscriptionBanner } from './components/payment/SubscriptionBanner';
import { useAuth } from './contexts/AuthContext';

type DoctorPage = 'overview' | 'patients' | 'alerts' | 'chw' | 'postnatal' | 'financial-records' | 'analysis' | 'payment' | 'settings';
type AdminPage = 'overview' | 'users' | 'billing' | 'analytics' | 'settings';

function getCallbackTxRef(): string | null {
  const params = new URLSearchParams(window.location.search);
  const txRef = params.get('tx_ref');
  const status = params.get('status');
  if (txRef && status) return txRef;
  return null;
}

const App = () => {
  const { user, loading, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [currentPage, setCurrentPage] = useState<DoctorPage>('overview');
  const [adminPage, setAdminPage] = useState<AdminPage>('overview');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [patientRefreshTrigger, setPatientRefreshTrigger] = useState(0);
  const [showRegistrationPayment, setShowRegistrationPayment] = useState(false);
  const [callbackTxRef] = useState<string | null>(() => getCallbackTxRef());


  const handleLoginSuccess = () => {
    // Login: just close modal, go straight to dashboard
    setAuthMode(null);
  };

  const handleRegisterSuccess = () => {
    // Register: close modal, show payment plan selection
    setAuthMode(null);
    setShowRegistrationPayment(true);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentPage('overview');
    setAdminPage('overview');
    setShowRegistrationPayment(false);
    window.history.replaceState({}, '', window.location.pathname);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading MamaCare+...</p>
        </div>
      </div>
    );
  }

  // Flutterwave payment callback
  if (user && callbackTxRef) {
    return (
      <PaymentCallback
        txRef={callbackTxRef}
        onSuccess={() => {
          window.history.replaceState({}, '', window.location.pathname);
          window.location.reload();
        }}
        onFailure={() => {
          window.history.replaceState({}, '', window.location.pathname);
          setShowRegistrationPayment(true);
        }}
      />
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <>
        <LandingPage onOpenAuth={(mode) => setAuthMode(mode)} />
        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onAuth={authMode === 'register' ? handleRegisterSuccess : handleLoginSuccess}
            onSwitchMode={setAuthMode}
          />
        )}
      </>
    );
  }

  // Post-registration payment flow
  if (showRegistrationPayment) {
    return (
      <RegistrationPaymentFlow onSkip={() => setShowRegistrationPayment(false)} />
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {isAdmin ? (
        <>
          <AdminSidebar onNavigate={setAdminPage} currentPage={adminPage} user={user} onLogout={handleLogout} />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <AdminHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <main className="flex-1 p-8 pb-12 overflow-y-auto">
              {adminPage === 'overview' && <AdminDashboard activeTab="overview" />}
              {adminPage === 'users' && <AdminDashboard activeTab="users" />}
              {adminPage === 'billing' && <AdminDashboard activeTab="billing" />}
              {adminPage === 'analytics' && <AdminDashboard activeTab="analytics" />}
              {adminPage === 'settings' && <AdminSettings />}
            </main>
          </div>
        </>
      ) : (
        <>
          <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} user={user} onLogout={handleLogout} />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <SubscriptionBanner onRenew={() => setCurrentPage('payment')} />
            <main className="flex-1 p-8 pb-12 overflow-y-auto">
              {currentPage === 'overview' && <Overview searchQuery={searchQuery} />}
              {currentPage === 'patients' && (
                <PatientList onOpenRegister={() => setIsRegisterModalOpen(true)} searchQuery={searchQuery} refreshTrigger={patientRefreshTrigger} />
              )}
              {currentPage === 'alerts' && <MissedVisitAlerts />}
              {currentPage === 'chw' && <UmujyanamaCoordination />}
              {currentPage === 'postnatal' && <PostnatalCare />}
              {currentPage === 'financial-records' && <FinancialRecordsComponent />}
              {currentPage === 'analysis' && <AnalysisComponent />}
              {currentPage === 'payment' && <PaymentManagementComponent />}
              {currentPage === 'settings' && <DoctorSettings />}
            </main>
          </div>
        </>
      )}

      <RegisterPatientModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegistered={() => setPatientRefreshTrigger(t => t + 1)}
      />
    </div>
  );
};

export default App;
