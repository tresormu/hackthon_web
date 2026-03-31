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
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminHeader } from './components/layout/AdminHeader';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminSettings } from './components/admin/AdminSettings';
import { FinancialRecordsComponent } from './components/financial/FinancialRecords';
import { AnalysisComponent } from './components/financial/Analysis';
import { PaymentManagementComponent } from './components/financial/PaymentManagement';
import { PaymentPlans } from './components/auth/PaymentPlans';
import { DoctorSettings } from './components/doctor/DoctorSettings';
import type { PaymentPlan } from './types/payment';
import { createSubscription } from './utils/paymentHelpers';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [currentPage, setCurrentPage] = useState<'overview' | 'patients' | 'alerts' | 'chw' | 'postnatal' | 'financial-records' | 'analysis' | 'payment' | 'settings'>('overview');
  const [adminPage, setAdminPage] = useState<'overview' | 'users' | 'billing' | 'analytics' | 'settings'>('overview');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<'administrator' | 'hospital' | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentPlans, setShowPaymentPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);

  const handleAuth = (role?: 'administrator' | 'hospital') => {
    setIsAuthenticated(true);
    setAuthMode(null);
    setUserRole(role || 'administrator');
  };

  const handlePlanSelection = (plan: PaymentPlan) => {
    setSelectedPlan(plan);
    setShowPaymentPlans(false);
  };

  const handleManageSubscription = () => {
    setShowPaymentPlans(true);
  };

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onOpenAuth={(mode) => setAuthMode(mode)} />
        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onAuth={handleAuth}
            onSwitchMode={setAuthMode}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {userRole === 'administrator' ? (
        <>
          <AdminSidebar onNavigate={setAdminPage} currentPage={adminPage} />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <AdminHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <main className="flex-1 p-8 pb-12 overflow-y-auto">
              {adminPage === 'overview' && <AdminDashboard activeTab={adminPage} />}
              {adminPage === 'settings' && <AdminSettings />}
            </main>
          </div>
        </>
      ) : (
        <>
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
              {currentPage === 'financial-records' && <FinancialRecordsComponent />}
              {currentPage === 'analysis' && <AnalysisComponent />}
              {currentPage === 'payment' && (
                <>
                  {showPaymentPlans ? (
                    <PaymentPlans 
                      onSelectPlan={handlePlanSelection}
                      billingCycle={billingCycle}
                      onBillingCycleChange={setBillingCycle}
                    />
                  ) : (
                    <PaymentManagementComponent onManageSubscription={handleManageSubscription} />
                  )}
                </>
              )}
              {currentPage === 'settings' && <DoctorSettings />}
            </main>
          </div>
        </>
      )}

      <RegisterPatientModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default App;
