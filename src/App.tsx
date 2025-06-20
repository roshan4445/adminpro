import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Header } from '@/components/Layout/Header';
import { DashboardOverview } from '@/components/Dashboard/DashboardOverview';
import { ComplaintsPanel } from '@/components/Complaints/ComplaintsPanel';
import { SchemesPanel } from '@/components/Schemes/SchemesPanel';
import { TrafficPanel } from '@/components/Traffic/TrafficPanel';
import { ElderlyPanel } from '@/components/Elderly/ElderlyPanel';
import { ScamPanel } from '@/components/Scam/ScamPanel';
import { AdminToolsPanel } from '@/components/AdminTools/AdminToolsPanel';

const sectionTitles = {
  dashboard: 'Dashboard Overview',
  complaints: 'Complaint Management',
  schemes: 'Schemes Management',
  traffic: 'Traffic & City Issues',
  elderly: 'Elderly Skill Program',
  'scam-alerts': 'Scam Reports & Alerts',
  'admin-tools': 'Admin Tools'
};

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'complaints':
        return <ComplaintsPanel />;
      case 'schemes':
        return <SchemesPanel />;
      case 'traffic':
        return <TrafficPanel />;
      case 'elderly':
        return <ElderlyPanel />;
      case 'scam-alerts':
        return <ScamPanel />;
      case 'admin-tools':
        return <AdminToolsPanel />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex h-screen bg-background">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
        />
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isMobile={true}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={sectionTitles[activeSection as keyof typeof sectionTitles]} />
          
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      
      <Toaster />
    </ThemeProvider>
  );
}

export default App;